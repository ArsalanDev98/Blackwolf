import React, { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  BarController, // Added BarController
  Chart,
} from "chart.js";

// Register all required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  BarController // Register BarController
);

const BarChart: React.FC = () => {
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Add canvas ref
  const [walletValue, setWalletValue] = useState<number>(0);

  const fetchWalletValue = async () => {
    const walletAddress = "0xc67CcfD01a22277CdaF403e20fe4FC161E07B8f8";
    const etherscanApiKey = "27K6KP9S41H3EXMVIRABS9AW2NX5V7AVIX";

    try {
      // Fetch ETH Balance
      const ethResponse = await fetch(
        `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${etherscanApiKey}`
      );
      const ethData = await ethResponse.json();
      const ethBalance = parseFloat(ethData.result) / 1e18; // Convert Wei to ETH

      // Fetch ETH Price
      const priceResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
      );
      const priceData = await priceResponse.json();
      const ethPrice = priceData.ethereum.usd;

      // Calculate Wallet Value
      const totalValue = ethBalance * ethPrice;
      setWalletValue(totalValue);
    } catch (error) {
      console.error("Error fetching wallet value:", error);
    }
  };

  useEffect(() => {
    fetchWalletValue();

    // Update every minute
    const interval = setInterval(fetchWalletValue, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Wallet Value"],
        datasets: [
          {
            label: "Total Value (USD)",
            data: [walletValue],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [walletValue]);

  return (
    <div className="w-96 h-48">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BarChart;
