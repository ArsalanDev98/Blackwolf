import { useEffect, useState } from "react";
import { getBalance } from "@wagmi/core";
import { config } from "../config";
import { mainnet } from "@wagmi/core/chains";
import "./GoalProgressBar.css";

interface WalletData {
  ethBalance: number;
  ethValue: number;
  usdtBalance: number;
  usdcBalance: number;
  totalValue: number;
}

interface BinancePrice {
  symbol: string;
  price: string;
}

const GoalProgressBar = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    ethBalance: 0,
    ethValue: 0,
    usdtBalance: 0,
    usdcBalance: 0,
    totalValue: 3550000,
  });
  const [animatedValue, setAnimatedValue] = useState(0);
  const goalAmount = 5500000; // $5.5M USD goal
  const walletAddress = "0x6b69e16Eb905BEE033751b13970a977118c90D3c";
  const USDT_CONTRACT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const USDC_CONTRACT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const duration = 2000; // Animation duration in milliseconds

  //   const fetchEthPrice = async (): Promise<number> => {
  //     try {
  //       const response = await fetch(
  //         "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
  //       );
  //       const data: BinancePrice = await response.json();
  //       return parseFloat(data.price);
  //     } catch (error) {
  //       console.error("Error fetching ETH price:", error);
  //       return 0;
  //     }
  //   };

  //   const fetchWalletData = async () => {
  //     try {
  //       // Get ETH price from Binance
  //       const ethPrice = await fetchEthPrice();

  //       // Get ETH balance
  //       const ethBalance = await getBalance(config, {
  //         address: walletAddress as `0x${string}`,
  //         chainId: mainnet.id,
  //       });

  //       // Get USDT balance
  //       const usdtBalance = await getBalance(config, {
  //         address: walletAddress as `0x${string}`,
  //         token: USDT_CONTRACT as `0x${string}`,
  //         chainId: mainnet.id,
  //       });

  //       // Get USDC balance
  //       const usdcBalance = await getBalance(config, {
  //         address: walletAddress as `0x${string}`,
  //         token: USDC_CONTRACT as `0x${string}`,
  //         chainId: mainnet.id,
  //       });

  //       // Calculate values using live ETH price
  //       const ethValue = Number(ethBalance.formatted) * ethPrice;
  //       const usdtValue = Number(usdtBalance.formatted); // 1 USDT ≈ 1 USD
  //       const usdcValue = Number(usdcBalance.formatted); // 1 USDC ≈ 1 USD

  //       setWalletData({
  //         ethBalance: Number(ethBalance.formatted),
  //         ethValue,
  //         usdtBalance: usdtValue,
  //         usdcBalance: usdcValue,
  //         totalValue: ethValue + usdtValue + usdcValue,
  //       });
  //     } catch (error) {
  //       console.error("Error fetching wallet data:", error);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchWalletData();
  //     const interval = setInterval(fetchWalletData, 60000); // Update every minute
  //     return () => clearInterval(interval);
  //   }, []);

  useEffect(() => {
    let start = 0;

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const animatedValue = progress * walletData.totalValue;
      setAnimatedValue(animatedValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame((timestamp) => {
      start = timestamp;
      step(timestamp);
    });
  }, [walletData.totalValue, duration]);

  const progressPercentage = (animatedValue / goalAmount) * 100;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div>
          <span className="label">RAISED: </span>
          <span className="value-text">
            $
            {animatedValue.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
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
          className="progress-bar"
          style={{ width: `${progressPercentage}%` }}
        >
          {progressPercentage > 4 && (
            <span
              className={`progress-text ${
                progressPercentage > 4 ? "visible" : ""
              }`}
            >
              {Math.round(progressPercentage)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalProgressBar;
