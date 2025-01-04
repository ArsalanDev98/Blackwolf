import { useEffect, useState } from "react";
import { getBalance } from "@wagmi/core";
import { config } from "../config";
import { mainnet } from "@wagmi/core/chains";
import "./GoalProgressBar.css";

interface WalletData {
  ethBalance: number;
  ethValue: number;
  usdtBalance: number;
  totalValue: number;
}

//const USDT_CONTRACT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const GoalProgressBar = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    ethBalance: 0,
    ethValue: 0,
    usdtBalance: 0,
    totalValue: 4500000,
  });
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const goalAmount = 5500000; // $5.5M USD goal
  //const walletAddress = "0xc67CcfD01a22277CdaF403e20fe4FC161E07B8f8";

  /*
  const fetchWalletData = async () => {
    try {
      // Get ETH balance
      const ethBalance = await getBalance(config, {
        address: walletAddress as `0x${string}`,
        chainId: mainnet.id,
      });

      // Get USDT balance
      const usdtBalance = await getBalance(config, {
        address: walletAddress as `0x${string}`,
        token: USDT_CONTRACT as `0x${string}`,
        chainId: mainnet.id,
      });

      // Calculate values (using ETH price from your screenshot for now)
      const ethPrice = 3639.22;
      const ethValue = Number(ethBalance.formatted) * ethPrice;
      const usdtValue = Number(usdtBalance.formatted); // 1 USDT ≈ 1 USD

      setWalletData({
        ethBalance: Number(ethBalance.formatted),
        ethValue,
        usdtBalance: usdtValue,
        totalValue: ethValue + usdtValue,
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
  */

  // Add animation effect whenever walletData.totalValue changes
  useEffect(() => {
    setAnimatedValue(0);
    setIsAnimating(false);

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
