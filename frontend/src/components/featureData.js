/**
 * SVG Feature Data for Face Builder
 * Each feature has SVG path data that can be rendered and composed together.
 * IDs correspond to backend feature library IDs for mapping.
 */

// Skin tone presets
export const SKIN_TONES = [
  { id: 1, name: "Fair", color: "#FDEBD3" },
  { id: 2, name: "Light", color: "#F5D6C6" },
  { id: 3, name: "Medium Light", color: "#E8B898" },
  { id: 4, name: "Medium", color: "#D4A574" },
  { id: 5, name: "Tan", color: "#C68B59" },
  { id: 6, name: "Brown", color: "#A67449" },
  { id: 7, name: "Dark Brown", color: "#8B5A3C" },
  { id: 8, name: "Deep", color: "#5C3D2E" },
];

// Hair color presets
export const HAIR_COLORS = [
  { id: 1, name: "Black", color: "#1a1a1a" },
  { id: 2, name: "Dark Brown", color: "#3D2314" },
  { id: 3, name: "Brown", color: "#6B4423" },
  { id: 4, name: "Light Brown", color: "#8B6B4B" },
  { id: 5, name: "Auburn", color: "#922724" },
  { id: 6, name: "Red", color: "#B55239" },
  { id: 7, name: "Blonde", color: "#D4A76A" },
  { id: 8, name: "Platinum", color: "#E8E4D9" },
  { id: 9, name: "Gray", color: "#9CA3AF" },
  { id: 10, name: "White", color: "#F5F5F5" },
];

// Eye color presets
export const EYE_COLORS = [
  { id: 1, name: "Brown", color: "#4A3728" },
  { id: 2, name: "Hazel", color: "#8B7355" },
  { id: 3, name: "Green", color: "#4A6741" },
  { id: 4, name: "Blue", color: "#4A7B9D" },
  { id: 5, name: "Gray", color: "#6B7B8A" },
  { id: 6, name: "Amber", color: "#B8860B" },
];

// Face shapes
export const FACE_SHAPES = [
  {
    id: 1,
    name: "Oval",
    path: "M100 30 C145 30 170 60 175 100 C180 145 165 190 150 210 C130 235 100 245 100 245 C100 245 70 235 50 210 C35 190 20 145 25 100 C30 60 55 30 100 30 Z",
    thumbnail: "oval",
  },
  {
    id: 2,
    name: "Round",
    path: "M100 25 C155 25 180 70 180 120 C180 175 155 220 100 230 C45 220 20 175 20 120 C20 70 45 25 100 25 Z",
    thumbnail: "round",
  },
  {
    id: 3,
    name: "Square",
    path: "M100 30 C150 30 175 50 178 90 C182 140 175 190 160 215 C140 240 100 245 100 245 C100 245 60 240 40 215 C25 190 18 140 22 90 C25 50 50 30 100 30 Z",
    thumbnail: "square",
  },
  {
    id: 4,
    name: "Heart",
    path: "M100 25 C155 25 185 60 180 105 C175 155 155 195 130 220 C110 240 100 250 100 250 C100 250 90 240 70 220 C45 195 25 155 20 105 C15 60 45 25 100 25 Z",
    thumbnail: "heart",
  },
  {
    id: 5,
    name: "Oblong",
    path: "M100 20 C145 20 165 50 170 95 C175 150 170 200 155 225 C135 255 100 260 100 260 C100 260 65 255 45 225 C30 200 25 150 30 95 C35 50 55 20 100 20 Z",
    thumbnail: "oblong",
  },
];

