import React, { Fragment } from "react";
import { Grid, Button, FormControl, InputLabel, Divider, Typography, InputBase} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import styles from '../styles'

const WalletHome = ({state, change, classes,transferCrypto }) => {
    return(
        <Fragment>
        <Typography variant="overline">Address</Typography>
        <Typography variant="h6">{state.arwAddress}</Typography>

        <Typography variant="overline">Balance</Typography>
        <Typography style={{paddingBottom:10}} variant="h6">{state.arwBalance}</Typography>
        <Divider variant="middle" />
        <Grid container style={{padding:10}} justify="center" alignContent="center" direction="column">
        <Typography align="center" variant="h5">Crypto Sender</Typography>
        <div style={{padding:10}}>   
                 <FormControl>
                  <InputLabel
                    focused={false}
                    className={classes.bootstrapFormLabel}
                    shrink
                    htmlFor="arAddress"
                  >
                    Arweave Address
                  </InputLabel>
                  <InputBase
                    id="arAddress"
                    name="arReceiverAddress"
                    placeholder="Arweave Address"
                    onChange={e => change(e)}
                    value={state.arReceiverAddress}
                    classes={{
                      root: classes.bootstrapRoot,
                      input: classes.bootstrapInput,
                    }}
                  />
                </FormControl>
                </div>

                <div style={{padding:10}}>   
                <FormControl>
                  <InputLabel
                    focused={false}
                    className={classes.bootstrapFormLabel}
                    shrink
                    htmlFor="value"
                  >
                    Value
                  </InputLabel>
                  <InputBase
                    id="value"
                    name="arValue"
                    onChange={e => change(e)}
                    placeholder="Arweave Value"
                    value={state.arValue}
                    classes={{
                      root: classes.bootstrapRoot,
                      input: classes.bootstrapInput,
                    }}
                  />
                </FormControl>
                </div>
                {state.cryptoWallet &&  
                    <div style={{padding:10}}>   
                    <FormControl>
                         <InputLabel focused={false} className={classes.bootstrapFormLabel} shrink htmlFor="cryptoTxPassFirst">
                    Password
                  </InputLabel>
                    <InputBase
                        id="cryptoTxPassFirst" type={'password'} name="cryptoTxPass" onChange={e => change(e)}
                        classes={{
                           root: classes.bootstrapRoot,
                           input: classes.bootstrapInput,
                        }}                      
                    />
                    </FormControl>
                    </div>

                }
                <Button onClick={transferCrypto} align="center" style={{backgroundColor:'black', color:'white'}} variant="contained">TRANSFER AR</Button>
        </Grid>
        </Fragment>
    )
}

export default withStyles(styles, { withTheme: true })(WalletHome)
