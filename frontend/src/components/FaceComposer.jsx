import React, { useState, useEffect } from "react";
import "./FaceComposer.css";

const FaceComposer = ({ onFaceComposed }) => {
  const [featureLibrary, setFeatureLibrary] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState({
    face_shape: null,
    eyes: null,
    nose: null,
    mouth: null,
    eyebrows: null,
  });
  const [composedSketchUrl, setComposedSketchUrl] = useState(null);
  const [composing, setComposing] = useState(false);
  const [error, setError] = useState(null);
  const [enhanceGAN, setEnhanceGAN] = useState(false);

  useEffect(() => {
    loadFeatureLibrary();
  }, []);

  const loadFeatureLibrary = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/faces/sketch/feature-library/",
      );
      const data = await response.json();
      setFeatureLibrary(data);
    } catch (err) {
      console.error("Failed to load feature library:", err);
      setError("Failed to load facial features");
    }
  };

  const handleFeatureSelect = (featureType, featureId) => {
    setSelectedFeatures({
      ...selectedFeatures,
      [featureType]: featureId,
    });
    setComposedSketchUrl(null); // Clear previous result
  };

  const handleComposeFace = async () => {
    // Check if at least some features are selected
    const hasFeatures = Object.values(selectedFeatures).some((f) => f !== null);

    if (!hasFeatures) {
      setError("Please select at least one facial feature");
      return;
    }

    setComposing(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8000/api/faces/sketch/compose-face/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            features: selectedFeatures,
            enhance_gan: enhanceGAN,
            get_encoding: true,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to compose face");
      }

      const data = await response.json();
      setComposedSketchUrl(data.sketch_url);

      if (onFaceComposed) {
        onFaceComposed(data);
      }
    } catch (err) {
      setError(err.message || "Failed to compose face");
      console.error("Face composition error:", err);
    } finally {
      setComposing(false);
    }
  };

  const handleReset = () => {
    setSelectedFeatures({
      face_shape: null,
      eyes: null,
      nose: null,
      mouth: null,
      eyebrows: null,
    });
    setComposedSketchUrl(null);
  };

  if (!featureLibrary) {
    return <div className="loading">Loading feature library...</div>;
  }

  return (
    <div className="face-composer">
      <h2>Build Your Face</h2>
      <p>Select facial features to compose a sketch</p>

      <div className="composer-layout">
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
                    onClick={() => handleFeatureSelect(featureType, feature.id)}
                  >
                    {/* In production, show actual thumbnail */}
                    <div className="feature-thumbnail">{feature.name}</div>
                    <p>{feature.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="composer-preview">
          <h3>Preview</h3>
          <div className="preview-canvas">
            {composedSketchUrl ? (
              <img src={composedSketchUrl} alt="Composed Face" />
            ) : (
              <p>Select features to compose a face</p>
            )}
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={enhanceGAN}
              onChange={(e) => setEnhanceGAN(e.target.checked)}
            />
            <span>Enhance with AI (slower, higher quality)</span>
          </label>

          {error && <div className="error-message">{error}</div>}

          <div className="composer-actions">
            <button
              onClick={handleComposeFace}
              disabled={composing}
              className="compose-button"
            >
              {composing ? "Composing..." : "Compose Face"}
            </button>
            <button onClick={handleReset} className="reset-button">
              Reset
            </button>
          </div>

          {composedSketchUrl && (
            <div className="result-actions">
              <a href={composedSketchUrl} download className="download-button">
                Download Sketch
              </a>
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
      </div>
    </div>
  );
};

export default FaceComposer;
