import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import NavBar from './NavBar.js';

const drawerWidth = 300;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
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

class SideNav extends React.Component {
    constructor(props){
        super(props);
        this.handleListItem = this.handleListItem.bind(this);
    }
    state = {
        mobileOpen: false,
        userConversations: [],
        selectedUsers: {},
        selectedConversation: null
    };

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen}));
    };

    componentDidMount() {
        fetch('/api/conversations/5be718211664ce163cc8d0f8')
            .then(response => response.json())
            .then((data) => {
                this.setState({ userConversations: data.conversations })
            })
    }

    handleListItem(item){
        this.props.onConvoSelect(item)
        this.setState({selectedUsers: item.author});
    }



    render() {
        const { classes, theme } = this.props;
        const { userConversations } = this.state;
        const value = userConversations.map((item, i) =>
            <ListItem button key={item[i].conversationId} onClick={() => this.handleListItem(item[i])}>
                    <Avatar className={classes.purpleAvatar}>EM</Avatar>
                        <ListItemText primary={item[i].author.profile.firstName+" "+item[i].author.profile.lastName} secondary={item[i].body} />
            </ListItem>

        );



        const drawer = (
            <div>
                <div className={classes.toolbar} />
                <Grid container justify="center">
                    <Typography variant="h5" gutterBottom>Messages</Typography>
                </Grid>
                <Divider />
                <List>
                    {value}
                </List>
            </div >
        );

        return (
            <div>

            <nav className={classes.drawer} >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                < Hidden smUp implementation="css" >
                    <Drawer
                        container={this.props.container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={this.state.mobileOpen}
                        onClose={this.handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav >
            </div>
        );
    }
}

SideNav.propTypes = {
    classes: PropTypes.object.isRequired,
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SideNav);