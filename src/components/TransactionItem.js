import React from 'react';
import { Link } from 'react-router-dom';

const TransactionItem = ({ transaction }) => {
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
    <li className="flex justify-between items-center py-2 border-b">
      <div className="flex items-center">
        <div className="bg-gray-100 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10h10M7 14h5M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
          </svg>
        </div>
        <div className="ml-4">
          <p className="font-bold text-[#0ABAB5]">
            <Link to={`/transaction/${transaction.hash}`}>{transaction.hash.slice(0, 10)}...</Link>
          </p>
          <p className="text-gray-500 text-sm">{transaction.timestamp ? getTimeDifference(transaction.timestamp) : 'N/A'}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm">From <span className="text-[#0ABAB5]">{transaction.from ? `${transaction.from.slice(0, 6)}...${transaction.from.slice(-4)}` : 'N/A'}</span></p>
        <p className="text-sm">To <span className="text-[#0ABAB5]">{transaction.to ? `${transaction.to.slice(0, 6)}...${transaction.to.slice(-4)}` : 'Contract Creation'}</span></p>
      </div>
      <div className="ml-4 p-2 bg-gray-100 rounded-full text-[#0ABAB5] text-sm">
        {transaction.value ? (transaction.value / 1e18).toFixed(4) : 'N/A'} Eth
      </div>
    </li>
  );
};

export default TransactionItem;
