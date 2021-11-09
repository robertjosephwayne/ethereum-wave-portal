import React, { useEffect, useState } from 'react';
import './App.css';
import { ethers } from 'ethers';
import abi from './utils/WavePortal.json';

import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from '@mui/material';

export default function App() {
    const [allWaves, setAllWaves] = useState([]);
    const [currentWaveCount, setCurrentWaveCount] = useState(0);
    const [currentAccount, setCurrentAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [pendingTransaction, setPendingTransaction] = useState('');
    const contractAddress = '0x529eB1e99658ebC23339FF17eac90A06152cB43A';
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
                getAllWaves();
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

                const message = prompt(
                    'Please enter a message to include with your wave: ',
                );

                const waveTxn = await wavePortalContract.wave(message || '', {
                    gasLimit: 300000,
                });
                setLoading(true);
                setPendingTransaction(waveTxn.hash);

                await waveTxn.wait();
                setPendingTransaction('');
                refreshCurrentWaveCount();
                setLoading(false);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const refreshCurrentWaveCount = async () => {
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
    };

    const getEtherscanURL = (transaction) => {
        return `https://rinkeby.etherscan.io/tx/${transaction}`;
    };

    const getAllWaves = async () => {
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

                const waves = await wavePortalContract.getAllWaves();

                let wavesCleaned = [];
                waves.forEach((wave) => {
                    wavesCleaned.push({
                        address: wave.waver,
                        timestamp: new Date(wave.timestamp * 1000),
                        message: wave.message,
                    });
                });

                setAllWaves(wavesCleaned);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
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
                            I have received {currentWaveCount}{' '}
                            {currentWaveCount === 1 ? 'wave' : 'waves'}. I'm
                            really popular.
                        </div>
                    )}

                    {!loading && !currentAccount && (
                        <div>Connect your Ethereum wallet and wave at me!</div>
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
                        <div>
                            Your wave is processing:
                            <a
                                href={getEtherscanURL(pendingTransaction)}
                                target="_blank">
                                View on Etherscan
                            </a>
                        </div>
                    )}

                    {loading && (
                        <div className="loading-container">
                            <CircularProgress />
                        </div>
                    )}

                    {!!allWaves.length && <h3>All Completed Waves</h3>}

                    {allWaves.map((wave, index) => {
                        return (
                            <Card key={index} className="wave-transaction">
                                <CardContent>
                                    <Typography>
                                        <b>Address:</b> {wave.address}
                                    </Typography>
                                    <Typography>
                                        <b>Time:</b> {wave.timestamp.toString()}
                                    </Typography>
                                    <Typography>
                                        <b>Message:</b> {wave.message}
                                    </Typography>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
