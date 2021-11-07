import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

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
