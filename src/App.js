import React, { Fragment } from 'react';
import './App.css';
import { Grid, Checkbox,Tabs, Tab, Typography, Paper, Button, Divider, FormControl, InputLabel, InputBase, Dialog, DialogContent, CircularProgress, AppBar, Toolbar } from '@material-ui/core';
import Arweave from 'arweave/web';
import { withStyles } from '@material-ui/core/styles'
import { chain, add } from 'mathjs'
import {Decimal} from 'decimal.js';
import AES from "crypto-js/aes"
import { createTransaction, signAndDeployTransaction, getAddressAndBalance, decryptWallet, encryptWallet } from './utils/arweaveUtils';
import styles from './styles'
import LoadWallet from './components/LoadWallet';
import GenerateWallet from './components/GenerateWallet';
import EncryptWallet from './components/EncryptWallet';
import TxList from './components/TxList';
import ConfirmTxModal from './components/ConfirmTxModal';
import WalletHome from './components/WalletHome';
import { cipher } from 'node-forge';


const arweave = Arweave.init({
  host: 'arweave.net',
  port: 80,           
  protocol: 'https',  
  timeout: 20000,     
  logging: false,     
});


class App extends React.Component {

  state = {
    loadWallet:false,
    walletData:'',
    cryptoWallet:false,
    cryptoTxPass:'',
    arwAddress:'',
    arwBalance:'',
    arValue:'',
    arReceiverAddress:'',
    txSendArray:[],
    transactionData:'',
    modalTx:false,
    totalTransfer:'',
    newBalance:'',
    valueTab:0,
    txFee:'',
    //Load Wallet
    loadWalletData:'',
    boolPassLoadWallet:false,
    passLoadWallet:'',
    //Generate Wallet:
    generateWalletData:'',
    boolPassGenerateWallet:false,
    passGenerateWallet:'',
    //Encrypt Wallet:
    encryptWalletData:'',
    passEncryptWallet:''
  }

  change = e => {
    this.setState({[e.target.name]: e.target.value})
  }
  
  handlePassCheck = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  handleTabChange = (event, value) => {
    this.setState({ valueTab:value })
  }

  handleCloseTxModal = () => this.setState({modalTx:false})


  handleFileUpload = async(e, nameEvent) => {
    const rawWallet = await this.readWallet(e.target.files[0])
    this.setState({[nameEvent]:rawWallet})
  }

