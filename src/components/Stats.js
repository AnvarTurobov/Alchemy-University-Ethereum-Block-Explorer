import React from 'react';

function Stats({blockNumber}) {
  return (
    <div className="grid grid-cols-3 gap-4 text-center text-gray-700 mb-8">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold">ETH Price</h2>
        <p className="text-2xl mt-2">$3,075.40 <span className="text-red-500">(1.27%)</span></p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold">Transactions</h2>
        <p className="text-2xl mt-2">2,375.12M <span className="text-sm">(13.2 TPS)</span></p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold">Market Cap</h2>
        <p className="text-2xl mt-2">$369,429,919,284.00</p>
      </div>
      <div className="bg-white p-6 rounded shadow col-span-2">
        <h2 className="text-xl font-bold">Med Gas Price</h2>
        <p className="text-2xl mt-2">3 Gwei <span className="text-sm">($0.19)</span></p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold">Last Finalized Block</h2>
        <p className="text-2xl mt-2">19905621</p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold">Block Number</h2>
        <p className="text-2xl mt-2"> {blockNumber} </p>

      </div>
    </div>
  );
}

export default Stats;
