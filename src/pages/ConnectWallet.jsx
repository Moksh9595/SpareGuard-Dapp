import React, { useState, useEffect } from 'react';
import './ConnectWallet.css';
import { checkConnection, retreivePublicKey, getBalance } from '../../components/freighter';

const FREIGHTER_SITE = 'https://freighter.app/';

const ConnectWallet = ({ onConnect, account }) => {
  const [hasFreighter, setHasFreighter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // Detect Freighter injected API
    const detected = typeof window.freighterApi !== 'undefined';
    setHasFreighter(detected);
  }, []);

  const handleFreighterConnect = async () => {
    setLoading(true);
    try {
      // ask Freighter extension for permission and get address
      await checkConnection();
      const address = await retreivePublicKey();
      if (address) {
        onConnect(address);
        const xlmBalance = await getBalance();
        setBalance(xlmBalance ?? null);
      }
    } catch (err) {
      console.error('Freighter connection failed', err);
      alert('Failed to connect to Freighter. Check the extension and try again.');
    } finally {
      setLoading(false);
    }
  };

  const openFreighterSite = () => {
    // open the Freighter website (user can install extension from there)
    window.open(FREIGHTER_SITE, '_blank', 'noopener');
  };

  return (
    <div className="connect-wallet-container">
      <h2>Connect Your Wallet</h2>
      {account ? (
        <div className="wallet-info">
          <span>Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
          {balance !== null && (
            <div className="wallet-balance">Balance: {balance} XLM</div>
          )}
        </div>
      ) : (
        <div>
          <button className="connect-btn" onClick={handleFreighterConnect} disabled={loading}>
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
          {!hasFreighter && (
            <div style={{ marginTop: 20 }}>
              <button className="connect-btn" onClick={openFreighterSite}>
                Install Freighter
              </button>
              <div style={{ marginTop: 8 }}>
                <small>If you already have Freighter installed, refresh the page after installing.</small>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
