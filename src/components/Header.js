import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Header() {
  const [query, setQuery] = useState(''); // State to store the search query
  const history = useHistory(); // History object to programmatically navigate

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      if (query.length === 42) {
        history.push(`/address/${query.trim()}`); // Redirecting to address transactions
      } else if (query.length === 66) {
        history.push(`/transaction/${query.trim()}`); // Redirecting to transaction details
      } else if (!isNaN(query.trim())) {
        history.push(`/block/${query.trim()}`); // Redirecting to block details
      }
    }
  };

  return (
    <header className="stats-bg text-white p-4 md:p-8">
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-center">The Ethereum Blockchain Explorer by ScanBlock</h1>
        <form onSubmit={handleSearch} className="w-full max-w-lg">
          <input
            type="text"
            style={{ color: '#0ABAB5' }}
            className="p-2 w-full text-black"
            placeholder="Search by Address / Txn Hash / Block Number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
}

export default Header;
