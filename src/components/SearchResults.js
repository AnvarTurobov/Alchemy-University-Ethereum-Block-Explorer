import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alchemy, Network } from 'alchemy-sdk';
import { Link } from 'react-router-dom';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function SearchResults() {
  const { query } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data;
        if (query.length === 42) {
          // Address
          data = await alchemy.core.getAssetTransfers({
            fromAddress: query,
            category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
          });
        } else if (query.length === 66) {
          // Transaction hash
          data = await alchemy.core.getTransaction(query);
        } else if (!isNaN(query)) {
          // Block number
          data = await alchemy.core.getBlockWithTransactions(parseInt(query, 10));
        }
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!results) {
    return <div>No results found.</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Search Results for "{query}"</h2>
      <div>
        {results.transfers && results.transfers.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4">Transactions</h3>
            <ul>
              {results.transfers.map((tx, index) => (
                <li key={index} className="mb-4">
                  <Link to={`/transaction/${tx.hash}`} className="text-blue-600">{tx.hash}</Link>
                  <div className="text-sm text-gray-500">
                    <p>From: <Link to={`/address/${tx.from}`}>{tx.from}</Link></p>
                    <p>To: <Link to={`/address/${tx.to}`}>{tx.to}</Link></p>
                    <p>Value: {tx.value} {tx.asset}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {results.hash && (
          <div>
            <h3 className="text-xl font-bold mb-4">Transaction Details</h3>
            <p><Link to={`/transaction/${results.hash}`} className="text-blue-600">{results.hash}</Link></p>
          </div>
        )}
        {results.number && (
          <div>
            <h3 className="text-xl font-bold mb-4">Block Details</h3>
            <p><Link to={`/block/${results.number}`} className="text-blue-600">Block #{results.number}</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
