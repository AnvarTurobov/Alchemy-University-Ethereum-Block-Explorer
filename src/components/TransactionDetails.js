import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alchemy, Network } from 'alchemy-sdk';
import { formatUnits } from '@ethersproject/units';
import { Tooltip } from 'react-tooltip';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function TransactionDetails() {
  const { transactionHash } = useParams(); // Extracting transaction hash from the URL parameters
  const [transaction, setTransaction] = useState(null); // State to store transaction details

  // Getting transaction details on component mount or when transactionHash changes
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const tx = await alchemy.core.getTransaction(transactionHash);
        const receipt = await alchemy.core.getTransactionReceipt(transactionHash);
        const block = await alchemy.core.getBlock(receipt.blockNumber);
        setTransaction({ ...tx, ...receipt, timestamp: block.timestamp });
      } catch (error) {
        console.error('Error fetching transaction details:', error);
      }
    };

    fetchTransactionDetails();
  }, [transactionHash]);

  if (!transaction) {
    return <div>Loading...</div>; // Displaying loading message if transaction details are not loaded
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Transaction Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-bold">Transaction Hash:</span>
            <span data-tooltip-id="txHashTooltip" data-tooltip-content="The unique identifier for this transaction." className="tooltip-icon ml-2">ℹ️</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold">Status:</span>
            <span data-tooltip-id="statusTooltip" data-tooltip-content="The status of the transaction." className="tooltip-icon ml-2">ℹ️</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold">Block:</span>
            <span data-tooltip-id="blockTooltip" data-tooltip-content="The block number that contains this transaction." className="tooltip-icon ml-2">ℹ️</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold">Timestamp:</span>
            <span data-tooltip-id="timestampTooltip" data-tooltip-content="The time at which the block containing the transaction was mined." className="tooltip-icon ml-2">ℹ️</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="truncate md:whitespace-normal">{transaction.hash}</div>
          <div>{transaction.status === 1 ? 'Success' : 'Failed'}</div>
          <div>{transaction.blockNumber}</div>
          <div>{transaction.timestamp ? formatTimestamp(transaction.timestamp) : 'N/A'}</div>
        </div>
      </div>
      
      <hr className="my-4 border-gray-300" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-bold">From:</span>
            <span data-tooltip-id="fromTooltip" data-tooltip-content="The address that sent the transaction." className="tooltip-icon ml-2">ℹ️</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold">To:</span>
            <span data-tooltip-id="toTooltip" data-tooltip-content="The address that received the transaction." className="tooltip-icon ml-2">ℹ️</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold">Value:</span>
            <span data-tooltip-id="valueTooltip" data-tooltip-content="The amount of Ether transferred in the transaction." className="tooltip-icon ml-2">ℹ️</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold">Transaction Fee:</span>
            <span data-tooltip-id="txFeeTooltip" data-tooltip-content="The fee paid for the transaction." className="tooltip-icon ml-2">ℹ️</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold">Gas Price:</span>
            <span data-tooltip-id="gasPriceTooltip" data-tooltip-content="The price of gas for this transaction." className="tooltip-icon ml-2">ℹ️</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="truncate md:whitespace-normal">{transaction.from}</div>
          <div className="truncate md:whitespace-normal">{transaction.to ? transaction.to : 'Contract Creation'}</div>
          <div>{transaction.value ? `${formatUnits(transaction.value, 'ether')} ETH` : 'N/A'}</div>
          <div>{transaction.gasUsed ? `${formatUnits(transaction.gasUsed.mul(transaction.effectiveGasPrice), 'ether')} ETH` : 'N/A'}</div>
          <div>{transaction.gasPrice ? `${formatUnits(transaction.gasPrice, 'gwei')} Gwei` : 'N/A'}</div>
        </div>
      </div>
      <Tooltip id="txHashTooltip" />
      <Tooltip id="statusTooltip" />
      <Tooltip id="blockTooltip" />
      <Tooltip id="timestampTooltip" />
      <Tooltip id="fromTooltip" />
      <Tooltip id="toTooltip" />
      <Tooltip id="valueTooltip" />
      <Tooltip id="txFeeTooltip" />
      <Tooltip id="gasPriceTooltip" />
    </div>
  );
}

export default TransactionDetails;
