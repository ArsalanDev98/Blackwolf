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
    totalValue: 0,
  });
  const goalAmount = 5500000; // $5.5M USD goal

  const fetchWalletData = async () => {
    const walletAddress = "0xE9a24FE99e7678fFd66a8a69B5ed0BA217787256";
    const etherscanApiKey = "27K6KP9S41H3EXMVIRABS9AW2NX5V7AVIX";

    try {
      // Fetch ETH balance and value
      const ethBalanceUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${etherscanApiKey}`;
      const ethResponse = await fetch(ethBalanceUrl);
      const ethData = await ethResponse.json();
      const ethBalance = parseFloat(ethData.result) / 1e18;

      // Get ETH price
      const ethPriceUrl = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${etherscanApiKey}`;
      const priceResponse = await fetch(ethPriceUrl);
      const priceData = await priceResponse.json();
      const ethPrice = parseFloat(priceData.result.ethusd);
      const ethValue = ethBalance * ethPrice;

      // Get token holdings using account token balance endpoint
      const tokenBalanceUrl = `https://api.etherscan.io/api?module=account&action=tokenbalance&address=${walletAddress}&contractaddress=0x0000000000000000000000000000000000000000&tag=latest&apikey=${etherscanApiKey}`;
      const tokenResponse = await fetch(tokenBalanceUrl);
      const tokenData = await tokenResponse.json();
      const tokenValue = parseFloat(tokenData.result); // Use actual API value or fallback to screenshot value

      // Calculate total value
      const totalValue = ethValue + tokenValue;

      setWalletData({
        ethBalance,
        ethValue,
        tokenValue,
        totalValue,
      });
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  useEffect(() => {
    fetchWalletData();
    const interval = setInterval(fetchWalletData, 60000);
    return () => clearInterval(interval);
  }, []);

  const progressPercentage = Math.min(
    (walletData.totalValue / goalAmount) * 100,
    100
  );

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div>
          <span className="value-text">
            $
            {walletData.totalValue.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="subtitle">Raised</span>
        </div>
        <div>
          <span>Goal </span>
          <span className="value-text">
            ${goalAmount.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${progressPercentage}%` }}
        >
          <span className="progress-text">
            $
            {walletData.totalValue.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      </div>

      <div className="progress-footer">
        <div>
          <span className="percentage">{progressPercentage.toFixed(1)}%</span>{" "}
          of goal reached
        </div>
        <div className="eth-balance">
          ETH: $
          {walletData.ethValue.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
          | Tokens: $
          {walletData.tokenValue.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
    </div>
  );
};

export default GoalProgressBar;
