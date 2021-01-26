import Arweave from 'arweave/web';
import CRYPTO from "crypto-js"

const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,           
    protocol: 'https',  
    timeout: 20000,     
    logging: false,     
});

const createTransaction = async (arReceiverAddress, arValue, walletData) => {
    let transaction = await arweave.createTransaction({
        target: arReceiverAddress,
        quantity: arweave.ar.arToWinston(arValue)
    }, walletData); 
    return transaction
}

const signAndDeployTransaction = async(transaction, walletData) => {
    await arweave.transactions.sign(transaction, walletData);    
    const response = await arweave.transactions.post(transaction);
    return response
}

const getAddressAndBalance = async(walletData) => {
    const address = await arweave.wallets.jwkToAddress(walletData)
    const rawBalance =  await arweave.wallets.getBalance(address)
    const balance = await arweave.ar.winstonToAr(rawBalance)
    return{
        address,
        balance
    }
}

const encryptWallet = async(wallet, pass) => {
    var cipherWallet= await CRYPTO.AES.encrypt(JSON.stringify(wallet), pass)
    return cipherWallet
}

const decryptWallet = async(wallet, pass) => {
    var bytes  = CRYPTO.AES.decrypt(wallet.toString(), pass);
    var decryptedData = JSON.parse(bytes.toString(CRYPTO.enc.Utf8));
    return decryptedData
}

export{
    createTransaction,
    signAndDeployTransaction,
    getAddressAndBalance,
    encryptWallet,
    decryptWallet
}

  
  