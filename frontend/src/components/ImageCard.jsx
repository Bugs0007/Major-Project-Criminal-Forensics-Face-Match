import React from "react";
import "./ImageCard.css";

const ImageCard = ({ result }) => {
  const getSimilarityColor = (similarity) => {
    if (similarity >= 80) return "#4caf50"; // Green
    if (similarity >= 60) return "#ff9800"; // Orange
    return "#f44336"; // Red
  };

  return (
    <div className="image-card">
      <div className="image-container">
        <img src={result.image_url} alt={result.name || "Face"} />
        <div
          className="similarity-badge"
          style={{ backgroundColor: getSimilarityColor(result.similarity) }}
        >
          {result.similarity}%
        </div>
      </div>

      <div className="card-content">
        {result.name && <h4>{result.name}</h4>}
        <p className="filename">{result.original_filename}</p>

        {result.tags && result.tags.length > 0 && (
          <div className="tags">
            {result.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {result.notes && <p className="notes">{result.notes}</p>}

        <p className="date">
          Uploaded: {new Date(result.uploaded_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
