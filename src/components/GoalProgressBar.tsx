import React, { useEffect, useState } from "react";
import "./GoalProgressBar.css";

interface WalletData {
  ethBalance: number;
  ethValue: number;
  tokenValue: number;
  totalValue: number;
}

const GoalProgressBar = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    ethBalance: 0,
    ethValue: 0,
    tokenValue: 0,
    totalValue: 4500000, // Test value of $4.5M
  });
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const goalAmount = 5500000; // $5.5M USD goal

  useEffect(() => {
    // Start animation after a short delay
    setTimeout(() => {
      setIsAnimating(true);
      setAnimatedValue(walletData.totalValue);
    }, 500);
  }, [walletData.totalValue]);

  const progressPercentage = (animatedValue / goalAmount) * 100;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div>
          <span className="label">RAISED: </span>
          <span className="value-text">
            $
            {isAnimating
              ? animatedValue.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </span>
        </div>
        <div className="goal-text">
          <span className="label">GOAL: </span>
          <span className="value-text">
            ${goalAmount.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div
          className={`progress-bar ${isAnimating ? "animate" : ""}`}
          style={{ width: `${progressPercentage}%` }}
        >
          <span className="progress-text">
            {progressPercentage.toFixed(4)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default GoalProgressBar;
