import { signTransaction, getAddress, setAllowed } from "@stellar/freighter-api";
import * as StellarPkg from "@stellar/stellar-sdk";

const StellarSdk = StellarPkg.default ?? StellarPkg;
const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

const checkConnection = async () => {
    return await setAllowed();
}

const retreivePublicKey = async () => {
    const {address} = await getAddress();
    return address;
};

const getBalance = async () => {
    await setAllowed();
    const { address } = await getAddress();
    const account = await server.loadAccount(address);
    const xlm = account.balances.find((b) => b.asset_type === "native");
    return xlm?.balance; // "0"
};

// ...existing code...

export { checkConnection, retreivePublicKey, getBalance, signTransaction };