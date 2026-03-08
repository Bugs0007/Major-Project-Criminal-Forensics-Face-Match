import React, { useState, useEffect, useRef } from "react";
import "./FaceComposer.css";

/* ── GAN processing steps ────────────────────────────────────── */
const GAN_STEPS = [
  { label: "Encoding selected features into latent vector...", phase: "encode" },
  { label: "Generator producing initial sketch...", phase: "generator" },
  { label: "Discriminator evaluating realism...", phase: "discriminator" },
  { label: "Generator refining details (adversarial pass 2)...", phase: "generator" },
  { label: "Discriminator re-evaluating...", phase: "discriminator" },
  { label: "Generator converging on final output...", phase: "generator" },
  { label: "Discriminator accepted — sketch is realistic!", phase: "accepted" },
];

/* ── Feature preview layout ──────────────────────────────────── */
const PREVIEW_POSITIONS = {
  face_shapes: { top: "0%", left: "10%", width: "80%", height: "90%", z: 1 },
  hair:        { top: "0%", left: "12%", width: "76%", height: "30%", z: 2 },
  ears:        { top: "28%", left: "4%", width: "92%", height: "22%", z: 3 },
  eyebrows:    { top: "26%", left: "16%", width: "68%", height: "10%", z: 4 },
  eyes:        { top: "32%", left: "16%", width: "68%", height: "14%", z: 5 },
  noses:       { top: "46%", left: "34%", width: "32%", height: "22%", z: 6 },
  mouths:      { top: "64%", left: "24%", width: "52%", height: "14%", z: 7 },
};

const LAYER_ORDER = ["face_shapes", "hair", "ears", "eyebrows", "eyes", "noses", "mouths"];

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
        "http://localhost:8000/api/faces/sketch/feature-library/"
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
    (f) => f !== null
  ).length;

  /* ---------- find thumbnail URL ---------- */
  const getThumbnailUrl = (featureType) => {
    const featureId = selectedFeatures[featureType];
    if (!featureId || !featureLibrary) return null;
    const feature = featureLibrary[featureType]?.find(
      (f) => f.id === featureId
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
          }),
        }
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
    setComposedSketchUrl(null);
    setError(null);
  };

  /* ---------- placed features for preview ---------- */
  const placedFeatures = LAYER_ORDER.filter(
    (ft) => selectedFeatures[ft] != null
  );

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

            {/* Idle — nothing selected */}
            {!composing && !composedSketchUrl && selectedCount === 0 && (
              <p className="canvas-hint">
                Select features from the right panel
              </p>
            )}

            {/* Sketch preview — features selected, not yet generated */}
            {!composing && !composedSketchUrl && selectedCount > 0 && (
              <div className="sketch-preview">
                {placedFeatures.map((ft) => {
                  const url = getThumbnailUrl(ft);
                  const pos = PREVIEW_POSITIONS[ft];
                  if (!url || !pos) return null;
                  return (
                    <img
                      key={ft}
                      className="preview-feature"
                      src={url}
                      alt={ft}
                      style={{
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        height: pos.height,
                        zIndex: pos.z,
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* GAN processing animation */}
            {composing && (
              <div className="gan-processing">
                {/* Generator vs Discriminator diagram */}
                <div className="gan-diagram">
                  <div className={`gan-node generator ${
                    currentPhase === "generator" ? "active" : ""
                  } ${currentPhase === "accepted" ? "done" : ""}`}>
                    <div className="gan-node-icon">G</div>
                    <span>Generator</span>
                  </div>

                  <div className="gan-flow">
                    <div className={`gan-arrow arrow-forward ${
                      currentPhase === "generator" ? "active" : ""
                    }`}>
                      <span className="arrow-label">fake image</span>
                      <div className="arrow-line" />
                    </div>
                    <div className={`gan-arrow arrow-backward ${
                      currentPhase === "discriminator" ? "active" : ""
                    }`}>
                      <div className="arrow-line" />
                      <span className="arrow-label">feedback</span>
                    </div>
                  </div>

                  <div className={`gan-node discriminator ${
                    currentPhase === "discriminator" ? "active" : ""
                  } ${currentPhase === "accepted" ? "done" : ""}`}>
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
          {Object.entries(featureLibrary).map(([featureType, features]) => (
            <div key={featureType} className="feature-category">
              <h3>{featureType.replace("_", " ").toUpperCase()}</h3>
              <div className="feature-options">
                {features.map((feature) => (
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
                      <img
                        src={feature.thumbnail}
                        alt={feature.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <span className="feature-label">{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaceComposer;