// Hair styles
export const HAIR_STYLES = [
  {
    id: 1,
    name: "Short",
    path: "M100 15 C160 15 190 45 190 85 C190 90 188 95 185 100 L180 95 C175 55 145 30 100 30 C55 30 25 55 20 95 L15 100 C12 95 10 90 10 85 C10 45 40 15 100 15 Z",
    backPath: null,
    thumbnail: "short",
  },
  {
    id: 2,
    name: "Medium",
    path: "M100 10 C170 10 200 50 195 100 C192 120 185 135 175 145 L175 120 C170 60 145 25 100 25 C55 25 30 60 25 120 L25 145 C15 135 8 120 5 100 C0 50 30 10 100 10 Z",
    backPath:
      "M30 130 C25 180 35 230 100 240 C165 230 175 180 170 130 L175 145 C180 200 165 250 100 260 C35 250 20 200 25 145 Z",
    thumbnail: "medium",
  },
  {
    id: 3,
    name: "Long",
    path: "M100 8 C175 8 205 55 200 110 C197 135 187 155 175 170 L173 130 C168 60 143 22 100 22 C57 22 32 60 27 130 L25 170 C13 155 3 135 0 110 C-5 55 25 8 100 8 Z",
    backPath:
      "M25 150 C15 220 25 290 100 310 C175 290 185 220 175 150 L177 170 C185 250 170 330 100 350 C30 330 15 250 23 170 Z",
    thumbnail: "long",
  },
  {
    id: 4,
    name: "Buzz Cut",
    path: "M100 22 C150 22 175 45 178 80 C178 82 177 85 177 88 L175 85 C170 50 140 32 100 32 C60 32 30 50 25 85 L23 88 C23 85 22 82 22 80 C25 45 50 22 100 22 Z",
    backPath: null,
    thumbnail: "buzz",
  },
  {
    id: 5,
    name: "Curly",
    path: "M100 5 C180 5 215 60 205 120 C202 145 192 165 178 180 Q185 160 180 135 C175 100 170 70 165 55 Q155 25 100 20 Q45 25 35 55 C30 70 25 100 20 135 Q15 160 22 180 C8 165 -2 145 -5 120 C-15 60 20 5 100 5 Z M50 45 Q60 35 75 40 Q65 55 55 50 Z M150 45 Q140 35 125 40 Q135 55 145 50 Z M35 80 Q45 70 55 80 Q45 95 35 85 Z M165 80 Q155 70 145 80 Q155 95 165 85 Z",
    backPath:
      "M20 160 C10 200 15 260 100 285 C185 260 190 200 180 160 Q190 200 185 245 C175 310 100 340 100 340 C100 340 25 310 15 245 Q10 200 20 160 Z",
    thumbnail: "curly",
  },
  {
    id: 6,
    name: "Ponytail",
    path: "M100 12 C165 12 195 55 190 105 C188 125 182 142 173 155 L172 125 C167 65 142 28 100 28 C58 28 33 65 28 125 L27 155 C18 142 12 125 10 105 C5 55 35 12 100 12 Z",
    backPath:
      "M165 60 C185 65 195 85 190 110 C185 130 170 145 170 145 L175 200 C178 230 175 260 160 270 C145 280 125 275 120 260 C115 245 120 220 125 190 L130 145 C130 145 145 140 155 120 C162 105 160 85 165 60 Z",
    thumbnail: "ponytail",
  },
  {
    id: 7,
    name: "Bald",
    path: "",
    backPath: null,
    thumbnail: "bald",
  },
  {
    id: 8,
    name: "Side Part",
    path: "M100 12 C168 12 198 55 193 110 C190 135 180 155 167 170 L165 130 C160 65 138 25 100 25 C62 25 40 65 35 130 L33 170 C20 155 10 135 7 110 C2 55 32 12 100 12 Z M40 35 Q70 25 100 28 Q70 35 50 50 Q40 45 40 35 Z",
    backPath: null,
    thumbnail: "sidepart",
  },
];

// Eyes
export const EYES = [
  {
    id: 1,
    name: "Almond",
    leftPath: "M50 95 Q70 82 90 95 Q70 105 50 95",
    rightPath: "M110 95 Q130 82 150 95 Q130 105 110 95",
    thumbnail: "almond",
  },
  {
    id: 2,
    name: "Round",
    leftPath: "M52 95 Q70 78 88 95 Q70 108 52 95",
    rightPath: "M112 95 Q130 78 148 95 Q130 108 112 95",
    thumbnail: "round",
  },
  {
    id: 3,
    name: "Hooded",
    leftPath: "M50 95 Q70 88 90 95 Q70 102 50 95",
    rightPath: "M110 95 Q130 88 150 95 Q130 102 110 95",
    thumbnail: "hooded",
  },
  {
    id: 4,
    name: "Upturned",
    leftPath: "M50 98 Q70 85 90 92 Q70 105 50 98",
    rightPath: "M110 92 Q130 85 150 98 Q130 105 110 92",
    thumbnail: "upturned",
  },
  {
    id: 5,
    name: "Downturned",
    leftPath: "M50 92 Q70 85 90 98 Q70 105 50 92",
    rightPath: "M110 98 Q130 85 150 92 Q130 105 110 98",
    thumbnail: "downturned",
  },
  {
    id: 6,
    name: "Monolid",
    leftPath: "M52 95 Q70 90 88 95 Q70 100 52 95",
    rightPath: "M112 95 Q130 90 148 95 Q130 100 112 95",
    thumbnail: "monolid",
  },
];

