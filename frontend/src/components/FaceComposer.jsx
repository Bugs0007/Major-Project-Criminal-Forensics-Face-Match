import React, { useState, useEffect } from "react";
import "./FaceComposer.css";

const AI_STEPS = [
  "Analyzing selected facial features...",
  "Building feature description prompt...",
  "Sending to AI image generator...",
  "AI is rendering the face — this may take a moment...",
  "Finalizing portrait...",
];

const FaceComposer = ({ onFaceComposed }) => {
  const [featureLibrary, setFeatureLibrary] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [composedSketchUrl, setComposedSketchUrl] = useState(null);
  const [composing, setComposing] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeatureLibrary();
  }, []);

  // Cycle through AI step messages while composing
  useEffect(() => {
    if (!composing) return;
    setAiStep(0);
    const interval = setInterval(() => {
      setAiStep((prev) => (prev < AI_STEPS.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(interval);
  }, [composing]);

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
      setComposedSketchUrl(data.sketch_url);
      if (onFaceComposed) onFaceComposed(data);
    } catch (err) {
      setError(err.message || "Failed to generate face");
      console.error("Face generation error:", err);
    } finally {
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

  /* ---------- render ---------- */
  if (!featureLibrary) {
    return <div className="loading">Loading feature library...</div>;
  }

  return (
    <div className="face-composer">
      <h2>Build Your Face</h2>
      <p>
        Select facial features below, then click <strong>Generate</strong> to
        create a realistic AI sketch
      </p>

      <div className="composer-layout">
        {/* ---- Left: preview / AI processing ---- */}
        <div className="composer-preview">
          <div className="preview-area">
            {/* idle – nothing selected */}
            {!composing && !composedSketchUrl && selectedCount === 0 && (
              <p className="canvas-hint">
                Select features from the right panel
              </p>
            )}

            {/* idle – features selected, not yet generated */}
            {!composing && !composedSketchUrl && selectedCount > 0 && (
              <div className="selection-summary">
                <h3>Selected Features</h3>
                <ul>
                  {Object.entries(selectedFeatures)
                    .filter(([, v]) => v !== null)
                    .map(([ft, fid]) => {
                      const feature = featureLibrary[ft]?.find(
                        (f) => f.id === fid
                      );
                      return (
                        <li key={ft}>
                          <strong>{ft.replace("_", " ")}:</strong>{" "}
                          {feature?.name || fid}
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}

            {/* AI processing animation */}
            {composing && (
              <div className="ai-processing">
                <div className="ai-spinner" />
                <p className="ai-step-text">{AI_STEPS[aiStep]}</p>
                <div className="ai-progress-bar">
                  <div
                    className="ai-progress-fill"
                    style={{
                      width: `${((aiStep + 1) / AI_STEPS.length) * 100}%`,
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
                alt="AI Generated Face"
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
              {composing ? "Generating..." : "Generate with AI"}
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
                    <p>{feature.name}</p>
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
