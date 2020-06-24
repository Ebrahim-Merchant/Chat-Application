import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ChatForm from './chat-form';
import MessageItem from '../components/message-item';

const drawerWidth = 300;

const styles = (theme) => ({
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
	messageItem: {
		margin: '0.05rem 0',
	},
});

class ChatContent extends Component {
	pollInterval = null;
	state = {
		conversationId: null,
		conversation: [],
		currentUser: {},
	};

	constructor(props) {
		super(props);
		this.submitComment = this.submitComment.bind(this);
	}
	componentDidMount() {
		const { conversationId, currentUser } = this.props;
		this.setState({ conversationId, currentUser });
		if (conversationId) {
			this.pollInterval = setInterval(
				this.loadMessagesFromServer(conversationId),
				2000
			);
		}
	}

	componentWillReceiveProps(nextProps) {
		this.props = nextProps;
		const { conversationId, currentUser } = this.props;
		this.setState({ conversationId, currentUser });
		if (conversationId) {
			console.log(this.pollInterval);
			this.pollInterval = setInterval(() => this.loadMessagesFromServer(conversationId), 2000);
		}
	}

	componentWillUnmount() {
		if (this.pollInterval) clearInterval(this.pollInterval);
		this.pollInterval = null;
	}

	loadMessagesFromServer = (conversationId) => {
		fetch(`/api/conversation/${conversationId}`)
			.then((data) => data.json())
			.then((res) => {
				if (!res.success) this.setState({ error: res.error });
				else {
					this.setState({ conversation: res.conversation });
				}
			});
	};

	submitComment = (text) => {
		const { currentUser, conversationId } = this.state;
		if (!currentUser || !text) return;
		fetch('/api/conversation', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ conversationId, author: currentUser, body: text }),
		}).then((res) => console.log(res.json()));
		// Todo add to conversation
	};

	render() {
		const { classes } = this.props;
		const { conversation, currentUser } = this.state;
		const conversationData = [];

		conversation.forEach((conversationItem, index) => {
			const item = conversationItem;
			const currentId = item.author._id;
			conversationData.push(
				<MessageItem
					item={item}
					index={index}
					classes={classes}
					isCurrentUser={currentUser._id === currentId}
				/>
			);
		});

		return (
			<div style={{ width: '100%' }}>
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<Grid
						direction='column'
						wrap='nowrap'
						container
						spacing={16}
						style={{ paddingBottom: '4rem' }}>
						{conversationData}
					</Grid>
				</main>
				<ChatForm
					style={{ width: '100%' }}
					currentUser={currentUser}
					submitComment={this.submitComment}
				/>
			</div>
		);
	}
}

export default withStyles(styles)(ChatContent);
