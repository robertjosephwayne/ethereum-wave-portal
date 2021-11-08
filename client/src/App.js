import React, { useCallback, useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

export default function App() {
    const [currentWaveCount, setCurrentWaveCount] = useState(0);
    const [currentAccount, setCurrentAccount] = useState("");
    const [loading, setLoading] = useState(true);
    const contractAddress = "0xCD3255ac7dcfD72a896a66577469590Fe36Ce48A";
    const contractABI = abi.abi;

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log("Make sure you have MetaMask!");
                return;
            } else {
                console.log("We have the Ethereum object", ethereum);
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account: ", account);
                setCurrentAccount(account);
            } else {
                console.log("No authorized account found.");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            console.log("Connected: ", accounts[0]);
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
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                const waveTxn = await wavePortalContract.wave();
                setLoading(true);
                console.log("Mining...", waveTxn.hash);
                
                await waveTxn.wait();
                console.log("Mined --", waveTxn.hash);
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
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                setLoading(true);
                const count = await wavePortalContract.getTotalWaves();
                setCurrentWaveCount(count.toNumber());
                setLoading(false);

                console.log('Retrieved total wave count: ', count.toNumber());
            } else {
                console.log("Ethereum object doesn't exist!");
            }

        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        checkIfWalletIsConnected();
        refreshCurrentWaveCount();
    }, []);

    return (
        <div className="main-container">
            <div className="data-container">
                <div className="header">👋 Hey there!</div>

                <div className="bio">
                    <div>Welcome to Robert's wave portal.</div>
                    <br />
                    <div>Connect your Ethereum wallet and wave at me!</div>
                </div>

                <button className="wave-button" onClick={wave}>
                    Wave at Me
                </button>

                {!currentAccount && (
                    <button className="wave-button" onClick={connectWallet}>
                        Connect Wallet
                    </button>
                )}

                {!loading && <div class="wave-count">Current Wave Count: {currentWaveCount}</div>}

                {loading && <div class="loading">Loading...</div>}

            </div>
        </div>
    );
}
