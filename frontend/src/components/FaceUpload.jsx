import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { faceAPI } from "../services/api";
import "./FaceUpload.css";

const FaceUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState({
    name: "",
    tags: "",
    notes: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const tags = metadata.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const result = await faceAPI.uploadFace(selectedFile, {
        name: metadata.name,
        tags: tags,
        notes: metadata.notes,
      });

      alert("Face uploaded successfully!");

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setMetadata({ name: "", tags: "", notes: "" });

      if (onUploadSuccess) {
        onUploadSuccess(result.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload face");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="face-upload">
      <h2>Upload Face</h2>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="preview-image" />
        ) : (
          <p>
            {isDragActive
              ? "Drop the image here..."
              : "Drag and drop an image here, or click to select"}
          </p>
        )}
      </div>

      {selectedFile && (
        <div className="metadata-form">
          <input
            type="text"
            placeholder="Name (optional)"
            value={metadata.name}
            onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
          />

          <input
            type="text"
            placeholder="Tags (comma-separated, optional)"
            value={metadata.tags}
            onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
          />

          <textarea
            placeholder="Notes (optional)"
            value={metadata.notes}
            onChange={(e) =>
              setMetadata({ ...metadata, notes: e.target.value })
            }
            rows="3"
          />
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="upload-button"
      >
        {uploading ? "Uploading..." : "Upload Face"}
      </button>
    </div>
  );
};

export default FaceUpload;
