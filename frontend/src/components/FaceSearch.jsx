import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { faceAPI } from "../services/api";
import ImageCard from "./ImageCard";
import "./FaceSearch.css";

const FaceSearch = () => {
  const [searching, setSearching] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResults(null); // Clear previous results
    }
  };

  useEffect(() => {
    if (selectedFile) {
      performSearch();
    }
  }, [selectedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  });

  const performSearch = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setSearching(true);
    setError(null);
    setResults(null);

    try {
      const result = await faceAPI.searchFace(selectedFile, {
        min_similarity: 0,
        max_results: 1,
      });
      setResults(result);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to search faces");
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="face-search">
      <h2>Search for Matching Faces</h2>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        {previewUrl ? (
          <div className="preview-container">
            <img src={previewUrl} alt="Search" className="preview-image" />
            <p className="preview-label">Search Image</p>
          </div>
        ) : (
          <p>
            {isDragActive
              ? "Drop the image here..."
              : "Drag and drop a face image to search, or click to select"}
          </p>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {searching && (
        <div className="search-container">
          <div className="searching-animation">
            <div className="scanning-lines"></div>
            <p>Scanning faces...</p>
          </div>
        </div>
      )}

      {results && results.results.length > 0 && !searching && (
        <div className="search-results">
          <div className="comparison-container">
            <div className="uploaded-image-section">
              <h3>Uploaded Image</h3>
              <img
                src={previewUrl}
                alt="Uploaded"
                className="comparison-image"
              />
            </div>

            <div className="divider"></div>

            <div className="match-result-section">
              <h3>Top Match</h3>
              <ImageCard result={results.results[0]} />
            </div>
          </div>
        </div>
      )}

      {results && results.results.length === 0 && !searching && (
        <div className="search-results">
          <div className="no-match-message">
            <p>No matches found in the database</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceSearch;
