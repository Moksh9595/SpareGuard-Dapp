import React, { useState } from 'react';
import ConnectWallet from './pages/ConnectWallet';

function App() {
  const [account, setAccount] = useState(null);

  const connectWallet = async (address) => {
    // If an address is provided (e.g., from Freighter), use it directly
    if (address) {
      setAccount(address);
      return;
    }

    // Otherwise, attempt MetaMask (fallback)
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        alert('Connection to MetaMask was rejected.');
      }
    } else {
      alert('MetaMask is not installed.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <ConnectWallet onConnect={connectWallet} account={account} />
    </div>
  );
}

export default App;
