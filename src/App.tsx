import React from "react";
import GoalProgressBar from "./components/GoalProgressBar";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1 className="app-title">Wallet Value Progress</h1>
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
  );
};

export default App;
