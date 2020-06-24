import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = (theme) => ({
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
});

class ChatForm extends Component {
	state = {
		currentText: '',
	};

	propTypes = {
    classes: PropTypes.object.isRequired,
    submitComment: PropTypes.func.isRequired
};

	handleTextFieldChange(e) {
		this.setState({
			currentText: e.target.value,
		});
	}

	submitComment(currentText) {
		if (currentText && currentText !== '') {
			this.props.submitComment(currentText);
			this.setState({ currentText: '' });
		}
	}

	render() {
		const { currentText } = this.state;
		const { classes } = this.props;
		return (
			<Grid
				style={{
					width: '100%',
					backgroundColor: 'white',
					boxShadow: '0px -5px 8px #888888',
				}}
				className={classes.stickToBottom}
				container>
				<InputBase
					value={currentText}
					className={classes.input}
					placeholder='Message'
					onChange={($e) => this.handleTextFieldChange($e)}
					onKeyDown={($event) =>
						$event.key === 'Enter' ? this.submitComment(currentText) : ''
					}
				/>
				<IconButton
					onClick={() => this.submitComment(currentText)}
					className={classes.iconButton + ' ' + classes.stickToRight}
					aria-label='Send'>
					<SendIcon />
				</IconButton>
			</Grid>
		);
	}
}

export default withStyles(styles)(ChatForm);
