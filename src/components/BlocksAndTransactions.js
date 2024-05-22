import React from 'react';
import { Link } from 'react-router-dom';

function BlocksAndTransactions({ latestBlocks }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Latest Blocks */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Latest Blocks</h2>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">
            Customize
          </button>
        </div>
        <ul>
          {latestBlocks && latestBlocks.slice(0, 7).map((block, index) => (
            <li key={index} className="flex justify-between items-center py-2 border-b">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18V3H3zm12 6h3M9 6h6M6 6h1m-1 6h12M6 18v-6h1m0 6h12m-1 0h-2m2-6H7m7 6h-2m-5 0h1m1 0h6m2-12h1m-1 0H6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="font-bold text-blue-600">
                    <Link to={`/block/${block.number}`}>{block.number}</Link>
                  </p>
                  <p className="text-gray-500 text-sm">{Math.round((Date.now() / 1000) - block.timestamp)} secs ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">Fee Recipient: <span className="text-blue-600">{block.miner.slice(0, 10)}</span></p>
                <p className="text-gray-500 text-sm">{block.transactions.length} txns in {Math.round((Date.now() / 1000) - block.timestamp)} secs</p>
              </div>
              <div className="ml-4 p-2 bg-gray-100 rounded-full text-gray-600 text-sm">
                {block.gasUsed ? (block.gasUsed / 1e9).toFixed(4) : 'N/A'} Eth
              </div>
            </li>
          ))}
        </ul>
        <Link to="/blocks">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mt-4 w-full">
            View All Blocks
          </button>
        </Link>
      </div>

      {/* Latest Transactions */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Latest Transactions</h2>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">
            Customize
          </button>
        </div>
        <ul>
          {latestBlocks && latestBlocks[0] && latestBlocks[0].transactions.slice(0, 7).map((tx, index) => (
            <li key={index} className="flex justify-between items-center py-2 border-b">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10h10M7 14h5M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 2 0 012-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="font-bold text-blue-600"><Link to={`/transaction/${tx.hash}`}>{tx.hash.slice(0, 10)}...</Link></p>
                  <p className="text-gray-500 text-sm">{Math.round((Date.now() / 1000) - latestBlocks[0].timestamp)} secs ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">From <span className="text-blue-600">{tx.from ? `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}` : 'N/A'}</span></p>
                <p className="text-sm">To <span className="text-blue-600">{tx.to ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : 'Contract Creation'}</span></p>
              </div>
              <div className="ml-4 p-2 bg-gray-100 rounded-full text-gray-600 text-sm">
                {tx.value ? (tx.value / 1e18).toFixed(4) : 'N/A'} Eth
              </div>
            </li>
          ))}
        </ul>
        <Link to="/transactions">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mt-4 w-full">
            View All Transactions
          </button>
        </Link>
      </div>
    </div>
  );
}

export default BlocksAndTransactions;
