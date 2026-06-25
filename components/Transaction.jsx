import React, { useState } from 'react';
import { signTransaction, retreivePublicKey } from './freighter';
import * as StellarPkg from '@stellar/stellar-sdk';

const StellarSdk = StellarPkg.default ?? StellarPkg;

const Transaction = ({ onSuccess, onError, disabled }) => {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setStatus('');
    setTxHash('');
    setLoading(true);
    try {
      const source = await retreivePublicKey();
      const stellarServer = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
      const account = await stellarServer.loadAccount(source);
      const fee = await stellarServer.fetchBaseFee();
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination,
            asset: StellarSdk.Asset.native(),
            amount,
          })
        )
        .setTimeout(30)
        .build();
      // Freighter wallet popup for signing
      const signed = await signTransaction(transaction.toXDR(), {
        network: 'TESTNET', // Explicitly tell Freighter this is for Testnet
        accountToSign: source,
      });
      const tx = StellarSdk.TransactionBuilder.fromXDR(signed, StellarSdk.Networks.TESTNET);
      const result = await stellarServer.submitTransaction(tx);
      setStatus('success');
      setTxHash(result.hash);
      if (onSuccess) onSuccess(result.hash);
    } catch (e) {
      setStatus('failure');
      setTxHash('');
      if (onError) onError(e);
      // Show error message to user
      setTimeout(() => {
        setStatus('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-box">
      <h3>Send XLM</h3>
      <input
        type="text"
        placeholder="Destination Address"
        value={destination}
        onChange={e => setDestination(e.target.value)}
        
        
      />
      <input
        type="number"
        placeholder="Amount (XLM)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      
      
      />
      <button onClick={handleSend} >
        {loading ? 'Sending...' : 'Send'}
      </button>
      {status === 'success' && txHash && (
        <div className="tx-success">
          <strong>Transaction Success!</strong><br />
          Transaction Hash: <a href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a>
        </div>
      )}
      {status === 'failure' && (
        <div className="tx-failure">Transaction Failed. Please check your input and wallet popup.</div>
      )}
    </div>
  );
};

export default Transaction;
