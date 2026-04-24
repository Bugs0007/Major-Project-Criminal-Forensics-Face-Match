import React from "react";
import detectiveBg from "../assets/16.9detective cropped.jpg";
import "./HomeScreen.css";

const featureGroups = [
  {
    eyebrow: "Identification",
    title: "Face Search",
    description:
      "Upload a suspect image and compare it against stored criminal records with a dedicated match review flow.",
  },
  {
    eyebrow: "Sketch",
    title: "Image To Sketch",
    description:
      "Convert a source image into a forensic sketch and immediately carry it into the search workflow.",
  },
  {
    eyebrow: "Sketch",
    title: "Feature Builder",
    description:
      "Assemble a suspect face manually from facial parts, demographic hints, and descriptive notes.",
  },
  {
    eyebrow: "Records",
    title: "Database Upload",
    description:
      "Add new criminal records with face images, tags, and investigator notes for future identification.",
  },
  {
    eyebrow: "Analysis",
    title: "Match Review",
    description:
      "Inspect the uploaded evidence alongside the best candidate record in a side-by-side comparison view.",
  },
  {
    eyebrow: "Generation",
    title: "Live Preview",
    description:
      "Preview selected facial features before generation to refine the sketching workflow with less guesswork.",
  },
];

const quickStats = [
  { value: "3", label: "Core Workflows" },
  { value: "6", label: "Key Features" },
  { value: "1", label: "Unified Workspace" },
];

function HomeScreen() {
  return (
    <section className="home-screen">
      <div
        className="home-hero"
        style={{ backgroundImage: `url(${detectiveBg})` }}
      >
        <div className="home-overlay" />
        <div className="home-grid" />

        <div className="home-content">
          <div className="home-badge">Criminal Forensics Platform</div>

          <h2>
            Investigative Home Screen Built Around The Evidence Wall
          </h2>

          <p className="home-lead">
            A new monochrome landing screen that introduces the entire product
            without changing the existing search, sketch, and upload screens.
          </p>

          <div className="home-stats">
            {quickStats.map((stat) => (
              <div className="home-stat" key={stat.label}>
                <span>{stat.value}</span>
                <small>{stat.label}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-panel">
        <div className="home-panel-head">
          <span className="home-panel-kicker">Platform Features</span>
          <h3>Everything available inside the current application</h3>
          <p>
            The screens below remain intact. This home screen simply gives the
            product a proper entry point and explains the available tools.
          </p>
        </div>

        <div className="home-features">
          {featureGroups.map((feature) => (
            <article className="home-card" key={feature.title}>
              <div className="home-card-top">
                <span>{feature.eyebrow}</span>
              </div>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeScreen;
