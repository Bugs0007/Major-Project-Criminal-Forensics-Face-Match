import React, { useMemo } from "react";
import {
  FACE_SHAPES,
  HAIR_STYLES,
  EYES,
  EYEBROWS,
  NOSES,
  MOUTHS,
  EARS,
  mapBackendIdToSvgFeature,
} from "./featureData";
import "./FaceSVGPreview.css";

/**
 * SVG-based face preview component that composites selected features
 * into a clean, scalable vector graphic preview.
 */
const FaceSVGPreview = ({
  selectedFeatures = {},
  skinTone = "#F5D6C6",
  hairColor = "#3D2314",
  eyeColor = "#4A3728",
  className = "",
  animated = true,
}) => {
  // Get the selected feature data for each type
  const faceShape = useMemo(
    () => mapBackendIdToSvgFeature("face_shapes", selectedFeatures.face_shapes),
    [selectedFeatures.face_shapes]
  );

  const hairStyle = useMemo(
    () => mapBackendIdToSvgFeature("hair", selectedFeatures.hair),
    [selectedFeatures.hair]
  );

  const eyes = useMemo(
    () => mapBackendIdToSvgFeature("eyes", selectedFeatures.eyes),
    [selectedFeatures.eyes],
  );

  const eyebrows = useMemo(
    () => mapBackendIdToSvgFeature("eyebrows", selectedFeatures.eyebrows),
    [selectedFeatures.eyebrows],
  );

  const nose = useMemo(
    () => mapBackendIdToSvgFeature("noses", selectedFeatures.noses),
    [selectedFeatures.noses],
  );

  const mouth = useMemo(
    () => mapBackendIdToSvgFeature("mouths", selectedFeatures.mouths),
    [selectedFeatures.mouths],
  );

  const ears = useMemo(
    () => mapBackendIdToSvgFeature("ears", selectedFeatures.ears),
    [selectedFeatures.ears],
  );

  const hasAnyFeature = Object.values(selectedFeatures).some((v) => v != null);

  if (!hasAnyFeature) {
    return (
      <div className={`face-svg-preview empty ${className}`}>
        <div className="empty-state">
          <svg viewBox="0 0 100 120" className="placeholder-icon">
            <ellipse
              cx="50"
              cy="50"
              rx="35"
              ry="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <circle
              cx="35"
              cy="42"
              r="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="2 1"
            />
            <circle
              cx="65"
              cy="42"
              r="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="2 1"
            />
            <path
              d="M42 65 Q50 72 58 65"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="2 1"
            />
          </svg>
          <p>Select features to build your face</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`face-svg-preview ${animated ? "animated" : ""} ${className}`}
    >
      <svg
        viewBox="0 0 200 260"
        className="face-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients for realistic shading */}
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={adjustColor(skinTone, 10)} />
            <stop offset="50%" stopColor={skinTone} />
            <stop offset="100%" stopColor={adjustColor(skinTone, -20)} />
          </linearGradient>

          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={adjustColor(hairColor, 25)} />
            <stop offset="40%" stopColor={hairColor} />
            <stop offset="100%" stopColor={adjustColor(hairColor, -25)} />
          </linearGradient>

          <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0" />
          </radialGradient>

          {/* Subtle shadow filter */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.2" />
          </filter>

          {/* Inner glow for depth */}
          <filter id="innerGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset dx="0" dy="1" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background circle for composition */}
        <circle cx="100" cy="130" r="95" fill="rgba(255,255,255,0.02)" stroke="rgba(245,158,11,0.08)" strokeWidth="1" className="guide-circle" />

        {/* Layer 1: Hair back (for styles that go behind face) */}
        {hairStyle?.backPath && (
          <g className="feature-layer hair-back">
            <path
              d={hairStyle.backPath}
              fill="url(#hairGradient)"
              className="hair-path back"
            />
          </g>
        )}

        {/* Layer 2: Ears (behind face) */}
        {ears && (
          <g className="feature-layer ears" filter="url(#softShadow)">
            <path
              d={ears.leftPath}
              fill={skinTone}
              stroke={adjustColor(skinTone, -35)}
              strokeWidth="1"
              className="ear-path left"
            />
            <path
              d={ears.rightPath}
              fill={skinTone}
              stroke={adjustColor(skinTone, -35)}
              strokeWidth="1"
              className="ear-path right"
            />
          </g>
        )}

        {/* Layer 3: Face shape */}
        {faceShape && (
          <g className="feature-layer face" filter="url(#softShadow)">
            <path
              d={faceShape.path}
              fill="url(#skinGradient)"
              stroke={adjustColor(skinTone, -30)}
              strokeWidth="1.5"
              className="face-path"
            />
            {/* Subtle cheek blush */}
            <ellipse
              cx="60"
              cy="130"
              rx="20"
              ry="15"
              fill="url(#cheekBlush)"
              className="cheek left"
            />
            <ellipse
              cx="140"
              cy="130"
              rx="20"
              ry="15"
              fill="url(#cheekBlush)"
              className="cheek right"
            />
          </g>
        )}

        {/* Layer 4: Eyes */}
        {eyes && (
          <g className="feature-layer eyes">
            {/* Left eye */}
            <g className="eye left">
              <ellipse
                cx="70"
                cy="100"
                rx="16"
                ry="11"
                fill="white"
                stroke="#e0e0e0"
                strokeWidth="0.5"
              />
              <circle cx="70" cy="100" r="8" fill={eyeColor} className="iris" />
              <circle cx="70" cy="100" r="4" fill="#1a1a1a" className="pupil" />
              <circle
                cx="72"
                cy="98"
                r="2.5"
                fill="white"
                opacity="0.9"
                className="highlight"
              />
              <circle
                cx="68"
                cy="102"
                r="1"
                fill="white"
                opacity="0.5"
                className="highlight-small"
              />
              <path
                d={eyes.leftPath}
                fill="none"
                stroke={adjustColor(skinTone, -45)}
                strokeWidth="2"
                strokeLinecap="round"
                className="eye-outline"
              />
            </g>
            {/* Right eye */}
            <g className="eye right">
              <ellipse
                cx="130"
                cy="100"
                rx="16"
                ry="11"
                fill="white"
                stroke="#e0e0e0"
                strokeWidth="0.5"
              />
              <circle
                cx="130"
                cy="100"
                r="8"
                fill={eyeColor}
                className="iris"
              />
              <circle
                cx="130"
                cy="100"
                r="4"
                fill="#1a1a1a"
                className="pupil"
              />
              <circle
                cx="132"
                cy="98"
                r="2.5"
                fill="white"
                opacity="0.9"
                className="highlight"
              />
              <circle
                cx="128"
                cy="102"
                r="1"
                fill="white"
                opacity="0.5"
                className="highlight-small"
              />
              <path
                d={eyes.rightPath}
                fill="none"
                stroke={adjustColor(skinTone, -45)}
                strokeWidth="2"
                strokeLinecap="round"
                className="eye-outline"
              />
            </g>
          </g>
        )}

        {/* Layer 5: Eyebrows */}
        {eyebrows && (
          <g className="feature-layer eyebrows">
            <path
              d={eyebrows.leftPath}
              fill={adjustColor(hairColor, -10)}
              className="eyebrow left"
            />
            <path
              d={eyebrows.rightPath}
              fill={adjustColor(hairColor, -10)}
              className="eyebrow right"
            />
          </g>
        )}

        {/* Layer 6: Nose */}
        {nose && (
          <g className="feature-layer nose">
            <path
              d={nose.path}
              fill="none"
              stroke={adjustColor(skinTone, -35)}
              strokeWidth="2"
              strokeLinecap="round"
              className="nose-bridge"
            />
            {nose.nostrilsPath && (
              <path
                d={nose.nostrilsPath}
                fill={adjustColor(skinTone, -25)}
                className="nostrils"
              />
            )}
          </g>
        )}

        {/* Layer 7: Mouth */}
        {mouth && (
          <g className="feature-layer mouth">
            <path
              d={mouth.path}
              fill={mouth.fill || "#C4928A"}
              stroke={adjustColor(mouth.fill || "#C4928A", -25)}
              strokeWidth="1"
              className="lips"
            />
            {mouth.lipsPath && (
              <path
                d={mouth.lipsPath}
                fill="none"
                stroke={adjustColor(skinTone, -20)}
                strokeWidth="0.5"
                className="lip-line"
              />
            )}
          </g>
        )}

        {/* Layer 8: Hair front */}
        {hairStyle && hairStyle.path && (
          <g className="feature-layer hair-front">
            <path
              d={hairStyle.path}
              fill="url(#hairGradient)"
              stroke={adjustColor(hairColor, -35)}
              strokeWidth="0.5"
              className="hair-path front"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

/**
 * Adjusts a hex color by a given amount (positive = lighter, negative = darker)
 */
function adjustColor(hex, amount) {
  // Handle invalid input
  if (!hex || typeof hex !== "string") return "#888888";

  // Remove # if present
  hex = hex.replace("#", "");

  // Parse RGB values
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  // Handle NaN
  if (isNaN(r)) r = 128;
  if (isNaN(g)) g = 128;
  if (isNaN(b)) b = 128;

  // Adjust values
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default FaceSVGPreview;
