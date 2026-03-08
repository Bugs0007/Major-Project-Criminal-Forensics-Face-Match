import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./ImageToSketch.css";

const AUTO_SKETCH_OPTIONS = Object.freeze({
  method: "pencil",
  is_blurry: true,
  enhance_gan: true,
  super_resolution: true,
});

const ImageToSketch = ({ onSketchCreated }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [sketchUrl, setSketchUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const generateAndSearchSketch = async (file) => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("method", AUTO_SKETCH_OPTIONS.method);
      formData.append("is_blurry", AUTO_SKETCH_OPTIONS.is_blurry);
      formData.append("enhance_gan", AUTO_SKETCH_OPTIONS.enhance_gan);
      formData.append("super_resolution", AUTO_SKETCH_OPTIONS.super_resolution);
      formData.append("get_encoding", "true");

      const response = await fetch(
        "http://localhost:8000/api/faces/sketch/image-to-sketch/",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate sketch");
      }

      const data = await response.json();
      setSketchUrl(data.sketch_url);

      // Immediately pass generated sketch to parent to switch tab and run search.
      if (onSketchCreated) {
        onSketchCreated(data);
      }
    } catch (err) {
      setError(err.message || "Failed to generate sketch");
      console.error("Sketch generation error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setSketchUrl(null);
      setError(null);
      generateAndSearchSketch(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    multiple: false,
  });

  return (
    <div className="image-to-sketch">
      <h2>Image to Sketch</h2>
      <p>Upload a photo and we will automatically generate a sketch and search the database.</p>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        {previewUrl ? (
          <img src={previewUrl} alt="Original" className="preview-image" />
        ) : (
          <p>
            {isDragActive
              ? "Drop the image here..."
              : "Drag and drop an image, or click to select"}
          </p>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {processing && <div className="success-message">Generating sketch and searching database...</div>}

      {sketchUrl && (
        <div className="sketch-result">
          <h3>Generated Sketch</h3>
          <div className="comparison">
            <div className="comparison-item">
              <img src={previewUrl} alt="Original" />
              <p>Original</p>
            </div>
            <div className="comparison-item">
              <img src={sketchUrl} alt="Sketch" />
              <p>Sketch</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageToSketch;
