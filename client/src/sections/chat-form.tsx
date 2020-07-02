import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';

const styles: any = () => ({
	stickToBottom: {
		position: 'fixed',
		bottom: 0,
	},
	stickToRight: {
		position: 'fixed',
		right: 0,
	},
	input: {
		marginLeft: 8,
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	inputContainer: {
		padding: '0.5rem',
		borderTop: '1px solid grey',
		width: '100%',
		backgroundColor: 'white'
	}
});

class ChatForm extends Component<any, any> {
	state = {
		currentText: '',
	};
	handleTextFieldChange(e) {
		this.setState({
			currentText: e.target.value,
		});
	}

	sendMessage(currentText) {
		if (currentText && currentText !== '') {
			this.props.sendMessage(currentText);
			this.setState({ currentText: '' });
		}
	}

	render() {
		const { currentText } = this.state;
		const { classes } = this.props;
		return (
			<Grid
				className={classes.stickToBottom + ' ' + classes.inputContainer}
				container>
				<InputBase
					value={currentText}
					className={classes.input}
					placeholder='Message'
					onChange={($e) => this.handleTextFieldChange($e)}
					onKeyDown={($event) =>
						$event.key === 'Enter' ? this.sendMessage(currentText) : ''
					}
				/>
				<IconButton
					onClick={() => this.sendMessage(currentText)}
					className={classes.iconButton + ' ' + classes.stickToRight}
					aria-label='Send'>
					<SendIcon />
				</IconButton>
			</Grid>
		);
	}
}

export default withStyles(styles)(ChatForm);
