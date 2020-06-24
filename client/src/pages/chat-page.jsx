import React, { Component } from 'react';
import SideNav from '../sections/sidenav';
import NavBar from '../sections/navbar';
import ChatContent from '../sections/chat-content';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    display: 'flex',
  }
})

class ChatPage extends Component {

  constructor(props) {
    super(props);
    this.handleSelectedUser = this.handleSelectedUser.bind(this)
  }

  state = {
    conversationId: null,
    selectedUser: {},
    userId : null,
    currentUser: {}
  }

  handleSelectedUser(item) {
    this.setState({
      conversationId: item.conversationId,
      selectedUser: item.author
    })
  }

  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let id = params.get('id');
    if(id) {
      fetch(`/api/users/${id}`)
      .then((response) => response.json())
      .then((data) => this.setState({ currentUser: data.userProfile }))
    } else {
      fetch('/api/users/5eefa5924d87c52921451ec0')
    .then((response) => response.json())
    .then((data) => this.setState({ currentUser: data.userProfile })) 
    }
    
  }

  render() {
    const { classes } = this.props;
    const { currentUser } = this.state;
    return (
      <div className={classes.root}>
        <NavBar
          selectedUser={this.state.selectedUser}>
        </NavBar>
        <SideNav
          currentUser = {currentUser}
          onConvoSelect={this.handleSelectedUser}>
        </SideNav>
        <ChatContent
          currentUser = {currentUser}
          conversationId={this.state.conversationId}>
        </ChatContent>
      </div>
    );
  }
}

export default withStyles(styles)(ChatPage);