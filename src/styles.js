const styles = theme => ({
    bootstrapFormLabel: {
      fontSize: 18,
      '&:focus': {},
    },
    bootstrapRoot: {
      'label + &': {
        marginTop: theme.spacing.unit * 2.5,
      },
    },
    bootstrapInput: {
      borderRadius: 8,
      backgroundColor: '#cee9d1',
      border: '1px solid #ced4da',
      fontSize: 10,
      width: '300px',
      padding: '5px 6px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
    },
  })

  export default styles