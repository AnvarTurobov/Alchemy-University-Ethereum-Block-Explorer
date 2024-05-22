import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Header() {
  const [query, setQuery] = useState('');
  const history = useHistory();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      history.push(`/search/${query.trim()}`);
    }
  };

  return (
    <header className="stats-bg text-white p-8">
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">The Ethereum Blockchain Explorer by ScanBlock</h1>
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
