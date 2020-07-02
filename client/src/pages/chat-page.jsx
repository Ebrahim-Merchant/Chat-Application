import React, { Component } from 'react';
import SideNav from '../sections/sidenav';
import NavBar from '../sections/navbar';
import ChatContent from '../sections/chat-content';
import { withStyles } from '@material-ui/core/styles';
import { selectedCurrentUser } from 'shared/observables/selected-user';
import { getUserProfile } from 'shared/api';
import { withRouter } from 'react-router';
import { messageReceived } from 'shared/socket';
import { newMessage } from 'shared/observables/new-message';
import { AuthGaurd } from 'shared/authentication';

const styles = () => ({
  root: {
    display: 'flex',
  },
});

class ChatPage extends Component {
  constructor(props) {
    super(props);
    this.handleSelectedUser = this.handleSelectedUser.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    messageReceived((message) => newMessage.setData(message));
  }

  state = {
    conversationId: null,
    selectedUser: {},
    userId: null,
    currentUser: {},
    mobileOpen: false,
  };

  handleDrawerToggle(value) {
    const { mobileOpen } = this.state;
    this.setState({ mobileOpen: !mobileOpen });
  }

  handleSelectedUser(item) {
    const { currentUser } = this.state;
    const selectedUserId = Object.keys(item.participants).find(
      (user) => user !== currentUser._id
    );
    selectedCurrentUser.setData(currentUser);
    this.setState({
      conversationId: item.conversationId,
      selectedUser: item.participants[selectedUserId],
    });
  }

  componentDidMount() {
      console.log(AuthGaurd.isUserAuthenticated());
      if (AuthGaurd.isUserAuthenticated()) {
        getUserProfile(AuthGaurd.getUserId()).then((currentUser) => {
          selectedCurrentUser.setData(currentUser);
          this.setState({ currentUser });
        });
      } else {
        this.props.history.push('/login')
      }

  }

  render() {
    const { classes, history } = this.props;
    const { currentUser, mobileOpen, selectedUser } = this.state;
    let chatContent = <span></span>;
    if (Object.keys(selectedUser).length > 0) {
      chatContent = (
        <ChatContent
          currentUser={ currentUser }
          conversationId={ this.state.conversationId }></ChatContent>
      );
    }
    return (
      <div className={ classes.root }>
        <NavBar
          handleDrawerToggle={ this.handleDrawerToggle }
          selectedUser={ this.state.selectedUser }></NavBar>
        <SideNav
          history={history}
          mobileOpen={ mobileOpen }
          handleDrawerToggle={ this.handleDrawerToggle }
          conversationSelected={ this.handleSelectedUser }></SideNav>
        { chatContent }
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(ChatPage));
