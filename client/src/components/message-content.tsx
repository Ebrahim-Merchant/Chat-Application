import React, { Component } from 'react'
import { withStyles, Theme } from '@material-ui/core';

const styles = (theme: Theme) => ({
  colorPrimary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  chipContainer: {
    borderRadius: '15px',
    padding: '0.4rem',
    fontSize: '0.9rem'
  },
  defaultColor: {
    color: '#000000de',
    backgroundColor: '#e0e0e0'
  }
})

class MessageContent extends Component<any, any> {

  render() {
    const { label, classes, primary } = this.props;
    return (
      <div className={`${primary ? classes.colorPrimary: classes.defaultColor} ${classes.chipContainer}`}>
        {label}
      </div>
    )
  }
}

export default withStyles(styles)(MessageContent);
