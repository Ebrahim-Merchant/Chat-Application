import React, { Component, ReactElement } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ChatForm from './chat-form';
import MessageItem from '../components/message-item';
import { getChatMessages, submitMessage } from 'shared/api';
import { updateMessage } from 'shared/observables/update-message';
import { sendMessage } from 'shared/socket';
import { newMessage } from 'shared/observables/new-message';

const drawerWidth = 300;

interface IState {
	conversationId?: string;
	conversation: any[];
	currentUser: any;
	error?: any;
}

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
		margin: '0.1rem 0',
	},
	fullWidth: {
		width: '100%',
	},
});

class ChatContent extends Component<any, IState> {
	messagesEndRef;
	newSub;
	/**
	 * State
	 *
	 * @type {IState}
	 * @memberof ChatContent
	 */
	state: IState = {
		conversationId: '',
		conversation: [],
		currentUser: {},
	};

	/**
	 * Creates an instance of ChatContent.
	 * @param {*} props
	 * @memberof ChatContent
	 */
	constructor(props) {
		super(props);
		this.sendMessage = this.sendMessage.bind(this);
	}

	/**
	 * Lifecycle hooks
	 *
	 * @memberof ChatContent
	 */
	componentDidMount() {
		this.newSub = newMessage.getData().subscribe((message) =>
			this.setState((state) => {
				const conversation = Object.assign([], state.conversation);
				conversation.push(message);
				return { conversation };
			})
		);

		const { conversationId, currentUser } = this.props;
		getChatMessages(conversationId)
			.then((conversation) => this.setState({ conversation }))
			.catch((error) => this.setState({ error }));
		this.setState({ conversationId, currentUser }, this.scrollToBottom);
	}

	/**
	 *
	 *
	 * @param {*} nextProps
	 * @memberof ChatContent
	 */
	componentWillReceiveProps(nextProps) {
		const { conversationId, currentUser } = nextProps;
		getChatMessages(conversationId)
			.then((conversation) => this.setState({ conversation }))
			.catch((error) => this.setState({ error }));
		this.setState({ conversationId, currentUser }, this.scrollToBottom);
	}

	componentWillUnmount() {
		this.newSub.unsubscribe();
	}

	/**
	 *
	 *
	 * @param {string} text
	 * @memberof ChatContent
	 */
	sendMessage(text: string) {
		const { conversationId, currentUser, conversation } = this.state;
		submitMessage(text, conversationId, currentUser, conversation).then(
			(conversation) => {
				sendMessage(conversation[conversation.length - 1]);
				updateMessage.setData(conversation[conversation.length - 1]);
				return this.setState({ conversation: conversation });
			}
		);
	}

	scrollToBottom = () => {
		setTimeout(
			() => this.messagesEndRef.scrollIntoView({ behavior: 'smooth' }),
			100
		);
	};

	render() {
		const { classes } = this.props;
		const { conversation, currentUser }: IState = this.state;
		const conversationData: ReactElement[] = [];

		conversation.forEach((conversationItem, index) => {
			const item = conversationItem;
			const currentId = item.author._id;
			const message = (
				<MessageItem
					key={index}
					item={item}
					classes={classes}
					isCurrentUser={currentUser._id === currentId}
				/>
			);
			conversationData.push(message);
		});

		return (
			<div className={classes.fullWidth}>
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
					className={classes.fullWidth}
					style={{ width: '100%' }}
					currentUser={currentUser}
					sendMessage={this.sendMessage}
				/>
				<div ref={(el) => (this.messagesEndRef = el)}></div>
			</div>
		);
	}
}

export default withStyles(styles)(ChatContent);
