import React from "react";
import "./Instructions.css";

const Instructions: React.FC = () => {
  return (
    <div className="instructions-section">
      <div className="instructions-wrapper">
        <div className="instructions-content">
          <h2 className="instructions-title">How to buy the ICO</h2>
          <div className="instructions-text">
            Fill out the Google Form:{" "}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSemSoLFxvfY5wAIB92S_HSrw-9ORpw_sT_OXE412i9RvXyynQ/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#33ffff", textDecoration: "underline" }}
            >
              https://docs.google.com/forms/d/e/1FAIpQLSemSoLF
            </a>
          </div>
          <div className="animated-logo-container">
            <video autoPlay loop muted playsInline className="animated-logo">
              <source src="/blackwolf.mp4" type="video/mp4" />
              <source src="/blackwolf.webm" type="video/webm" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
