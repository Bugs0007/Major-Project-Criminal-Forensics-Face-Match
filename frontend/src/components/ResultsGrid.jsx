import React from "react";
import ImageCard from "./ImageCard";
import "./ResultsGrid.css";

const ResultsGrid = ({ results }) => {
  if (!results || results.length === 0) {
    return <p className="no-results">No matches found</p>;
  }

  return (
    <div className="results-grid">
      {results.map((result) => (
        <ImageCard key={result.id} result={result} />
      ))}
    </div>
  );
};

export default ResultsGrid;
