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

const USDT_CONTRACT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const GoalProgressBar = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    ethBalance: 0,
    ethValue: 0,
    usdtBalance: 0,
    totalValue: 0,
  });
  const goalAmount = 5500000; // $5.5M USD goal
  const walletAddress = "0xc67CcfD01a22277CdaF403e20fe4FC161E07B8f8";

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

  // Calculate percentage with more precision for small numbers
  const progressPercentage = (walletData.totalValue / goalAmount) * 100;

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
          <span className="subtitle">collected</span>
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
        <div className="percentage-text">
          {progressPercentage > 0.01
            ? progressPercentage.toFixed(4)
            : progressPercentage.toFixed(4)}
          % OF GOAL REACHED
        </div>
      </div>
    </div>
  );
};

export default GoalProgressBar;
