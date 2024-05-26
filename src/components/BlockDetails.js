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

function BlockDetails() {
  const { blockNumber } = useParams(); // Extracting block number from the URL parameters
  const [block, setBlock] = useState(null); // State to store block details

  // Getting block details on component mount or when blockNumber changes
  useEffect(() => {
    const fetchBlockDetails = async () => {
      try {
        const blockDetails = await alchemy.core.getBlockWithTransactions(parseInt(blockNumber, 10));
        setBlock(blockDetails); // Setting block details in state
      } catch (error) {
        console.error('Error fetching block details:', error);
      }
    };

    fetchBlockDetails();
  }, [blockNumber]);

  if (!block) {
    return <div>Loading...</div>; // Displaying loading message if block details are not loaded
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Block {block.number}</h2>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-bold">Block Height:</span>
            <span data-tooltip-id="blockHeightTooltip" data-tooltip-content="The height of the block in the blockchain." className="tooltip-icon ml-2">ℹ️</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold">Status:</span>
            <span data-tooltip-id="statusTooltip"  className="tooltip-icon ml-2" data-tooltip-content="The finality status of the block.">ℹ️</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold">Timestamp:</span>
            <span data-tooltip-id="timestampTooltip" data-tooltip-content="The time the block was mined." className="tooltip-icon ml-2">ℹ️</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold">Transactions:</span>
            <span data-tooltip-id="transactionsTooltip" data-tooltip-content="The number of transactions included in the block." className="tooltip-icon ml-2">ℹ️</span>
          </div>
          {block.miner && (
            <div className="flex items-center">
              <span className="font-bold">Fee Recipient:</span>
              <span data-tooltip-id="feeRecipientTooltip" data-tooltip-content="The address that received the transaction fees." className="tooltip-icon ml-2">ℹ️</span>
            </div>
          )}
          {block.gasUsed && (
            <div className="flex items-center">
              <span className="font-bold">Gas Used:</span>
              <span data-tooltip-id="gasUsedTooltip" data-tooltip-content="The total gas used by all transactions in the block." className="tooltip-icon ml-2">ℹ️</span>
            </div>
          )}
          {block.gasLimit && (
            <div className="flex items-center">
              <span className="font-bold">Gas Limit:</span>
              <span data-tooltip-id="gasLimitTooltip" data-tooltip-content="The gas limit specified for the block." className="tooltip-icon ml-2">ℹ️</span>
            </div>
          )}
          {block.baseFeePerGas && (
            <div className="flex items-center">
              <span className="font-bold">Base Fee Per Gas:</span>
              <span data-tooltip-id="baseFeeTooltip" data-tooltip-content="The base fee per gas unit." className="tooltip-icon ml-2">ℹ️</span>
            </div>
          )}
          {block.extraData && (
            <div className="flex items-center">
              <span className="font-bold">Extra Data:</span>
              <span data-tooltip-id="extraDataTooltip" data-tooltip-content="Any extra data included in the block." className="tooltip-icon ml-2">ℹ️</span>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>{block.number}</div>
          <div>{block.status ? 'Finalized' : 'Unfinalized (Safe)'}</div>
          <div>{block.timestamp ? new Date(block.timestamp * 1000).toLocaleString() : ''}</div>
          <div>{block.transactions ? block.transactions.length : ''}</div>
          {block.miner && <div>{block.miner}</div>}
          {block.gasUsed && <div>{block.gasUsed.toString()}</div>}
          {block.gasLimit && <div>{block.gasLimit.toString()}</div>}
          {block.baseFeePerGas && (
            <div>
              {formatUnits(block.baseFeePerGas, 'ether')} ETH ({formatUnits(block.baseFeePerGas, 'gwei')} Gwei)
            </div>
          )}
          {block.extraData && <div>{block.extraData}</div>}
        </div>
      </div>
      <Tooltip id="blockHeightTooltip" />
      <Tooltip id="statusTooltip" />
      <Tooltip id="timestampTooltip" />
      <Tooltip id="transactionsTooltip" />
      <Tooltip id="feeRecipientTooltip" />
      <Tooltip id="gasUsedTooltip" />
      <Tooltip id="gasLimitTooltip" />
      <Tooltip id="baseFeeTooltip" />
      <Tooltip id="extraDataTooltip" />
    </div>
  );
}

export default BlockDetails;
