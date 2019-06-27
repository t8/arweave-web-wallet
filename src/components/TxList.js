import React from 'react'
import { Grid, Paper, Typography } from '@material-ui/core'

const TxList = ({txList}) => {
    return(
      <Grid container justify="center" alignContent="center" alignItems="center" direction="column">
        <Typography align="center" variant="h6" style={{padding:10}}>Transaction Session List</Typography>
        {txList.length === 0 &&  <Typography>No transaction send on this session</Typography>}
      {txList.map(item => {
        return(
          <Paper style={{padding:10}}>
          <Typography variant="caption">TRANSACTION ID</Typography>
          <Typography>{item.txId}</Typography>
          <Typography style={{fontSize:10}}>To:{item.to}</Typography>
          <Grid container direction="row">
            <Typography style={{paddingRight:10,fontSize:10}}>Value: {item.value}</Typography>
            <Typography style={{fontSize:10}}>Fee: {item.reward}</Typography>
          </Grid>
          </Paper>
        )
      })}
      </Grid>
    )
  
  }

  export default TxList