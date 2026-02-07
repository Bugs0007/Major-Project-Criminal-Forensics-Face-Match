import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { faceAPI } from "../services/api";
import "./ImageToSketch.css";

const ImageToSketch = ({ onSketchCreated }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [sketchUrl, setSketchUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({
    method: "adaptive",
    is_blurry: false,
    enhance_gan: false,
  });

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSketchUrl(null);
      setError(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    multiple: false,
  });

  const handleGenerateSketch = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("method", options.method);
      formData.append("is_blurry", options.is_blurry);
      formData.append("enhance_gan", options.enhance_gan);
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

  const handleUseForSearch = () => {
    if (sketchUrl && onSketchCreated) {
      onSketchCreated({ sketch_url: sketchUrl });
    }
  };

  return (
    <div className="image-to-sketch">
      <h2>Image to Sketch</h2>
      <p>Upload a photo (even blurry ones) and convert it to a sketch</p>

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

      {selectedFile && (
        <div className="sketch-options">
          <h3>Sketch Options</h3>

          <label>
            <span>Sketch Method:</span>
            <select
              value={options.method}
              onChange={(e) =>
                setOptions({ ...options, method: e.target.value })
              }
            >
              <option value="adaptive">Adaptive (Best Quality)</option>
              <option value="pencil">Pencil Sketch</option>
              <option value="edge">Edge Detection</option>
            </select>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.is_blurry}
              onChange={(e) =>
                setOptions({ ...options, is_blurry: e.target.checked })
              }
            />
            <span>Image is blurry (apply deblurring)</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.enhance_gan}
              onChange={(e) =>
                setOptions({ ...options, enhance_gan: e.target.checked })
              }
            />
            <span>Enhance with AI (slower, higher quality)</span>
          </label>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <button
        onClick={handleGenerateSketch}
        disabled={!selectedFile || processing}
        className="generate-button"
      >
        {processing ? "Generating Sketch..." : "Generate Sketch"}
      </button>

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

          <div className="result-actions">
            <a href={sketchUrl} download className="download-button">
              Download Sketch
            </a>
            <button onClick={handleUseForSearch} className="use-button">
              Use for Face Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageToSketch;
