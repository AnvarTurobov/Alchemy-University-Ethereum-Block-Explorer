import React, { useEffect, useState, useRef } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import { useParams, Link } from 'react-router-dom';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function TransactionList() {
  const { address } = useParams(); // Extracting address from the URL parameters
  const [transactions, setTransactions] = useState([]); // State to store list of transactions
  const [loading, setLoading] = useState(false); // State to indicate loading status
  const observer = useRef(); // Ref for the intersection observer
  const lastTransactionElementRef = useRef(); // Ref for the last transaction element
  const [currentPage, setCurrentPage] = useState(0); // State for current page of transactions
  const transactionsPerPage = 10; // Number of transactions to fetch per page
  const [blockNumber, setBlockNumber] = useState(null); // State to store latest block number

  // Getting initial transactions on component mount or when address changes
  useEffect(() => {
    if (address) {
      fetchTransactionsForAddress(address, 0);
    } else {
      fetchInitialTransactions();
    }
  }, [address]);

  const fetchInitialTransactions = async () => {
    setLoading(true);
    try {
      const latestBlockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(latestBlockNumber); // Setting blockNumber here
      const initialTransactions = await fetchTransactions(latestBlockNumber, transactionsPerPage);
      setTransactions(initialTransactions);
    } catch (error) {
      console.error('Error fetching initial transactions:', error);
    }
    setLoading(false);
  };

  const fetchTransactionsForAddress = async (address, page) => {
    setLoading(true);
    try {
      const data = await retryRequest(() =>
        alchemy.core.getAssetTransfers({
          fromAddress: address,
          category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
          pageKey: page ? `page-${page}` : null,
          maxCount: transactionsPerPage,
        })
      );

      const transactionsWithTimestamps = await Promise.all(data.transfers.map(async (transfer) => {
        const block = await retryRequest(() => alchemy.core.getBlock(parseInt(transfer.blockNum, 16)));
        return { ...transfer, timestamp: block.timestamp };
      }));

      setTransactions((prev) => [...prev, ...transactionsWithTimestamps]);
      setCurrentPage(page + 1);
    } catch (error) {
      console.error('Error fetching transactions for address:', error);
    }
    setLoading(false);
  };

  const fetchTransactions = async (startBlockNumber, count) => {
    const transactionPromises = [];
    for (let i = 0; i < count; i++) {
      transactionPromises.push(retryRequest(() => alchemy.core.getBlockWithTransactions(startBlockNumber - i)));
    }
    const blocks = await Promise.all(transactionPromises);
    return blocks.flatMap(block => block.transactions.map(tx => ({
      ...tx,
      timestamp: block.timestamp
    })));
  };

  const retryRequest = async (requestFunc, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await requestFunc();
      } catch (error) {
        if (error.response && error.response.status === 429 && i < retries - 1) {
          console.warn(`Rate limited. Retrying request... (${i + 1}/${retries})`);
          await new Promise(res => setTimeout(res, delay));
        } else {
          throw error;
        }
      }
    }
  };

  const loadMoreTransactions = async (entry) => {
    if (entry[0].isIntersecting) {
      setLoading(true);
      try {
        const nextPage = currentPage;
        if (address) {
          await fetchTransactionsForAddress(address, nextPage);
        } else {
          const newTransactions = await fetchTransactions(blockNumber - transactions.length / transactionsPerPage, transactionsPerPage);
          setTransactions((prevTransactions) => [...prevTransactions, ...newTransactions]);
        }
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

  const getTimeDifference = (timestamp) => {
    const now = Date.now() / 1000;
    const difference = now - timestamp;
    return difference < 60
      ? `${Math.round(difference)} secs ago`
      : difference < 3600
      ? `${Math.round(difference / 60)} mins ago`
      : difference < 86400
      ? `${Math.round(difference / 3600)} hrs ago`
      : `${Math.round(difference / 86400)} days ago`;
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Transactions {address && `for ${address}`}</h2>
      <ul>
        {transactions.map((tx, index) => (
          <li key={tx.hash || tx.uniqueId} ref={transactions.length === index + 1 ? lastTransactionElementRef : null} className="flex justify-between items-center py-2 border-b">
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10h10M7 14h5M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 2 0 012-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="font-bold text-[#0ABAB5]">
                  <Link to={`/transaction/${tx.hash}`}>{(tx.hash || tx.uniqueId).slice(0, 10)}...</Link>
                </p>
                <p className="text-gray-500 text-sm">{tx.timestamp ? getTimeDifference(tx.timestamp) : 'N/A'}</p>
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
