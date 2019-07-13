import React, { Fragment } from 'react';
import './App.css';
import { Grid, Tabs, Tab, Typography, Paper, Dialog, DialogContent, AppBar, Toolbar, CircularProgress } from '@material-ui/core';
import Arweave from 'arweave/web';
import { withStyles } from '@material-ui/core/styles'
import {Decimal} from 'decimal.js';
import { createTransaction, signAndDeployTransaction, getAddressAndBalance, decryptWallet, encryptWallet } from './utils/arweaveUtils';
import styles from './styles'
import LoadWallet from './components/LoadWallet';
import GenerateWallet from './components/GenerateWallet';
import EncryptWallet from './components/EncryptWallet';
import TxList from './components/TxList';
import ConfirmTxModal from './components/ConfirmTxModal';
import WalletHome from './components/WalletHome';


const arweave = Arweave.init({
  host: 'arweave.net',
  port: 80,           
  protocol: 'https',  
  timeout: 20000,     
  logging: false,     
});


class App extends React.Component {

  state = {
    loading:false,
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
    this.setState({loading:true})
    const walletData = this.state.loadWalletData
    if(this.state.boolPassLoadWallet){
      let walletDecrypt = await decryptWallet(walletData, this.state.passLoadWallet)
      const { address, balance} = await getAddressAndBalance(walletDecrypt)
      walletDecrypt = ''
      this.setState({loading:false, loadWallet:true,walletData:walletData,cryptoWallet:true,arwAddress:address, arwBalance:balance, loadWalletData:''})
      return
    }else{
      let walletObj = JSON.parse(walletData)
      const { address, balance} = await getAddressAndBalance(walletObj)
      this.setState({loading:false, loadWallet:true,walletData:walletObj,arwAddress:address, arwBalance:balance, loadWalletData:''})
      return
    }
  }catch(err){
    console.log(err)
    this.setState({loading:false})
    alert('Something wrong, check your file and/or your pass')
  }
  }

  //Generate Wallet @@
  generateWallet = async() => {
  try{
    this.setState({loading:true})
    let boolPassGenerateWallet = false
    let wallet = await arweave.wallets.generate();
    const { address, balance} = await getAddressAndBalance(wallet)
    let nameFile = `arweave_key_${address}.json`
    let url
    if(this.state.boolPassGenerateWallet){
      wallet = await encryptWallet(wallet, this.state.passGenerateWallet)
      boolPassGenerateWallet = true
      nameFile = `arweave_crypto_key_${address}.json`
      url = window.URL.createObjectURL(new Blob([wallet]));
    }else{
      url = window.URL.createObjectURL(new Blob([JSON.stringify(wallet)]));
    }
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nameFile);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('Save your wallet file')
    this.setState({loading:false,loadWallet:true,walletData:wallet,cryptoWallet:boolPassGenerateWallet, arwAddress:address, arwBalance:balance})
  }catch(err){
    console.log(err)
    this.setState({loading:false})
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
    this.setState({loading:true})
    let walletObj = JSON.parse(this.state.encryptWalletData)
    const address = await arweave.wallets.jwkToAddress(walletObj)
    const cipherWallet = await encryptWallet(walletObj, this.state.passEncryptWallet)
    const url = window.URL.createObjectURL(new Blob([cipherWallet]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `arweave_crypto_key_${address}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.setState({passEncryptWallet:'', encryptWalletData:'', loading:false})
    alert('Wallet Encrypted')
  }catch(err){
    console.log(err)
    this.setState({loading:false})
    alert('Something wrong')
  }
  }


  transferCrypto = async() => {
    try{
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
        const newBalance  = Decimal.sub(arwBalance, arValue).valueOf()
        this.setState({cryptoTxPass:'',txSendArray:txArray, arValue:'', arReceiverAddress:'', txRunning:false, arwBalance:newBalance, modalTx:false})
        walletData = ''
        alert('Transaction Deploy')
        return
      }
      alert('Transaction Failed')
      walletData = ''
      this.setState({txRunning:false, cryptoTxPass:''})
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
        <AppBar position="fixed" style={{alignItems:"center"}}><Toolbar>
          <Typography align="center" variant="h6">Arweave Simple Wallet</Typography>
        </Toolbar></AppBar>    
        <Grid container style={{backgroundColor:'black', minHeight:'100vh', marginTop:30}} justify="center" alignContent='center' direction="column">
            {this.walletDiv()}
        </Grid>
        <Dialog open={this.state.loading}>
          <DialogContent>
                    <CircularProgress/>
          </DialogContent>
        </Dialog>
        </Fragment>
  );
  }
}

export default withStyles(styles, { withTheme: true })(App)
