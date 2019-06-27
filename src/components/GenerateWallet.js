import React from 'react'
import { Grid, Button, Checkbox, Typography, InputBase} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import styles from '../styles'

const GenerateWallet = ({generateWallet, classes, handlePassCheck, boolPassWallet, change}) => {
    return(
      <Grid container style={{paddingTop:15}} justify="center" alignContent="center" direction="column">
        <Button variant="contained" style={{backgroundColor:'black', color:'white'}} onClick={generateWallet}>Generate Wallet</Button> 
        <Checkbox color="default" value={boolPassWallet} onChange={handlePassCheck('boolPassGenerateWallet')} />
            <Typography>Password</Typography>
            <InputBase
            classes={{
                root: classes.bootstrapRoot,
                input: classes.bootstrapInput,
              }}
            name="passGenerateWallet"
            onChange={e => change(e)}
            />
      </Grid>
    )
  }

  export default withStyles(styles, { withTheme: true })(GenerateWallet)




