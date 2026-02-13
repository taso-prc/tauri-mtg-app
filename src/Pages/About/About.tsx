import React from "react";
import "./About.css";

const About: React.FC = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About</h1>
        
        <section className="about-section">
          <p>This is a personal project created for learning and demonstration purposes, and is not affiliated with Wizards of the Coast.</p>
          <h2>Overview</h2>
          <p>
            Welcome to the Magic The Gathering Card Browser, a desktop application
            built with Tauri and React. This application allows you to search and
            browse Magic The Gathering cards with ease.
          </p>
        </section>

        <section className="about-section">
          <h2>Features</h2>
          <ul>
            <li>Search cards by name with partial matching</li>
            <li>Browse card details including images and attributes</li>
            <li>Game tracker for tracking multiple games</li>
            <li>Fast and responsive desktop experience</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Technology Stack</h2>
          <ul>
            <li><strong>Frontend:</strong> React with TypeScript</li>
            <li><strong>Desktop Framework:</strong> Tauri</li>
            <li><strong>Build Tool:</strong> Vite</li>
            <li><strong>Styling:</strong> CSS</li>
            <li><strong>Backend:</strong> Rust with Tauri</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Version Information</h2>
          <p>Version 0.1.0</p>
        </section>

        <footer className="about-footer">
          <p>&copy; 2026</p>
        </footer>
      </div>
    </div>
  );
};

export default About;