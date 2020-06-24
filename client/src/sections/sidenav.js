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
import { FormDialog } from '../components/create-message-form';

const drawerWidth = 300;

const styles = (theme) => ({
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
	selected: {
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
	},
});

class SideNav extends React.Component {
	constructor(props) {
		super(props);
		this.handleListItem = this.handleListItem.bind(this);
	}
	state = {
		mobileOpen: false,
		userConversations: [],
		selectedUsers: {},
		selectedConversation: null,
		currentUser: null
	};

	handleDrawerToggle = () => {
		this.setState((state) => ({ mobileOpen: !state.mobileOpen }));
	};

	componentWillReceiveProps(nextProps) {
		this.props = nextProps;
		const { currentUser } = this.props;
		if(currentUser) {
			fetch(`api/users/conversations/${currentUser._id}`)
			.then((response) => response.json())
			.then((data) => this.setState({ userConversations: data.conversations }));
		}
	}

	componentDidMount() {
		const { currentUser } = this.props;
		if(currentUser && currentUser._id) {
			fetch(`api/users/conversations/${currentUser._id}`)
			.then((response) => response.json())
			.then((data) => this.setState({ userConversations: data.conversations }));
		}
	
	}

	handleListItem(item) {
		this.props.onConvoSelect(item);
		this.setState({ selectedUsers: item.author });
	}

	getUser(currentId, item, classes, selectedUsers) {
		const otherUser = Object.keys(item.participants).find((user) => user !== currentId);
		const userProfile = item.participants[otherUser].profile;
		const initials = `${userProfile.firstName.substring(
			0,
			1
		)} ${userProfile.lastName.substring(0, 1)}`;
		const userName = `${userProfile.firstName} ${userProfile.lastName}`;
		return (
			<ListItem
				button
				className={
					item.author === selectedUsers && selectedUsers
						? classes.selected
						: ''
				}
				key={item.conversationId}
				onClick={() => this.handleListItem(item)}>
				<Avatar className={classes.purpleAvatar}>{initials}</Avatar>
				<ListItemText
					primary={userName}
					secondary={
						item.author === currentId ? 'You: ' + item.body : item.body
					}
				/>
			</ListItem>
		);
	}

	render() {
		const { classes, theme, currentUser } = this.props;
		const { userConversations, selectedUsers } = this.state;
		const value = userConversations.map((item) =>
			this.getUser(currentUser._id, item, classes, selectedUsers)
		);

		const drawer = (
			<div>
				<Grid container style={{ padding: '1rem' }}>
					<Typography variant='h5' gutterBottom style={{ margin: 'auto' }}>
						Messages
					</Typography>
					<FormDialog currentUserId={currentUser._id} />
				</Grid>
				<Divider />
				<List>{value}</List>
			</div>
		);

		return (
			<div>
				<nav className={classes.drawer}>
					{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
					<Hidden smUp implementation='css'>
						<Drawer
							container={this.props.container}
							variant='temporary'
							anchor={theme.direction === 'rtl' ? 'right' : 'left'}
							open={this.state.mobileOpen}
							onClose={this.handleDrawerToggle}
							classes={{
								paper: classes.drawerPaper,
							}}>
							{drawer}
						</Drawer>
					</Hidden>
					<Hidden xsDown implementation='css'>
						<Drawer
							classes={{
								paper: classes.drawerPaper,
							}}
							variant='permanent'
							open>
							{drawer}
						</Drawer>
					</Hidden>
				</nav>
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
