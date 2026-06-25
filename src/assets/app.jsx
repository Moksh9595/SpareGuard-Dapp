

import Header from '../components/Header.jsx';
import Transaction from '../components/Transaction.jsx';
import './app.jsx';


function App() {
  const [txHash, setTxHash] = React.useState("");
  const [txError, setTxError] = React.useState("");
  const [walletConnected, setWalletConnected] = React.useState(false);

  return (
    <div className="App">
      <Header />
      <Transaction
        onSuccess={hash => setTxHash(hash)}
        onError={err => setTxError(err.message || String(err))}
        disabled={!walletConnected}
      />
      {txHash && <div className="tx-feedback success">Transaction Success! Hash: {txHash}</div>}
      {txError && <div className="tx-feedback error">Transaction Failed: {txError}</div>}
    </div>
  );
}

export default App;


import React from "react";

