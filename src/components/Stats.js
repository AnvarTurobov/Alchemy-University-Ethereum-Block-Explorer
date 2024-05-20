import React, { useEffect, useState } from 'react';
import axios from 'axios';
import alchemy from '../alchemy'; 

function Stats() {
  const [ethPrice, setEthPrice] = useState(null);
  const [ethPriceChange, setEthPriceChange] = useState(null);
  const [marketCap, setMarketCap] = useState(null);
  const [medGasPrice, setMedGasPrice] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null); // TODO: will use it soon

  useEffect(() => {
    const fetchEthData = async () => {
      try {
        // Getting ETH price and market cap from CoinGecko
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

        setMedGasPrice((gasPrice / 1e9).toFixed(2)); // Converting Wei to Gwei

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEthData();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 text-center text-gray-700 mb-8">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold">ETH Price</h2>
        <p className="text-2xl mt-2">
          ${ethPrice} <span className={`text-${ethPriceChange < 0 ? 'red' : 'green'}-500`}>({ethPriceChange}%)</span>
        </p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold">Market Cap</h2>
        <p className="text-2xl mt-2">${marketCap}</p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold">Median Gas Price</h2>
        <p className="text-2xl mt-2">{medGasPrice} Gwei</p>
      </div>
    </div>
  );
}

export default Stats;
