import React, {Fragment} from 'react'
import { Grid, Button, CircularProgress, Typography, Divider, InputBase, FormControl, InputLabel} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import styles from '../styles'

const ConfirmTxModal = ({state, confirmTransferCrypto, change, classes}) => {
    return(
            <Grid container direction="column">
                    <Typography variant="overline" style={{fontSize:9,lineHeight:1.5}}>Receiver Address</Typography>
                    <Typography >{state.arReceiverAddress}</Typography>
                    <Typography variant="overline" style={{fontSize:9,lineHeight:1.5}}>Value</Typography>
                    <Typography>{state.arValue}</Typography>
                    <Typography variant="overline" style={{fontSize:9,lineHeight:1.5}}>Fee</Typography>
                    <Typography>{state.txFee}</Typography>
                    <Typography variant="overline" style={{fontSize:9,lineHeight:1.5}}>Total of Transaction</Typography>
                    <Typography>{state.totalTransfer}</Typography>
                    <Divider variant="middle" />
                    {(state.newBalance>0) ? 
                    <Grid container justify="center" alignItems="center" alignContent="center" direction="column" style={{padding:15}}>
                    <Typography align="center" style={{fontSize:10,color:'grey'}}>New Balance: {state.newBalance}</Typography>
                    {state.txRunning ? 
                    <CircularProgress/>
                      :
                    <Fragment>
                    {state.cryptoWallet &&  
                     <div style={{padding:10}}>   
                     <FormControl>
                          <InputLabel focused={false} className={classes.bootstrapFormLabel} shrink htmlFor="cryptoTxPass">
                     Password
                   </InputLabel>
                     <InputBase
                         id="cryptoTxPass" type={'password'} name="cryptoTxPass" onChange={e => change(e)}
                         classes={{
                            root: classes.bootstrapRoot,
                            input: classes.bootstrapInput,
                         }}                      
                     />
                     </FormControl>
                     </div>
                }
                    <Button onClick={confirmTransferCrypto} variant="contained">Confirm Transaction</Button>
                    </Fragment>
                    }
                    </Grid>
                    :
                    <Typography align="center" style={{color:'red', paddingTop:15}}>Insufficient Funds</Typography>
                    }
            </Grid>

    )
}

export default withStyles(styles, { withTheme: true })(ConfirmTxModal)
