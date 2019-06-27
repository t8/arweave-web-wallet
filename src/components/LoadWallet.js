import React from 'react'
import { Grid, Button, Checkbox, Typography, InputBase} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import styles from '../styles'


const LoadWallet = ({handleWalletUpload,confirmLoadWallet,handlePassCheck,boolPassWallet,change, classes}) => {
    return(
      <Grid container direction="column" justify="center" alignContent="center" alignItems="center">
            <Typography align="center" style={{padding:5}} variant="body2">Upload you Arweave Wallet</Typography>
            <input style={{paddingBottom:15, maxWidth:350}} type="file" onChange={ e => handleWalletUpload(e, 'loadWalletData')} />
            <Grid container  justify="center" alignContent="center"  direction="row">
            <Checkbox value={boolPassWallet} onChange={handlePassCheck('boolPassLoadWallet')}  color="default" />
            <Typography style={{paddingTop:13}}>Password</Typography>
            </Grid>
            <InputBase
            type={'password'}
            classes={{
               root: classes.bootstrapRoot,
               input: classes.bootstrapInput,
            }}
            name="passLoadWallet"
            onChange={e => change(e)}
            />
            <Button onClick={confirmLoadWallet} style={{backgroundColor:'black', color:'white', marginTop:15}} variant="contained">Continue</Button>
      </Grid>
    )
}
  

export default withStyles(styles, { withTheme: true })(LoadWallet)
