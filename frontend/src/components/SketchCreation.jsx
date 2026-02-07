import React, { useState } from "react";
import ImageToSketch from "./ImageToSketch";
import FaceComposer from "./FaceComposer";
import "./SketchCreation.css";

const SketchCreation = ({ onSketchReady }) => {
  const [activeMethod, setActiveMethod] = useState("image");

  const handleSketchCreated = (sketchData) => {
    if (onSketchReady) {
      onSketchReady(sketchData);
    }
  };

  return (
    <div className="sketch-creation">
      <div className="method-selector">
        <button
          className={activeMethod === "image" ? "active" : ""}
          onClick={() => setActiveMethod("image")}
        >
          Image to Sketch
        </button>
        <button
          className={activeMethod === "composer" ? "active" : ""}
          onClick={() => setActiveMethod("composer")}
        >
          Feature Builder
        </button>
      </div>

      <div className="method-content">
        {activeMethod === "image" && (
          <ImageToSketch onSketchCreated={handleSketchCreated} />
        )}
        {activeMethod === "composer" && (
          <FaceComposer onFaceComposed={handleSketchCreated} />
        )}
      </div>
    </div>
  );
};

export default SketchCreation;
