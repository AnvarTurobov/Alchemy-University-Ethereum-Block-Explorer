import React from 'react';

function Stats({
  ethPrice,
  ethPriceChange,
  marketCap,
  medGasPrice,
  blockNumber,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-gray-700 mb-8">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold">ETH Price</h2>
        <p className="text-2xl mt-2">
          ${ethPrice} <span className={ethPriceChange < 0 ? 'text-red-500' : 'text-green-500'}>({ethPriceChange}%)</span>
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