  readWallet = (walletFile) => {
    const readAsDataURL = (walletFile) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => {
          reader.abort()
          reject()
        }
        reader.addEventListener("load", () => {resolve(reader.result)}, false)
        reader.readAsText(walletFile)
      })
    }
    return readAsDataURL(walletFile);
  }


  //Load Wallet@@
  confirmLoadWallet = async() => {
  try{
    const walletData = this.state.loadWalletData
    if(this.state.boolPassLoadWallet){
      let walletDecrypt = await decryptWallet(walletData, this.state.passLoadWallet)
      const { address, balance} = await getAddressAndBalance(walletDecrypt)
      walletDecrypt = ''
      this.setState({loadWallet:true,walletData:walletData,cryptoWallet:true,arwAddress:address, arwBalance:balance, loadWalletData:''})
      return
    }else{
      let walletObj = JSON.parse(walletData)
      const { address, balance} = await getAddressAndBalance(walletObj)
      this.setState({loadWallet:true,walletData:walletObj,arwAddress:address, arwBalance:balance, loadWalletData:''})
      return
    }
  }catch(err){
    console.log(err)
    alert('Something wrong, check your file and/or your pass')
  }
  }

  //Generate Wallet @@
  generateWallet = async() => {
  try{
    let boolPassGenerateWallet = false
    let wallet = await arweave.wallets.generate();
    const { address, balance} = await getAddressAndBalance(wallet)
    let nameFile = `arweave_key_${address}.json`
    if(this.state.boolPassGenerateWallet){
      wallet = await encryptWallet(wallet, this.state.passGenerateWallet)
      boolPassGenerateWallet = true
      nameFile = `arweave_crypto_key_${address}.json`
    }
    const url = window.URL.createObjectURL(new Blob([wallet]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nameFile);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('Save your wallet file')
    this.setState({loadWallet:true,walletData:wallet,cryptoWallet:boolPassGenerateWallet, arwAddress:address, arwBalance:balance})
  }catch(err){
    console.log(err)
    alert('Error loading wallet')
  }
  }

  //Encrypt Wallet @@
  encryptActualWallet = async(e) =>{
  try{
    if(this.state.passEncryptWallet === ''){
      alert('Empty Pass')
      return
    }
    let walletObj = JSON.parse(this.state.encryptWalletData)
    const address = await arweave.wallets.jwkToAddress(walletObj)
    const cipherWallet = await encryptWallet(walletObj, this.state.passEncryptWallet)
    console.log(cipherWallet)
    console.log(typeof cipher)
    const url = window.URL.createObjectURL(new Blob([cipherWallet]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `arweave_crypto_key_${address}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.setState({passEncryptWallet:'', encryptWalletData:''})
    alert('Wallet Encrypted')
  }catch(err){
    console.log(err)
    alert('Something wrong')
  }
  }


  transferCrypto = async() => {
    try{
      let txArray = this.state.txSendArray
      let walletData = this.state.walletData
      if(this.state.cryptoWallet){
        walletData = await decryptWallet(walletData, this.state.cryptoTxPass)
      }
      const { arValue, arwBalance, arReceiverAddress} = this.state
      if(arValue <= arwBalance){
        let transaction = await createTransaction(arReceiverAddress, arValue, walletData)   
      const fee = arweave.ar.winstonToAr(transaction.reward)
      
      let result = await Decimal.add(fee, this.state.arValue).valueOf()
      let newBalance = await Decimal.sub(this.state.arwBalance, result).valueOf()
      this.setState({transactionData:transaction, modalTx:true, totalTransfer:result,txFee:fee, newBalance, cryptoTxPass:''})
      }else{
        alert("Insuficient founds")
      }
    }catch(err){
      alert('Something wrong')
    }
  }

  confirmTransferCrypto = async() => {
    try{
      this.setState({txRunning:true})
      let walletData = this.state.walletData
      if(this.state.cryptoWallet){
        walletData = await decryptWallet(walletData, this.state.cryptoTxPass)
      }
      let txArray = this.state.txSendArray
      let transaction = this.state.transactionData
      const { arValue, arwBalance, arReceiverAddress} = this.state
      const response = await signAndDeployTransaction(transaction, walletData)
      if(response.data === "OK" && response.status === 200){
        const obj = {
          txId:transaction.id,
          to:arReceiverAddress,
          value:arValue,
          reward:arweave.ar.winstonToAr(transaction.reward)
        }
        txArray.push(obj)
        console.log(txArray)
        const newBalance  = Decimal.sub(arwBalance, arValue).valueOf()
        this.setState({cryptoTxPass:'',txSendArray:txArray, arValue:'', arReceiverAddress:'', txRunning:false, arwBalance:newBalance, modalTx:false})
        const status = await arweave.transactions.getStatus(transaction.id)
        walletData = ''
        console.log(status)
        alert('Transaction Deploy')
        console.log(this.state.txSendArray)
        return
      }
      alert('Transaction Failed')
      walletData = ''
      this.setState({txRunning:false, cryptoTxPass:''})
      console.log(response)
      console.log(transaction)
    }catch(err){
      alert('Transaction Failed')
      this.setState({txRunning:false, cryptoTxPass:''})
    }

  }



  walletDiv = () => {
    if(!this.state.loadWallet){
      return(
        <Grid style={{padding:10}}>
          <Paper>
          <Tabs
          value={this.state.valueTab}
          indicatorColor="primary"
          textColor="primary"
          name="valueTab"
          onChange={this.handleTabChange}
        >
          <Tab label="Load Wallet" />
          <Tab label="Generate Wallet" />
          <Tab label="Encrypt Wallet" />
        </Tabs>
          </Paper>
          <Paper style={{padding:20}}>
            {this.state.valueTab === 0 && <LoadWallet change={this.change} handlePassCheck={this.handlePassCheck} boolPassWallet={this.state.boolPassLoadWallet} handleWalletUpload={this.handleFileUpload} confirmLoadWallet={this.confirmLoadWallet}/>}
            {this.state.valueTab === 1 && <GenerateWallet change={this.change} handlePassCheck={this.handlePassCheck} generateWallet={this.generateWallet}/>}
            {this.state.valueTab === 2 && <EncryptWallet boolPassWallet={this.state.boolPassGenerateWallet} change={this.change} passWallet={this.state.passEncryptWallet} handleUpload={this.handleFileUpload} encryptWallet={this.encryptActualWallet}/>}

          </Paper>
        </Grid>
      )
    }else{
      return(
      <Grid>
        <Paper elevation={10} style={{padding:30}}>
        <WalletHome change={this.change} state={this.state} transferCrypto={this.transferCrypto}/>
        <TxList txList={this.state.txSendArray} />
        </Paper>
        <Dialog open={this.state.modalTx} onClose={this.handleCloseTxModal}>
          <DialogContent>
                    <ConfirmTxModal change={this.change} state={this.state} confirmTransferCrypto={this.confirmTransferCrypto}/>
          </DialogContent>
        </Dialog>
      </Grid>
      )
    }
  }


 


  render(){
    return (
      <Fragment>
        <AppBar position="fixed"><Toolbar>
          <Typography align="center" variant="h6">Arweave Simple Wallet</Typography>
        </Toolbar></AppBar>    
        <Grid container style={{backgroundColor:'black', minHeight:'100vh', marginTop:30}} justify="center" alignContent='center' direction="column">
            {this.walletDiv()}
        </Grid>
        </Fragment>
  );
  }
}

export default withStyles(styles, { withTheme: true })(App)