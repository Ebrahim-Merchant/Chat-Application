
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';



import ChatForm from './ChatForm';
import { Tooltip } from '@material-ui/core';

const drawerWidth = 300;

const styles = theme => ({
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        }
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
});

class ChatContent extends Component {


    state = {
        conversationId: null,
        conversation: []
    }

    componentDidMount() {
        this.loadMessagesFromServer();
        const conversationId = this.props.conversationId;
        if (!this.pollInterval) {
            this.pollInterval = setInterval(this.loadMessagesFromServer(conversationId), 2000);
        }
    }


    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.loadMessagesFromServer();
        if (!this.pollInterval) {
            this.pollInterval = setInterval(this.loadMessagesFromServer, 2000);
        }


    }
    componentWillUnmount() {
        if (this.pollInterval) clearInterval(this.pollInterval);
        this.pollInterval = null;
    }

    loadMessagesFromServer = () => {
        var conversationId = this.props.conversationId
        console.log(conversationId)
        fetch(`/api/conversation/${conversationId}`)
            .then(data => data.json())
            .then((res) => {
                if (!res.success) this.setState({ error: res.error });
                else {
                    this.setState({ conversation: res.conversation });
                }
            });
    }
    

    submitComment = (e) => {
        e.preventDefault();
        const { author, text } = this.state;
        console.log(author+ " "+ text)
        if (!author || !text) return;
        fetch('/api/conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author, text }),
        }).then(res => res.json()).then((res) => {
          if (!res.success) this.setState({ error: res.error.message || res.error });
          else this.setState({ author: '', text: '', error: null });
        });
      }


    render() {
        const { classes } = this.props;
        var id = "5be718211664ce163cc8d0f8"
        const conversation = this.state.conversation;
        let conversationData = []
        for (var i = 0; i < conversation.length; i++) {
            var item = conversation[i];
            var currentId = item.author._id
            if (currentId == id) {
                conversationData.push(
                <Grid key={i} direction="row" container justify="flex-end" alignItems="flex-end">
                    <Tooltip title={item.createdAt}>
                    <Chip label={item.body} color="primary" />
                    </Tooltip>
                </Grid>)
            }
            else{
                conversationData.push(
                <Grid key={i} direction="row" container>
                <Tooltip title={item.author.profile.firstName + " " + item.author.profile.lastName}>
                    <Avatar>{item.author.profile.firstName.substring(0, 1) + "" + item.author.profile.lastName.substring(0, 1)}</Avatar>
                </Tooltip>
                <Chip label={item.body} />
            </Grid>)
            }
        }
        return (
            <div style={{ width: "100%" }}>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Grid direction="column"  wrap="nowrap" container spacing={16}>
                        {conversationData}
                    </Grid>

                </main>
                <ChatForm style={{ width: "100%" }}></ChatForm>
            </div>


        );
    }
}



export default withStyles(styles)(ChatContent);