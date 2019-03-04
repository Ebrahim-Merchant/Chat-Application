import React, { Component } from 'react';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import SideNav from './SideNav.js';
import NavBar from './NavBar.js';
import ChatContent from './ChatContent';
import { withStyles } from '@material-ui/core/styles';




const styles = theme => ({
  root: {
    display: 'flex',
  }
})


class App extends Component {

  constructor(props) {
    super(props);
    this.handleSelectedUser = this.handleSelectedUser.bind(this)
  }

  state = {
    conversationId: null,
    selectedUser: {},
    userId : null
  }

  handleSelectedUser(item) {
    this.setState({
      conversationId: item.conversationId,
      selectedUser: item.author
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <NavBar
          selectedUser={this.state.selectedUser}>
        </NavBar>
        <SideNav
          onConvoSelect={this.handleSelectedUser}>
        </SideNav>
        <ChatContent
          conversationId={this.state.conversationId}>
        </ChatContent>
      </div>
    );
  }
}

export default withStyles(styles)(App);