import React, { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import FaceUpload from "./components/FaceUpload";
import FaceSearch from "./components/FaceSearch";
import SketchCreation from "./components/SketchCreation";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("home");
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
          className={activeTab === "home" ? "active" : ""}
          onClick={() => setActiveTab("home")}
        >
          Home
        </button>
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
        {activeTab === "home" && <HomeScreen />}
        {activeTab === "search" && (
          <FaceSearch preloadedSketch={sketchForSearch} />
        )}
        {activeTab === "sketch" && (
          <SketchCreation onSketchReady={handleSketchReady} />
        )}
        {activeTab === "upload" && <FaceUpload />}
      </main>
    </div>
  );
}

export default App;
