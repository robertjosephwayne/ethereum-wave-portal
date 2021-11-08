import React, { useEffect } from "react";
import './App.css';

export default function App() {

    const checkIfWalletIsConnected = () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have MetaMask!");
            return;
        } else {
            console.log("We have the Ethereum object", ethereum);
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
            </div>
        </div>
    );
}
