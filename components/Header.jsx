
import React, { useState } from 'react';
import { checkConnection, getBalance, retreivePublicKey } from './freighter';
import './Header.css';

const Header = () => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    setError("");
    try {
      const allowed = await checkConnection();
      if (!allowed) {
        setError("Permission denied");
        return;
      }
      const key = await retreivePublicKey();
      const bal = await getBalance();
      setPublicKey(key);
      setBalance(Number(bal).toFixed(2));
      setConnected(true);
    } catch (e) {
      setError("Failed to connect wallet");
      console.error(e);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setPublicKey("");
    setBalance(0);
    setError("");
  };

  return (
    <header className="header-bar">
      <div className="header-title">Stellar dApp</div>
      <div className="header-wallet-info">
        {publicKey && (
          <>
            <div className="wallet-address">
              {`${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`}
            </div>
            <div className="wallet-balance">
              Balance: {balance} XLM
            </div>
          </>
        )}
        {!connected ? (
          <button
            type="button"
            className="wallet-btn"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <button
            type="button"
            className="wallet-btn connected"
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
        )}
      </div>
      {error && <div className="wallet-error">{error}</div>}
    </header>
  );
};

export default Header;