// Eyebrows
export const EYEBROWS = [
  {
    id: 1,
    name: "Natural",
    leftPath: "M48 75 Q60 70 75 72 Q85 74 92 78 Q85 76 75 75 Q60 74 48 77 Z",
    rightPath:
      "M152 75 Q140 70 125 72 Q115 74 108 78 Q115 76 125 75 Q140 74 152 77 Z",
    thumbnail: "natural",
  },
  {
    id: 2,
    name: "Arched",
    leftPath: "M45 80 Q58 68 75 70 Q88 72 95 78 Q85 75 75 73 Q58 72 47 82 Z",
    rightPath:
      "M155 80 Q142 68 125 70 Q112 72 105 78 Q115 75 125 73 Q142 72 153 82 Z",
    thumbnail: "arched",
  },
  {
    id: 3,
    name: "Straight",
    leftPath: "M48 76 Q65 74 82 74 Q92 74 95 76 Q92 77 82 77 Q65 77 48 78 Z",
    rightPath:
      "M152 76 Q135 74 118 74 Q108 74 105 76 Q108 77 118 77 Q135 77 152 78 Z",
    thumbnail: "straight",
  },
  {
    id: 4,
    name: "Thick",
    leftPath: "M45 73 Q60 66 78 68 Q90 70 95 76 Q88 74 78 72 Q60 71 46 78 Z",
    rightPath:
      "M155 73 Q140 66 122 68 Q110 70 105 76 Q112 74 122 72 Q140 71 154 78 Z",
    thumbnail: "thick",
  },
  {
    id: 5,
    name: "Thin",
    leftPath: "M50 77 Q65 74 80 75 Q90 76 93 78 Q88 77 80 77 Q65 76 50 78 Z",
    rightPath:
      "M150 77 Q135 74 120 75 Q110 76 107 78 Q112 77 120 77 Q135 76 150 78 Z",
    thumbnail: "thin",
  },
  {
    id: 6,
    name: "Rounded",
    leftPath: "M48 78 Q60 72 75 72 Q88 73 93 78 Q85 76 75 75 Q60 75 48 80 Z",
    rightPath:
      "M152 78 Q140 72 125 72 Q112 73 107 78 Q115 76 125 75 Q140 75 152 80 Z",
    thumbnail: "rounded",
  },
];

// Noses
export const NOSES = [
  {
    id: 1,
    name: "Straight",
    path: "M100 90 L100 140",
    nostrilsPath:
      "M92 142 Q95 145 100 145 Q105 145 108 142 L106 144 Q100 148 94 144 Z",
    thumbnail: "straight",
  },
  {
    id: 2,
    name: "Roman",
    path: "M100 90 Q103 110 105 120 Q103 130 100 140",
    nostrilsPath:
      "M90 142 Q95 148 100 148 Q105 148 110 142 L107 145 Q100 150 93 145 Z",
    thumbnail: "roman",
  },
  {
    id: 3,
    name: "Button",
    path: "M100 95 L100 130 Q100 138 100 135",
    nostrilsPath:
      "M94 137 Q97 142 100 142 Q103 142 106 137 L104 140 Q100 144 96 140 Z",
    thumbnail: "button",
  },
  {
    id: 4,
    name: "Wide",
    path: "M100 90 L100 135",
    nostrilsPath:
      "M85 140 Q92 148 100 148 Q108 148 115 140 L110 144 Q100 152 90 144 Z",
    thumbnail: "wide",
  },
  {
    id: 5,
    name: "Pointed",
    path: "M100 90 Q100 115 100 140 L100 142",
    nostrilsPath:
      "M95 143 Q97 146 100 146 Q103 146 105 143 L103 145 Q100 148 97 145 Z",
    thumbnail: "pointed",
  },
  {
    id: 6,
    name: "Snub",
    path: "M100 95 Q100 120 100 130 Q102 138 100 135",
    nostrilsPath:
      "M92 138 Q96 144 100 144 Q104 144 108 138 L105 141 Q100 146 95 141 Z",
    thumbnail: "snub",
  },
];

// Mouths
export const MOUTHS = [
  {
    id: 1,
    name: "Natural",
    path: "M75 175 Q88 168 100 168 Q112 168 125 175 Q112 183 100 183 Q88 183 75 175 Z",
    fill: "#C4928A",
    lipsPath: "M75 175 Q100 172 125 175",
    thumbnail: "natural",
  },
  {
    id: 2,
    name: "Full",
    path: "M72 175 Q85 165 100 165 Q115 165 128 175 Q115 188 100 188 Q85 188 72 175 Z",
    fill: "#C4928A",
    lipsPath: "M72 175 Q100 170 128 175",
    thumbnail: "full",
  },
  {
    id: 3,
    name: "Thin",
    path: "M78 175 Q90 172 100 172 Q110 172 122 175 Q110 180 100 180 Q90 180 78 175 Z",
    fill: "#C4928A",
    lipsPath: "M78 175 Q100 173 122 175",
    thumbnail: "thin",
  },
  {
    id: 4,
    name: "Wide Smile",
    path: "M68 172 Q85 165 100 165 Q115 165 132 172 Q115 182 100 182 Q85 182 68 172 Z",
    fill: "#C4928A",
    lipsPath: "M68 172 Q100 168 132 172",
    thumbnail: "wide",
  },
  {
    id: 5,
    name: "Cupid's Bow",
    path: "M75 175 Q88 168 95 170 L100 167 L105 170 Q112 168 125 175 Q112 183 100 183 Q88 183 75 175 Z",
    fill: "#C4928A",
    lipsPath: "M75 175 Q95 170 100 167 Q105 170 125 175",
    thumbnail: "cupid",
  },
  {
    id: 6,
    name: "Heart",
    path: "M75 173 Q88 165 100 165 Q112 165 125 173 Q112 185 100 188 Q88 185 75 173 Z",
    fill: "#C4928A",
    lipsPath: "M75 173 Q100 170 125 173",
    thumbnail: "heart",
  },
];

