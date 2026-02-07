import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { faceAPI } from "../services/api";
import ResultsGrid from "./ResultsGrid";
import "./FaceSearch.css";

const FaceSearch = () => {
  const [searching, setSearching] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [searchOptions, setSearchOptions] = useState({
    min_similarity: 0,
    max_results: 10,
  });

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResults(null); // Clear previous results
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  });

  const handleSearch = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setSearching(true);
    setError(null);
    setResults(null);

    try {
      const result = await faceAPI.searchFace(selectedFile, searchOptions);
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

      {selectedFile && (
        <div className="search-options">
          <label>
            Minimum Similarity (%):
            <input
              type="number"
              min="0"
              max="100"
              value={searchOptions.min_similarity}
              onChange={(e) =>
                setSearchOptions({
                  ...searchOptions,
                  min_similarity: parseFloat(e.target.value),
                })
              }
            />
          </label>

          <label>
            Max Results:
            <input
              type="number"
              min="1"
              max="50"
              value={searchOptions.max_results}
              onChange={(e) =>
                setSearchOptions({
                  ...searchOptions,
                  max_results: parseInt(e.target.value),
                })
              }
            />
          </label>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <button
        onClick={handleSearch}
        disabled={!selectedFile || searching}
        className="search-button"
      >
        {searching ? "Searching..." : "Search Faces"}
      </button>

      {results && (
        <div className="search-results">
          <h3>
            Found {results.matches_found} match
            {results.matches_found !== 1 ? "es" : ""}
          </h3>
          <ResultsGrid results={results.results} />
        </div>
      )}
    </div>
  );
};

export default FaceSearch;
