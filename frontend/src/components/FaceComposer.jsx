import React, { useState, useEffect, useRef } from "react";
import "./FaceComposer.css";
import FaceSVGPreview from "./FaceSVGPreview";
import { getSvgFeatures } from "./featureData";

/* ── GAN processing steps ────────────────────────────────────── */
const GAN_STEPS = [
  {
    label: "Encoding selected features into latent vector...",
    phase: "encode",
  },
  { label: "Generator producing initial sketch...", phase: "generator" },
  { label: "Discriminator evaluating realism...", phase: "discriminator" },
  {
    label: "Generator refining details (adversarial pass 2)...",
    phase: "generator",
  },
  { label: "Discriminator re-evaluating...", phase: "discriminator" },
  { label: "Generator converging on final output...", phase: "generator" },
  { label: "Discriminator accepted — sketch is realistic!", phase: "accepted" },
];

/* ── Feature order for display ──────────────────────────────── */
const FEATURE_ORDER = [
  "face_shapes",
  "hair",
  "ears",
  "eyebrows",
  "eyes",
  "noses",
  "mouths",
];

const AGE_OPTIONS = [
  "Any",
  "Child",
  "Teenager",
  "20s",
  "30s",
  "40s",
  "50s",
  "60s",
  "70+",
];
const GENDER_OPTIONS = ["Any", "Male", "Female"];
const ETHNICITY_OPTIONS = [
  "Any",
  "East Asian",
  "South Asian",
  "Southeast Asian",
  "Black / African",
  "White / Caucasian",
  "Hispanic / Latino",
  "Middle Eastern",
  "Mixed / Other",
];

