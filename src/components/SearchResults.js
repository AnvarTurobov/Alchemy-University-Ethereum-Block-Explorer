import React, { useEffect, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function SearchResults() {
  const { query } = useParams(); // Extracting search query from the URL parameters
  const [results, setResults] = useState(null); // State to store search results
  const [loading, setLoading] = useState(false); // State to indicate loading status
  const history = useHistory(); // History object to programmatically navigate

  // Getting search results on component mount or when query changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data;
        if (query.length === 42) {
          // Search for address transactions
          data = await alchemy.core.getAssetTransfers({
            fromAddress: query,
            category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
          });
        } else if (query.length === 66) {
          // Search for transaction details
          data = await alchemy.core.getTransaction(query);
          history.push(`/transaction/${query}`); // Redirect to TransactionDetails page
        } else if (!isNaN(query)) {
          // Search for block details
          data = await alchemy.core.getBlockWithTransactions(parseInt(query, 10));
          history.push(`/block/${query}`); // Redirect to BlockDetails page
          return; // Exit the function to avoid setting results state
        }
        setResults(data); // Set search results in state
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [query, history]);

  if (loading) {
    return <div>Loading...</div>; // Displaying loading message if search results are not loaded
  }

  if (!results) {
    return <div>No results found.</div>; // Displaying message if no results found
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
      </div>
    </div>
  );
}

export default SearchResults;
