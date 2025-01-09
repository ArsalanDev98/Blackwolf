import React from "react";
import "./Instructions.css";

const Instructions: React.FC = () => {
  return (
    <div className="instructions-section">
      <div className="instructions-wrapper">
        <div className="instructions-content">
          <h2 className="instructions-title">How to buy the presale</h2>
          <div className="instructions-text">
            <ol className="instructions-list">
              <li>
                Send USDT (ETH) to{" "}
                <span className="wallet-address">
                  0x772740511b963fa949334c41508B3Dc940ef7661
                </span>{" "}
                from a non-exchange wallet.
              </li>
              <li>The presale tokens will get sent to this wallet.</li>
              <li>Enjoy your tokens.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
