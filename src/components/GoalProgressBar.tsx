import { useEffect, useState, useCallback } from "react";
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

interface CachedPrice {
  price: number;
  timestamp: number;
}

const GoalProgressBar = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    ethBalance: 0,
    ethValue: 0,
    usdtBalance: 0,
    usdcBalance: 0,
    totalValue: 0,
  });
  const [animatedValue, setAnimatedValue] = useState(0);
  const [ethPriceCache, setEthPriceCache] = useState<CachedPrice>({
    price: 0,
    timestamp: 0,
  });

  const goalAmount = 5500000;
  const walletAddress = "0xc3B55677f55093C48B4D7748610eA9dc3A5B5D25";
  const USDT_CONTRACT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const USDC_CONTRACT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const duration = 2000;
  const PRICE_CACHE_DURATION = 30000;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Retry function with exponential backoff
  const fetchWithRetry = async (
    fetchFn: () => Promise<any>,
    retries = 3,
    baseDelay = 1000
  ) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fetchFn();
      } catch (error) {
        if (i === retries - 1) throw error; // Last retry failed
        const waitTime = baseDelay * Math.pow(2, i); // Exponential backoff
        console.log(`Retry ${i + 1}/${retries} after ${waitTime}ms`);
        await delay(waitTime);
      }
    }
  };

  const fetchEthPrice = useCallback(async (): Promise<number> => {
    const now = Date.now();
    if (
      ethPriceCache.price &&
      now - ethPriceCache.timestamp < PRICE_CACHE_DURATION
    ) {
      return ethPriceCache.price;
    }

    try {
      const response = await fetch(
        "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
      );
      const data: BinancePrice = await response.json();
      const price = parseFloat(data.price);
      setEthPriceCache({ price, timestamp: now });
      return price;
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      return ethPriceCache.price || 0;
    }
  }, [ethPriceCache]);

  const fetchWalletData = useCallback(async () => {
    try {
      const [ethPrice, ethBalance, usdtBalance, usdcBalance] =
        await Promise.all([
          fetchWithRetry(() => fetchEthPrice()),
          fetchWithRetry(() =>
            getBalance(config, {
              address: walletAddress as `0x${string}`,
              chainId: mainnet.id,
            })
          ),
          fetchWithRetry(() =>
            getBalance(config, {
              address: walletAddress as `0x${string}`,
              token: USDT_CONTRACT as `0x${string}`,
              chainId: mainnet.id,
            })
          ),
          fetchWithRetry(() =>
            getBalance(config, {
              address: walletAddress as `0x${string}`,
              token: USDC_CONTRACT as `0x${string}`,
              chainId: mainnet.id,
            })
          ),
        ]).catch((error) => {
          console.error("Failed to fetch data after retries:", error);
          return [0, 0, 0, 0];
        });

      const ethValue = Number(ethBalance.formatted) * ethPrice;
      const usdtValue = Number(usdtBalance.formatted);
      const usdcValue = Number(usdcBalance.formatted);

      setWalletData({
        ethBalance: Number(ethBalance.formatted),
        ethValue,
        usdtBalance: usdtValue,
        usdcBalance: usdcValue,
        totalValue: ethValue + usdtValue + usdcValue,
      });
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  }, [fetchEthPrice]);

  useEffect(() => {
    let isSubscribed = true;

    const runFetchWalletData = async () => {
      if (!isSubscribed) return;
      await fetchWalletData();
      if (!isSubscribed) return;
      setTimeout(runFetchWalletData, 60000);
    };

    runFetchWalletData();

    return () => {
      isSubscribed = false;
    };
  }, [fetchWalletData]);

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
