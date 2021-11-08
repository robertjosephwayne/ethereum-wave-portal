import React, { useEffect, useState } from "react";
import './App.css';

export default function App() {
    const [currentAccount, setCurrentAccount] = useState("");

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

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const wave = () => {

    }

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
            </div>
        </div>
    );
}
