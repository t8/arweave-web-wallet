import React from 'react'
import { Grid, Button, Typography, InputBase} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import styles from '../styles'


const EncryptWallet = ({change, handleUpload, encryptWallet,passWallet, classes}) => {
    return(
      <Grid container direction="column" justify="center" alignContent="center" >
          <Typography align="center" style={{padding:5}} variant="body2">Upload you Arweave Wallet</Typography>
          <input style={{paddingBottom:15, maxWidth:350}} type="file" onChange={e => handleUpload(e, 'encryptWalletData')} />
          <Typography>Password:</Typography>
          <InputBase
                      type={'password'}
                      id="passEncryptWallet"
                      name="passEncryptWallet"
                      onChange={e => change(e)}
                      value={passWallet}
                      classes={{
                        root: classes.bootstrapRoot,
                        input: classes.bootstrapInput,
                      }}
                  
            />
            <Button style={{backgroundColor:'black', color:'white', marginTop:15}} variant="contained" onClick={encryptWallet}>Confirm Encryption</Button>
      </Grid>
    )
  }

  export default withStyles(styles, { withTheme: true })(EncryptWallet)
