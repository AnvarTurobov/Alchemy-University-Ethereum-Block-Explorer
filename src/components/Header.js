import React from 'react';

function Header() {
  return (
    <header className="stats-bg text-white p-8">
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">The Ethereum Blockchain Explorer by BlockScan</h1>
        <input
          type="text"
          className="p-2 w-full max-w-lg"
          placeholder="Search by Address / Txn Hash / Block / Token / Domain Name"
        />
      </div>
    </header>
  );
}

export default Header;

