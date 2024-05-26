import React, { useEffect, useState, useRef } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import { Link } from 'react-router-dom';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function BlockList() {
  const [blocks, setBlocks] = useState([]); // State to store list of blocks
  const [loading, setLoading] = useState(false); // State to indicate loading status
  const observer = useRef(); // Ref for the intersection observer

  // Getting initial blocks on component mount
  useEffect(() => {
    fetchInitialBlocks();
  }, []);

  const fetchInitialBlocks = async () => {
    setLoading(true);
    try {
      const latestBlockNumber = await alchemy.core.getBlockNumber();
      const initialBlocks = await fetchBlocks(latestBlockNumber, 10);
      setBlocks(initialBlocks);
    } catch (error) {
      console.error('Error fetching initial blocks:', error);
    }
    setLoading(false);
  };

  const fetchBlocks = async (startBlockNumber, count) => {
    const blockPromises = [];
    for (let i = 0; i < count; i++) {
      blockPromises.push(alchemy.core.getBlockWithTransactions(startBlockNumber - i));
    }
    return Promise.all(blockPromises);
  };

  const lastBlockElementRef = useRef();
  const loadMoreBlocks = async (entry) => {
    if (entry[0].isIntersecting) {
      setLoading(true);
      const lastBlock = blocks[blocks.length - 1];
      try {
        const newBlocks = await fetchBlocks(lastBlock.number - 1, 10);
        setBlocks((prevBlocks) => [...prevBlocks, ...newBlocks]);
      } catch (error) {
        console.error('Error fetching more blocks:', error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(loadMoreBlocks);
    if (lastBlockElementRef.current) observer.current.observe(lastBlockElementRef.current);
  }, [loading, blocks]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">All Blocks</h2>
      <ul>
        {blocks.map((block, index) => (
          <li key={block.number} ref={blocks.length === index + 1 ? lastBlockElementRef : null} className="flex justify-between items-center py-2 border-b">
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18V3H3zm12 6h3M9 6h6M6 6h1m-1 6h12M6 18v-6h1m0 6h12m-1 0h-2m2-6H7m7 6h-2m-5 0h1m1 0h6m2-12h1m-1 0H6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="font-bold text-[#0ABAB5]">
                  <Link to={`/block/${block.number}`}>{block.number}</Link>
                </p>
                <p className="text-gray-500 text-sm">{Math.round((Date.now() / 1000) - block.timestamp)} secs ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm">Fee Recipient: <span className="text-[#0ABAB5]">{block.miner.slice(0, 10)}</span></p>
              <p className="text-gray-500 text-sm">{block.transactions.length} txns in {Math.round((Date.now() / 1000) - block.timestamp)} secs</p>
            </div>
            <div className="ml-4 p-2 bg-gray-100 rounded-full text-[#0ABAB5] text-sm">
              {block.gasUsed ? (block.gasUsed / 1e9).toFixed(4) : 'N/A'} Eth
            </div>
          </li>
        ))}
      </ul>
      {loading && <div className="text-center py-4">Loading more blocks...</div>}
    </div>
  );
}

export default BlockList;
