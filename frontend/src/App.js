import React, { useState } from "react";
import FaceUpload from "./components/FaceUpload";
import FaceSearch from "./components/FaceSearch";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("search");

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
          className={activeTab === "upload" ? "active" : ""}
          onClick={() => setActiveTab("upload")}
        >
          Upload Face
        </button>
      </nav>

      <main className="app-main">
        {activeTab === "search" && <FaceSearch />}
        {activeTab === "upload" && <FaceUpload />}
      </main>

      {/* <footer className="app-footer">
        <p>Built with Django, React, and face_recognition library</p>
      </footer> */}
    </div>
  );
}

export default App;
