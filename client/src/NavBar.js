import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

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
      }
});

class NavBar extends Component {
    


    render() {
        const { classes, selectedUser } = this.props;
        var firstName, lastName;
        if(selectedUser.profile == undefined){
            firstName = "Please Select a User"
            lastName = ""
        }
        else{
            firstName = selectedUser.profile.firstName
            lastName = selectedUser.profile.lastName;
        }

        return (
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={this.handleDrawerToggle}
                        className={classes.menuButton} >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" noWrap>
                        {firstName+" "+lastName}
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }
}


NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedUser: PropTypes.object.isRequired
};

export default withStyles(styles)(NavBar);