const FaceComposer = ({ onFaceComposed }) => {
  const [featureLibrary, setFeatureLibrary] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [composedSketchUrl, setComposedSketchUrl] = useState(null);
  const [composing, setComposing] = useState(false);
  const [ganStep, setGanStep] = useState(0);
  const [error, setError] = useState(null);
  const ganInterval = useRef(null);
  const pendingResult = useRef(null);
  const apiDone = useRef(false);

  // Additional person details
  const [age, setAge] = useState("Any");
  const [gender, setGender] = useState("Any");
  const [ethnicity, setEthnicity] = useState("Any");
  const [additionalNotes, setAdditionalNotes] = useState("");

  useEffect(() => {
    loadFeatureLibrary();
  }, []);

  // Cycle through GAN steps while composing
  useEffect(() => {
    if (!composing) {
      if (ganInterval.current) clearInterval(ganInterval.current);
      return;
    }
    setGanStep(0);
    apiDone.current = false;
    pendingResult.current = null;
    ganInterval.current = setInterval(() => {
      setGanStep((prev) => {
        if (prev < GAN_STEPS.length - 1) return prev + 1;
        // We're at the last step (accepted). If API is done, reveal result.
        if (apiDone.current) {
          clearInterval(ganInterval.current);
          setTimeout(() => {
            if (pendingResult.current) {
              setComposedSketchUrl(pendingResult.current.sketch_url);
              if (onFaceComposed) onFaceComposed(pendingResult.current);
            }
            setComposing(false);
          }, 1500); // Show "accepted" message for 1.5s before revealing
        }
        return prev;
      });
    }, 3500);
    return () => clearInterval(ganInterval.current);
  }, [composing, onFaceComposed]);

  const loadFeatureLibrary = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/faces/sketch/feature-library/",
      );
      const data = await response.json();

      const cacheBuster = Date.now();
      Object.keys(data).forEach((featureType) => {
        data[featureType].forEach((feature) => {
          feature.thumbnail = `${feature.thumbnail}?t=${cacheBuster}`;
        });
      });

      setFeatureLibrary(data);

      const initialSelection = {};
      Object.keys(data).forEach((ft) => {
        initialSelection[ft] = null;
      });
      setSelectedFeatures(initialSelection);
    } catch (err) {
      console.error("Failed to load feature library:", err);
      setError("Failed to load facial features");
    }
  };

  const handleFeatureSelect = (featureType, featureId) => {
    setSelectedFeatures((prev) => ({ ...prev, [featureType]: featureId }));
    setComposedSketchUrl(null);
  };

  const selectedCount = Object.values(selectedFeatures).filter(
    (f) => f !== null,
  ).length;

  /* ---------- find thumbnail URL ---------- */
  const getThumbnailUrl = (featureType) => {
    const featureId = selectedFeatures[featureType];
    if (!featureId || !featureLibrary) return null;
    const feature = featureLibrary[featureType]?.find(
      (f) => f.id === featureId,
    );
    return feature?.thumbnail || null;
  };

  /* ---------- compose ---------- */
  const handleComposeFace = async () => {
    if (selectedCount === 0) {
      setError("Please select at least one facial feature");
      return;
    }

    setComposing(true);
    setError(null);
    setComposedSketchUrl(null);

    try {
      const response = await fetch(
        "http://localhost:8000/api/faces/sketch/compose-face/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            features: selectedFeatures,
            get_encoding: true,
            age: age !== "Any" ? age : undefined,
            gender: gender !== "Any" ? gender : undefined,
            ethnicity: ethnicity !== "Any" ? ethnicity : undefined,
            additional_notes: additionalNotes.trim() || undefined,
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate face");
      }

      const data = await response.json();
      // Store result but don't reveal yet — let GAN animation finish
      pendingResult.current = data;
      apiDone.current = true;
    } catch (err) {
      setError(err.message || "Failed to generate face");
      console.error("Face generation error:", err);
      setComposing(false);
    }
  };

  const handleReset = () => {
    if (featureLibrary) {
      const resetSelection = {};
      Object.keys(featureLibrary).forEach((ft) => {
        resetSelection[ft] = null;
      });
      setSelectedFeatures(resetSelection);
    }
    setAge("Any");
    setGender("Any");
    setEthnicity("Any");
    setAdditionalNotes("");
    setComposedSketchUrl(null);
    setError(null);
  };

  /* ---------- render ---------- */
  if (!featureLibrary) {
    return <div className="loading">Loading feature library...</div>;
  }

  const currentPhase = composing ? GAN_STEPS[ganStep].phase : null;

  return (
    <div className="face-composer">
      <h2>Build Your Face</h2>
      <p>
        Select facial features below, then click <strong>Generate</strong> to
        create a realistic sketch using GAN
      </p>

      <div className="composer-layout">
        {/* ---- Left: preview / GAN processing ---- */}
        <div className="composer-preview">
          <div className="preview-area">
            {/* SVG Preview - always visible when not composing/showing result */}
            {!composing && !composedSketchUrl && (
              <FaceSVGPreview
                selectedFeatures={selectedFeatures}
                animated={true}
              />
            )}

            {/* GAN processing animation */}
            {composing && (
              <div className="gan-processing">
                {/* Generator vs Discriminator diagram */}
                <div className="gan-diagram">
                  <div
                    className={`gan-node generator ${
                      currentPhase === "generator" ? "active" : ""
                    } ${currentPhase === "accepted" ? "done" : ""}`}
                  >
                    <div className="gan-node-icon">G</div>
                    <span>Generator</span>
                  </div>

                  <div className="gan-flow">
                    <div
                      className={`gan-arrow arrow-forward ${
                        currentPhase === "generator" ? "active" : ""
                      }`}
                    >
                      <span className="arrow-label">fake image</span>
                      <div className="arrow-line" />
                    </div>
                    <div
                      className={`gan-arrow arrow-backward ${
                        currentPhase === "discriminator" ? "active" : ""
                      }`}
                    >
                      <div className="arrow-line" />
                      <span className="arrow-label">feedback</span>
                    </div>
                  </div>

                  <div
                    className={`gan-node discriminator ${
                      currentPhase === "discriminator" ? "active" : ""
                    } ${currentPhase === "accepted" ? "done" : ""}`}
                  >
                    <div className="gan-node-icon">D</div>
                    <span>Discriminator</span>
                  </div>
                </div>

                <p className="gan-step-text" key={ganStep}>
                  {GAN_STEPS[ganStep].label}
                </p>

                <div className="gan-progress-bar">
                  <div
                    className="gan-progress-fill"
                    style={{
                      width: `${((ganStep + 1) / GAN_STEPS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Result */}
            {!composing && composedSketchUrl && (
              <img
                className="composed-result"
                src={composedSketchUrl}
                alt="GAN Generated Face"
              />
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="composer-actions">
            <button
              onClick={handleComposeFace}
              disabled={composing || selectedCount === 0}
              className="compose-button"
            >
              {composing ? "Processing..." : "Generate with GAN"}
            </button>
            <button
              onClick={handleReset}
              disabled={composing}
              className="reset-button"
            >
              Reset
            </button>
          </div>

          {!composing && composedSketchUrl && (
            <div className="result-actions">
              <button
                onClick={() =>
                  onFaceComposed({ sketch_url: composedSketchUrl })
                }
                className="use-button"
              >
                Use for Face Search
              </button>
            </div>
          )}
        </div>

        {/* ---- Right: feature selectors ---- */}
        <div className="feature-selectors">
          {/* Person details section */}
          <div className="feature-category person-details">
            <h3>Person Details (Optional)</h3>
            <div className="details-grid">
              <div className="detail-field">
                <label htmlFor="detail-age">Age</label>
                <select
                  id="detail-age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                >
                  {AGE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="detail-field">
                <label htmlFor="detail-gender">Gender</label>
                <select
                  id="detail-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  {GENDER_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="detail-field">
                <label htmlFor="detail-ethnicity">Ethnicity</label>
                <select
                  id="detail-ethnicity"
                  value={ethnicity}
                  onChange={(e) => setEthnicity(e.target.value)}
                >
                  {ETHNICITY_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="detail-field full-width">
                <label htmlFor="detail-notes">Additional Notes</label>
                <input
                  id="detail-notes"
                  type="text"
                  placeholder='e.g. "scar on left cheek, beard, glasses"'
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Feature categories with SVG previews */}
          {FEATURE_ORDER.map((featureType) => {
            const backendFeatures = featureLibrary[featureType] || [];
            const svgFeatures = getSvgFeatures(featureType);

            if (backendFeatures.length === 0) return null;

            return (
              <div key={featureType} className="feature-category">
                <h3>{featureType.replace("_", " ").toUpperCase()}</h3>
                <div className="feature-options">
                  {backendFeatures.map((feature, index) => {
                    const svgFeature =
                      svgFeatures[index] ||
                      svgFeatures.find((f) => f.id === feature.id);
                    return (
                      <div
                        key={feature.id}
                        className={`feature-option ${
                          selectedFeatures[featureType] === feature.id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          handleFeatureSelect(featureType, feature.id)
                        }
                      >
                        <div className="feature-thumbnail">
                          <FeatureIcon
                            featureType={featureType}
                            feature={svgFeature}
                          />
                        </div>
                        <span className="feature-label">{feature.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Renders a small SVG icon for a feature option
 */
const DEFAULT_SKIN = "#F5D6C6";
const DEFAULT_HAIR = "#3D2314";
const DEFAULT_EYE = "#4A3728";

const FeatureIcon = ({ featureType, feature }) => {
  if (!feature) {
    return <div className="feature-icon-placeholder" />;
  }

  const getIconContent = () => {
    switch (featureType) {
      case "face_shapes":
        return (
          <path
            d={feature.path}
            fill={DEFAULT_SKIN}
            stroke={adjustColorForIcon(DEFAULT_SKIN, -30)}
            strokeWidth="2"
            transform="translate(-10, 0) scale(0.55)"
          />
        );

      case "hair":
        if (!feature.path) {
          // Bald option
          return (
            <text x="50" y="60" textAnchor="middle" fill="#666" fontSize="14">
              Bald
            </text>
          );
        }
        return (
          <>
            {feature.backPath && (
              <path
                d={feature.backPath}
                fill={adjustColorForIcon(DEFAULT_HAIR, -20)}
                transform="translate(-10, 0) scale(0.55)"
              />
            )}
            <path
              d={feature.path}
              fill={DEFAULT_HAIR}
              transform="translate(-10, 0) scale(0.55)"
            />
          </>
        );

      case "eyes":
        return (
          <g transform="translate(-25, 5) scale(0.75)">
            <ellipse
              cx="70"
              cy="50"
              rx="14"
              ry="9"
              fill="white"
              stroke="#ddd"
              strokeWidth="0.5"
            />
            <circle cx="70" cy="50" r="6" fill={DEFAULT_EYE} />
            <circle cx="70" cy="50" r="3" fill="#1a1a1a" />
            <circle cx="72" cy="48" r="2" fill="white" opacity="0.8" />
            <path
              d={feature.leftPath?.replace(/95/g, "50")}
              fill="none"
              stroke="#555"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        );

      case "eyebrows":
        return (
          <g transform="translate(-15, 20) scale(0.8)">
            <path d={feature.leftPath} fill={DEFAULT_HAIR} />
          </g>
        );

      case "noses":
        return (
          <g transform="translate(-5, -40) scale(0.7)">
            <path
              d={feature.path}
              fill="none"
              stroke="#888"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {feature.nostrilsPath && (
              <path d={feature.nostrilsPath} fill="#aaa" />
            )}
          </g>
        );

      case "mouths":
        return (
          <g transform="translate(-5, -125) scale(0.7)">
            <path
              d={feature.path}
              fill={feature.fill || "#C4928A"}
              stroke={adjustColorForIcon(feature.fill || "#C4928A", -20)}
              strokeWidth="1"
            />
          </g>
        );

      case "ears":
        return (
          <g transform="translate(30, -35) scale(0.8)">
            <path
              d={feature.leftPath}
              fill={DEFAULT_SKIN}
              stroke={adjustColorForIcon(DEFAULT_SKIN, -30)}
              strokeWidth="1"
            />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <svg viewBox="0 0 100 100" className="feature-icon-svg">
      {getIconContent()}
    </svg>
  );
};

/**
 * Adjusts a hex color by a given amount
 */
function adjustColorForIcon(hex, amount) {
  if (!hex || typeof hex !== "string") return "#888888";
  hex = hex.replace("#", "");

  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  if (isNaN(r)) r = 128;
  if (isNaN(g)) g = 128;
  if (isNaN(b)) b = 128;

  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default FaceComposer;
