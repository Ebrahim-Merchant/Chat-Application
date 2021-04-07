import React, { ReactElement } from 'react';
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
import { getUserConversations } from 'shared/api';
import { selectedCurrentUser } from 'shared/observables/selected-user';
import { updateMessage } from 'shared/observables/update-message';
import { tap } from 'rxjs/operators';
import { UtilsService } from 'shared/utils';
import { subscribe } from 'shared/socket';
import { newMessage } from 'shared/observables/new-message';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { AuthGaurd } from 'shared/authentication';

interface IState {
	mobileOpen: boolean;
	userConversations: any[];
	selectedConversation: any;
	currentUser: any;
}

interface IPropTypes {
	classes: any;
	container?: any;
	theme: any;
	conversationSelected: any;
	handleDrawerToggle: any;
	history: any;
}

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
	}
});

/**
 *
 *
 * @class SideNav
 * @extends {React.Component}
 */
class SideNav extends React.Component<IPropTypes, IState> {
	selectedUserSubscription;
	messageUpdateSub;
	newMessageSub;

	constructor(props) {
		super(props);
		this.handleListItem = this.handleListItem.bind(this);
		this.newConversation = this.newConversation.bind(this);
	}
	state = {
		mobileOpen: false,
		userConversations: [],
		selectedUsers: {},
		selectedConversation: null,
		currentUser: {},
	};


	componentDidMount() {
		this.selectedUserSubscription = selectedCurrentUser
			.getData()
			.pipe(tap((currentUser) => this.setState({ currentUser })))
			.subscribe();

		this.messageUpdateSub = updateMessage
			.getData()
			.subscribe((updatedMessage) => this.messageSend(updatedMessage));

		this.newMessageSub = newMessage.getData().subscribe((updatedMessage) => this.messageSend(updatedMessage, true));
	}

	getUserConversations(currentUser) {
		getUserConversations(currentUser._id).then((userConversations) => {
			this.setState({ userConversations })	})
		}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.currentUser !== this.state.currentUser) {
			this.getUserConversations(this.state.currentUser);
		}
	}

	componentWillReceiveProps(nextProps) {
		const { mobileOpen } = nextProps;
		this.setState({ mobileOpen });
	}

	componentWillUnmount() {
		this.selectedUserSubscription.unsubscribe();
		this.messageUpdateSub.unsubscribe();
	}

	handleListItem(item) {
		if(item.isNew) {
			item.isNew = false;
		}
		this.props.conversationSelected(item);
		this.setState({ selectedConversation: item.conversationId });
	}

	newConversation(item) {
		this.getUserConversations(this.state.currentUser);
	}

	messageSend(updatedConversation, isNew = false) {
		let { userConversations } = this.state;
		userConversations = this.updateMessage(
			userConversations,
			updatedConversation,
			isNew
		);
		this.setState({ userConversations });
	}

	updateMessage(userConversations, updatedConversation, isNew) {
		return userConversations.map((conversation) => {
			if (conversation.conversationId === updatedConversation.conversationId) {
				conversation.body = updatedConversation.body;
				conversation.author = updatedConversation.author._id;
				conversation.isNew = isNew && conversation.conversationId !== this.state.selectedConversation
			}
			return conversation;
		});
	}

	getUser(
		currentId: string,
		item,
		classes,
		selectedConversation
	): ReactElement {
		let otherUser = Object.keys(item.participants).find(
			(user) => user !== currentId
		);
		otherUser = otherUser ? otherUser : '';
		const userProfile = item.participants[otherUser].profile;
		const initials = UtilsService.getInitials(userProfile);
		const userName = `${userProfile.firstName} ${userProfile.lastName}`;
		return (
			<ListItem
				button
				className={
					item.conversationId === selectedConversation && selectedConversation
						? classes.selected
						: ''
				}
				key={item.conversationId}
				onClick={() => this.handleListItem(item)}>
				<Avatar className={classes.purpleAvatar}>{initials}</Avatar>
				{ !item.isNew ? 
				<ListItemText
					primary={userName}
					secondary={
						item.author === currentId ? 'You: ' + item.body : item.body
					}
				/> : 
				<ListItemText
					primary={<Typography variant="subtitle1" style={{fontWeight: 'bolder'}}>{userName}</Typography>}
					secondary={
						<Typography variant="subtitle2" style={{fontWeight: 'bolder'}}>
							{item.author === currentId ? 'You: ' + item.body : item.body}
						</Typography>
						
					}
				/> }
				
			</ListItem>
		);
	}
	render() {
		const { classes, theme, history } = this.props;
		const {
			userConversations,
			selectedConversation,
			currentUser,
			mobileOpen,
		}: IState = this.state;
		const value = userConversations?.map((item) => {
			subscribe(item.conversationId);
			return this.getUser(currentUser._id, item, classes, selectedConversation)
		});

		const drawer = (
			<div>
				<Grid container style={{ padding: '1rem' }}>
					<ExitToAppIcon onClick={() =>{ history.push("/login"); AuthGaurd.signout()}}></ExitToAppIcon>
					<Typography variant='h5' gutterBottom style={{ margin: 'auto' }}>
						Messages
					</Typography>
					<FormDialog currentUserId={currentUser._id} newConversation={this.newConversation}/>
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
							open={mobileOpen}
							onClose={this.props.handleDrawerToggle}
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

export default withStyles(styles, { withTheme: true })(SideNav);
