import React from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Stats from './components/Stats';
import BlocksAndTransactions from './components/BlocksAndTransactions';


import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

//import './App.css';

const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);


function App() {
    const [blockNumber, setBlockNumber] = useState();

    useEffect(() => {
        async function getBlockNumber() {
            setBlockNumber(await alchemy.core.getBlockNumber());
        }

        getBlockNumber();
    }, []);


    return (
        <div className="bg-gray-100 font-sans leading-normal tracking-normal">
            <Navbar />
            <Header />
            <main className="container mx-auto p-8">
                <Stats blockNumber={blockNumber}/>
                
                <BlocksAndTransactions />
            </main>
        </div>
    );
}

export default App;

