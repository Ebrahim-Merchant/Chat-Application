
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import InputBase from '@material-ui/core/InputBase';


import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    stickToBottom: {
        position: 'fixed',
        bottom: 0,
    },
    stickToRight: {
        position: 'fixed',
        right: 0,
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
});

class ChatForm extends Component {



    render() {
        const { classes } = this.props
        return (
            <Grid style={{ width: "100%" }} className={classes.stickToBottom} container>
                <InputBase className={classes.input} placeholder="Message" />
                <IconButton className={classes.iconButton + " " + classes.stickToRight} aria-label="Send">
                    <SendIcon />
                </IconButton>

            </Grid>


        );
    }
}



export default withStyles(styles)(ChatForm);