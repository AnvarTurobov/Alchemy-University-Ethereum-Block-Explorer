import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Stats from './components/Stats';
import BlocksAndTransactions from './components/BlocksAndTransactions';
import BlockDetails from './components/BlockDetails';
import BlockList from './components/BlockList';
import TransactionDetails from './components/TransactionDetails';
import TransactionList from './components/TransactionList';
import SearchResults from './components/SearchResults'; 
import axios from 'axios';
import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [ethPrice, setEthPrice] = useState(null); // State for Ethereum price
  const [ethPriceChange, setEthPriceChange] = useState(null); // State for Ethereum price change
  const [marketCap, setMarketCap] = useState(null); // State for market cap
  const [transactionCount, setTransactionCount] = useState(null); // State for transaction count
  const [medGasPrice, setMedGasPrice] = useState(null); // State for median gas price
  const [lastFinalizedBlock, setLastFinalizedBlock] = useState(null); // State for the last finalized block
  const [lastSafeBlock, setLastSafeBlock] = useState(null); // State for the last safe block
  const [blockNumber, setBlockNumber] = useState(); // State for the latest block number
  const [latestBlocks, setLatestBlocks] = useState([]); // State for the latest blocks

  // Getting Ethereum data on component mount
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
          alchemy.core.getBlockWithTransactions('latest'),
        ]);

        setBlockNumber(blockNumber);
        setLastFinalizedBlock(blockNumber);
        setLastSafeBlock(blockNumber);
        setMedGasPrice((gasPrice / 1e9).toFixed(2)); // Converting Wei to Gwei
        setLatestBlocks([block]); // Setting the latest block data

        // Estimating transaction count 
        setTransactionCount(block.transactions.length);

        // Getting additional blocks for display on latestBlocks and latestTransactions
        const additionalBlocks = await Promise.all(
          Array.from({ length: 5 }, (_, i) => alchemy.core.getBlockWithTransactions(blockNumber - (i + 1)))
        );
        setLatestBlocks([block, ...additionalBlocks]);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEthData();
  }, []);

  return (
    <Router>
      <div className="bg-gray-100 font-sans leading-normal tracking-normal">
        <Navbar />
        <Header />
        <main className="container mx-auto p-8">
          <Switch>
            <Route path="/" exact>
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
              <BlocksAndTransactions latestBlocks={latestBlocks} />
            </Route>
            <Route path="/block/:blockNumber" component={BlockDetails} />
            <Route path="/blocks" component={BlockList} />
            <Route path="/transaction/:transactionHash" component={TransactionDetails} />
            <Route path="/transactions" component={TransactionList} />
            <Route path="/search/:query" component={SearchResults} />
            <Route path="/address/:address" component={TransactionList} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
