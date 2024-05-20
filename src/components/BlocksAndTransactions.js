function BlocksAndTransactions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Latest Blocks */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Latest Blocks</h2>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">
            Customize
          </button>
        </div>
        <ul>
          <li className="flex justify-between py-2 border-b">
            <div>
              <p className="font-bold">19905708</p>
              <p>Fee Recipient: Titan Builder</p>
              <p className="text-gray-500 text-sm">180 txns in 12 secs</p>
            </div>
            <div className="text-right">
              <p className="font-bold">0.02362 Eth</p>
              <p className="text-gray-500 text-sm">13 secs ago</p>
            </div>
          </li>
          <li className="flex justify-between py-2 border-b">
            <div>
              <p className="font-bold">19905707</p>
              <p>Fee Recipient: beaverbuild</p>
              <p className="text-gray-500 text-sm">127 txns in 12 secs</p>
            </div>
            <div className="text-right">
              <p className="font-bold">0.061 Eth</p>
              <p className="text-gray-500 text-sm">13 secs ago</p>
            </div>
          </li>
          <li className="flex justify-between py-2 border-b">
            <div>
              <p className="font-bold">19905706</p>
              <p>Fee Recipient: Titan Builder</p>
              <p className="text-gray-500 text-sm">155 txns in 12 secs</p>
            </div>
            <div className="text-right">
              <p className="font-bold">0.12478 Eth</p>
              <p className="text-gray-500 text-sm">49 secs ago</p>
            </div>
          </li>
          <li className="flex justify-between py-2 border-b">
            <div>
              <p className="font-bold">19905705</p>
              <p>Fee Recipient: Titan Builder</p>
              <p className="text-gray-500 text-sm">227 txns in 12 secs</p>
            </div>
            <div className="text-right">
              <p className="font-bold">0.02865 Eth</p>
              <p className="text-gray-500 text-sm">1 min ago</p>
            </div>
          </li>
          <li className="flex justify-between py-2 border-b">
            <div>
              <p className="font-bold">19905704</p>
              <p>Fee Recipient: beaverbuild</p>
              <p className="text-gray-500 text-sm">176 txns in 12 secs</p>
            </div>
            <div className="text-right">
              <p className="font-bold">0.02537 Eth</p>
              <p className="text-gray-500 text-sm">1 min ago</p>
            </div>
          </li>
        </ul>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mt-4 w-full"
        >
          View All Blocks
        </button>
      </div>

      {/* Latest Transactions */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Latest Transactions</h2>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">
            Customize
          </button>
        </div>
        <ul>
          <li className="flex justify-between py-2 border-b">
            <div>
              <p className="font-bold">0x4a8308fe5..</p>
              <p>From 0x4838B106...B0BAD5F97r</p>
              <p className="text-gray-500 text-sm">To 0xA8C62111...c42632f64</p>
            </div>
            <div className="text-right">
              <p className="font-bold">0.07356 Eth</p>
              <p className="text-gray-500 text-sm">13 secs ago</p>
            </div>
          </li>
          <li className="flex justify-between py-2 border-b">
            <div>
              <p className="font-bold">0x8b6e599adf...</p>
              <p>From 0x834f0b25...82694oFb</p>
              <p className="text-gray-500 text-sm">To 0xDef1c0de...027b2EF9F</p>
            </div>
            <div className="text-right">
              <p className="font-bold">0.061 Eth</p>
              <p className="text-gray-500 text-sm">43 secs ago</p>
            </div>
          </li>
          <li className="flex justify-between py-2 border-b">
            <div>
              <p className="font-bold">0x31e51338ef...</p>
              <p>From 0x8aB87994...80CFf274</p>
              <p className="text-gray-500 text-sm">To 0x7496062...c418e3087</p>
            </div>
            <div className="text-right">
              <p className="font-bold">0.12478 Eth</p>
              <p className="text-gray-500 text-sm">68 secs ago</p>
            </div>
          </li>
          <li className="flex justify-between py-2 border-b">
            <div>
              <p className="font-bold">0xa2898e852...</p>
              <p>From 0xA0E20E5A...a724aefbA</p>
              <p className="text-gray-500 text-sm">To 0x881D4023...dC08D300C</p>
            </div>
            <div className="text-right">
              <p className="font-bold">0.02865 Eth</p>
              <p className="text-gray-500 text-sm">1 min ago</p>
            </div>
          </li>
          <li className="flex justify-between py-2 border-b">
            <div>
              <p className="font-bold">0xd50852c317...</p>
              <p>From 0x4F9924E4...359bCEbE</p>
              <p className="text-gray-500 text-sm">To 0x11111112...73A96D502</p>
            </div>
            <div className="text-right">
              <p className="font-bold">0.05539 Eth</p>
              <p className="text-gray-500 text-sm">1 min ago</p>
            </div>
          </li>
        </ul>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mt-4 w-full"
        >
          View All Transactions
        </button>
      </div>
    </div>
  );
}

export default BlocksAndTransactions;

