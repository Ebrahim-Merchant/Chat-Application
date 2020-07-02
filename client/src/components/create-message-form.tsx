import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CreateIcon from '@material-ui/icons/Create';
import Select from 'react-select';
import NoSsr from '@material-ui/core/NoSsr';

const mapToName = (resp) => {
	return resp.map((author) => ({
		label: ` ${author.profile.firstName} ${author.profile.lastName}`,
		value: author._id,
	}));
};

export class FormDialog extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			users: {},
			selectedUserId: null,
			message: null,
		};
	}

	componentWillReceiveProps(nextProps) {
		const { currentUserId } = nextProps;
		if (currentUserId) {
			this.loadUsersOptions(currentUserId);
		}
	}

	loadUsersOptions(currentUserId) {
		fetch(`/api/users/all/${currentUserId}`)
			.then((response) => response.json())
			.then((resp) => this.setState({ users: mapToName(resp.data) }));
	}

	createConversation = () => {
		const { selectedUserId, message } = this.state;
		const { currentUserId } = this.props;
		if (!selectedUserId || !selectedUserId || !message) return;
		fetch('/api/conversation/new', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				recipentId: selectedUserId,
				composedMessage: message,
				userId: currentUserId,
			}),
		})
			.then((resp) => resp.json())	
			.then((resp) => this.handleClose(resp.message));
	};

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = (item) => {
		this.props.newConversation(item);
		this.setState({ open: false });
	};

	render = () => {
		const { users, open } = this.state;

		return (
			<div>
				<CreateIcon
					onClick={this.handleClickOpen}>
					Open form dialog
				</CreateIcon>
				<Dialog
					fullWidth
					open={open}
					onClose={this.handleClose}
					aria-labelledby='form-dialog-title'>
					<DialogTitle id='form-dialog-title'>New Message</DialogTitle>
					<DialogContent>
						<NoSsr>
							<Select
								options={users}
								placeholder='Please select a user to send a message to'
								onChange={($e) => this.setState({ selectedUserId: $e.value })}
								isClearable
								isSearchable
							/>
						</NoSsr>
						<TextField
							fullWidth
							id='outlined-multiline-static'
							label='Enter the message'
							multiline
							rows='4'
							margin='normal'
							variant='outlined'
							onChange={($e) => this.setState({ message: $e.target.value })}
						/>{' '}
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color='primary'>
							Cancel
						</Button>
						<Button onClick={this.createConversation} color='primary'>
							New Conversation
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	};
}
