import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Stats from './components/Stats';
import BlocksAndTransactions from './components/BlocksAndTransactions';
import axios from 'axios';
import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [ethPrice, setEthPrice] = useState(null);
  const [ethPriceChange, setEthPriceChange] = useState(null);
  const [marketCap, setMarketCap] = useState(null);
  const [transactionCount, setTransactionCount] = useState(null);
  const [medGasPrice, setMedGasPrice] = useState(null);
  const [lastFinalizedBlock, setLastFinalizedBlock] = useState(null);
  const [lastSafeBlock, setLastSafeBlock] = useState(null);
  const [blockNumber, setBlockNumber] = useState(); 

  useEffect(() => {
    const fetchEthData = async () => {
      try {
        // Getting ETH price and market cap from CoinGecko api
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            ids: 'ethereum',
          },
        });

        const ethData = response.data[0];
        setEthPrice(ethData.current_price.toFixed(2));
        setEthPriceChange(ethData.price_change_percentage_24h.toFixed(2));
        setMarketCap(ethData.market_cap.toLocaleString());

        // Getting latest Block number, gas price to get average gas price, and block from Alchemy
        const [blockNumber, gasPrice, block] = await Promise.all([
          alchemy.core.getBlockNumber(),
          alchemy.core.getGasPrice(),
          alchemy.core.getBlock('latest'),
        ]);

        setBlockNumber(blockNumber);
        setLastFinalizedBlock(blockNumber);
        setLastSafeBlock(blockNumber);
        setMedGasPrice((gasPrice / 1e9).toFixed(2)); // Converting Wei to Gwei

        // Estimating transaction count 
        setTransactionCount(block.transactions.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEthData();
  }, []);

  return (
    <div className="bg-gray-100 font-sans leading-normal tracking-normal">
      <Navbar />
      <Header />
      <main className="container mx-auto p-8">
        <Stats
          ethPrice={ethPrice}
          ethPriceChange={ethPriceChange}
          marketCap={marketCap}
          transactionCount={transactionCount}
          medGasPrice={medGasPrice}
          lastFinalizedBlock={lastFinalizedBlock}
          lastSafeBlock={lastSafeBlock}
          blockNumber={blockNumber}
        />
        <BlocksAndTransactions lastFinalizedBlock={lastFinalizedBlock} />
      </main>
    </div>
  );
}

export default App;
