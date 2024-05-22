import React, { useEffect, useState, useRef } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import { Link } from 'react-router-dom';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const [blockNumber, setBlockNumber] = useState(null);

  useEffect(() => {
    const fetchInitialTransactions = async () => {
      setLoading(true);
      try {
        const latestBlockNumber = await alchemy.core.getBlockNumber();
        setBlockNumber(latestBlockNumber);
        const initialTransactions = await fetchTransactions(latestBlockNumber, 10);
        setTransactions(initialTransactions);
      } catch (error) {
        console.error('Error fetching initial transactions:', error);
      }
      setLoading(false);
    };

    fetchInitialTransactions();
  }, []);

  const fetchTransactions = async (startBlockNumber, count) => {
    const transactionPromises = [];
    for (let i = 0; i < count; i++) {
      transactionPromises.push(alchemy.core.getBlockWithTransactions(startBlockNumber - i));
    }
    const blocks = await Promise.all(transactionPromises);
    return blocks.flatMap(block => block.transactions);
  };

  const lastTransactionElementRef = useRef();
  const loadMoreTransactions = async (entry) => {
    if (entry[0].isIntersecting) {
      setLoading(true);
      try {
        const newTransactions = await fetchTransactions(blockNumber - transactions.length / 10, 10);
        setTransactions((prevTransactions) => [...prevTransactions, ...newTransactions]);
      } catch (error) {
        console.error('Error fetching more transactions:', error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(loadMoreTransactions);
    if (lastTransactionElementRef.current) observer.current.observe(lastTransactionElementRef.current);
  }, [loading, transactions]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">All Transactions</h2>
      <ul>
        {transactions.map((tx, index) => (
          <li key={tx.hash} ref={transactions.length === index + 1 ? lastTransactionElementRef : null} className="flex justify-between items-center py-2 border-b">
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10h10M7 14h5M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 2 0 012-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="font-bold text-[#0ABAB5]">
                  <Link to={`/transaction/${tx.hash}`}>{tx.hash.slice(0, 10)}...</Link>
                </p>
                <p className="text-gray-500 text-sm">{Math.round((Date.now() / 1000) - tx.timestamp)} secs ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm">From <span className="text-[#0ABAB5]">{tx.from ? `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}` : 'N/A'}</span></p>
              <p className="text-sm">To <span className="text-[#0ABAB5]">{tx.to ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : 'Contract Creation'}</span></p>
            </div>
            <div className="ml-4 p-2 bg-gray-100 rounded-full text-[#0ABAB5] text-sm">
              {tx.value ? (tx.value / 1e18).toFixed(4) : 'N/A'} Eth
            </div>
          </li>
        ))}
      </ul>
      {loading && <div className="text-center py-4">Loading more transactions...</div>}
    </div>
  );
}

export default TransactionList;
