import React, { useState } from "react";
import FaceUpload from "./components/FaceUpload";
import FaceSearch from "./components/FaceSearch";
import SketchCreation from "./components/SketchCreation";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [sketchForSearch, setSketchForSearch] = useState(null);

  const handleSketchReady = (sketchData) => {
    // Store sketch data and switch to search tab
    setSketchForSearch(sketchData);
    setActiveTab("search");
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Criminal Forensics</h1>
        <p>
          Advanced facial recognition system for criminal identification and
          investigative support
        </p>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === "search" ? "active" : ""}
          onClick={() => setActiveTab("search")}
        >
          Search Faces
        </button>
        <button
          className={activeTab === "sketch" ? "active" : ""}
          onClick={() => setActiveTab("sketch")}
        >
          Create Sketch
        </button>
        <button
          className={activeTab === "upload" ? "active" : ""}
          onClick={() => setActiveTab("upload")}
        >
          Upload Face
        </button>
      </nav>

      <main className="app-main">
        {activeTab === "search" && (
          <FaceSearch preloadedSketch={sketchForSearch} />
        )}
        {activeTab === "sketch" && (
          <SketchCreation onSketchReady={handleSketchReady} />
        )}
        {activeTab === "upload" && <FaceUpload />}
      </main>

      <footer className="app-footer">
        <p>Built with Django, React, OpenCV, and face_recognition</p>
      </footer>
    </div>
  );
}

export default App;
