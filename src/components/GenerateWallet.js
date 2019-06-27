import React from 'react'
import { Grid, Button, Checkbox, Typography, InputBase} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import styles from '../styles'

const GenerateWallet = ({generateWallet, classes, handlePassCheck, boolPassWallet, change}) => {
    return(
      <Grid container style={{paddingTop:5}} justify="center" alignContent="center" alignItems="center" direction="column">
            <Grid container  justify="center" alignContent="center"  direction="row">
            <Checkbox color="default" value={boolPassWallet} onChange={handlePassCheck('boolPassGenerateWallet')} />
            <Typography style={{paddingTop:13}}>Password</Typography>
            </Grid>
            <InputBase
            type={'password'}
            classes={{
                root: classes.bootstrapRoot,
                input: classes.bootstrapInput,
              }}
            name="passGenerateWallet"
            onChange={e => change(e)}
            />
            <Button variant="contained" style={{backgroundColor:'black', color:'white', marginTop:15}} onClick={generateWallet}>Generate Wallet</Button> 
      </Grid>
    )
  }

  export default withStyles(styles, { withTheme: true })(GenerateWallet)




