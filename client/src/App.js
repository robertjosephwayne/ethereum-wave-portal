import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { ethers } from 'ethers';
import abi from './utils/WavePortal.json';

import { Button, CircularProgress } from '@mui/material';

export default function App() {
    const [currentWaveCount, setCurrentWaveCount] = useState(0);
    const [currentAccount, setCurrentAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [pendingTransaction, setPendingTransaction] = useState('');
    const [lastTransaction, setLastTransaction] = useState('');
    const contractAddress = '0xCD3255ac7dcfD72a896a66577469590Fe36Ce48A';
    const contractABI = abi.abi;

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log('Make sure you have MetaMask!');
                return;
            } else {
                console.log('We have the Ethereum object', ethereum);
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log('Found an authorized account: ', account);
                setCurrentAccount(account);
            } else {
                console.log('No authorized account found.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert('Get MetaMask!');
                return;
            }

            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });

            console.log('Connected: ', accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const wave = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer,
                );

                const waveTxn = await wavePortalContract.wave();
                setLoading(true);
                setPendingTransaction(waveTxn.hash);

                await waveTxn.wait();
                setPendingTransaction('');
                setLastTransaction(waveTxn.hash);
                setLoading(false);

                refreshCurrentWaveCount();
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const refreshCurrentWaveCount = useCallback(async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer,
                );

                const count = await wavePortalContract.getTotalWaves();
                setCurrentWaveCount(count.toNumber());

                console.log('Retrieved total wave count: ', count.toNumber());
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    });

    const getEtherscanURL = (transaction) => {
        return `https://rinkeby.etherscan.io/tx/${transaction}`;
    };

    useEffect(() => {
        checkIfWalletIsConnected();
        refreshCurrentWaveCount();
    }, []);

    useEffect(() => {
        refreshCurrentWaveCount();
    }, [currentAccount]);

    return (
        <div className="main-container">
            <div className="data-container">
                <div className="header">👋 Hey there!</div>

                <div className="bio">
                    <div>Welcome to my wave portal.</div>
                </div>

                <div className="wave-count-container">
                    {!loading && !!currentWaveCount && (
                        <div>
                            I have received {currentWaveCount} waves. I'm really
                            popular.
                        </div>
                    )}

                    {!loading && !currentAccount && (
                        <div>Connect your Ethereum wallet and wave at me!</div>
                    )}

                    {loading && (
                        <div>
                            <CircularProgress className="loading-spinner" />
                        </div>
                    )}
                </div>

                {!loading && (
                    <div className="button-container">
                        {currentAccount && (
                            <Button onClick={wave}>Wave at Me</Button>
                        )}

                        {!currentAccount && (
                            <Button onClick={connectWallet}>
                                Connect Wallet
                            </Button>
                        )}
                    </div>
                )}

                <div className="transaction-container">
                    {pendingTransaction && (
                        <span>
                            Your wave is processing:
                            <a
                                href={getEtherscanURL(pendingTransaction)}
                                target="_blank">
                                View on Etherscan
                            </a>
                        </span>
                    )}

                    {lastTransaction && (
                        <span>
                            Your wave has been processed:
                            <a
                                href={getEtherscanURL(lastTransaction)}
                                target="_blank">
                                View on Etherscan
                            </a>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
