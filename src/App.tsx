import React from "react";
import GoalProgressBar from "./components/GoalProgressBar";
import Instructions from "./components/Instructions";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <div className="app-section">
        <div className="app-wrapper">
          <h1 className="app-title">BLACK WOLF VPN ICO</h1>
          <p className="app-subtitle">
            The most secure private unblockable VPN and much more…
          </p>
          <div className="content-wrapper">
            <div className="progress-section">
              <GoalProgressBar />
            </div>
            <div className="phone-cover-section">
              <img
                src="/phone-cover.webp"
                alt="Phone Cover"
                className="phone-cover-image"
              />
            </div>
          </div>
        </div>
      </div>

      <Instructions />
    </div>
  );
};

export default App;