// Ears
export const EARS = [
  {
    id: 1,
    name: "Average",
    leftPath:
      "M25 90 Q15 95 15 115 Q15 135 25 140 Q22 125 22 115 Q22 105 25 90 Z",
    rightPath:
      "M175 90 Q185 95 185 115 Q185 135 175 140 Q178 125 178 115 Q178 105 175 90 Z",
    thumbnail: "average",
  },
  {
    id: 2,
    name: "Small",
    leftPath:
      "M27 95 Q20 100 20 112 Q20 125 27 130 Q24 120 24 112 Q24 105 27 95 Z",
    rightPath:
      "M173 95 Q180 100 180 112 Q180 125 173 130 Q176 120 176 112 Q176 105 173 95 Z",
    thumbnail: "small",
  },
  {
    id: 3,
    name: "Large",
    leftPath: "M22 85 Q8 92 8 115 Q8 140 22 148 Q15 130 15 115 Q15 100 22 85 Z",
    rightPath:
      "M178 85 Q192 92 192 115 Q192 140 178 148 Q185 130 185 115 Q185 100 178 85 Z",
    thumbnail: "large",
  },
  {
    id: 4,
    name: "Pointed",
    leftPath:
      "M25 85 Q12 80 12 115 Q12 140 25 145 Q18 128 18 115 Q18 100 25 85 Z",
    rightPath:
      "M175 85 Q188 80 188 115 Q188 140 175 145 Q182 128 182 115 Q182 100 175 85 Z",
    thumbnail: "pointed",
  },
  {
    id: 5,
    name: "Round",
    leftPath:
      "M25 90 Q12 100 12 115 Q12 130 25 140 Q18 128 18 115 Q18 102 25 90 Z",
    rightPath:
      "M175 90 Q188 100 188 115 Q188 130 175 140 Q182 128 182 115 Q182 102 175 90 Z",
    thumbnail: "round",
  },
];

/**
 * Maps backend feature IDs to SVG feature data
 * Backend uses string IDs like "hair_2", "eyes_1", etc.
 * Returns the SVG feature that matches a given backend ID, or null
 */
export function mapBackendIdToSvgFeature(featureType, backendId) {
  const mapping = {
    face_shapes: FACE_SHAPES,
    hair: HAIR_STYLES,
    eyes: EYES,
    eyebrows: EYEBROWS,
    noses: NOSES,
    mouths: MOUTHS,
    ears: EARS,
  };

  const features = mapping[featureType];
  
  if (!features || backendId == null) {
    return null;
  }

  // Handle string IDs like "hair_2", "eyes_1", etc.
  if (typeof backendId === "string") {
    // Extract the number from the string (e.g., "hair_2" -> 2)
    const match = backendId.match(/_(\d+)$/);
    if (match) {
      const index = parseInt(match[1], 10);
      // Backend uses 1-based indexing
      if (index > 0 && index <= features.length) {
        return features[index - 1];
      }
      // Fallback: modulo for out of range
      if (index > features.length) {
        return features[(index - 1) % features.length];
      }
    }
    return null;
  }

  // Handle numeric IDs (direct match or index-based)
  if (typeof backendId === "number") {
    // Try direct ID match first
    let feature = features.find((f) => f.id === backendId);
    if (feature) return feature;

    // Fallback: use index-based matching (1-based index)
    if (backendId > 0 && backendId <= features.length) {
      return features[backendId - 1];
    }
    
    // Modulo fallback for out of range
    if (backendId > features.length) {
      return features[(backendId - 1) % features.length];
    }
  }

  return null;
}

/**
 * Gets all SVG features for a given type
 */
export function getSvgFeatures(featureType) {
  const mapping = {
    face_shapes: FACE_SHAPES,
    hair: HAIR_STYLES,
    eyes: EYES,
    eyebrows: EYEBROWS,
    noses: NOSES,
    mouths: MOUTHS,
    ears: EARS,
  };

  return mapping[featureType] || [];
}
