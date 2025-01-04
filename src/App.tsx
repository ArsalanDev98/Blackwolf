import React from "react";
import GoalProgressBar from "./components/GoalProgressBar";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1 className="app-title">Wallet Value Progress</h1>
      <GoalProgressBar />
    </div>
  );
};

export default App;
