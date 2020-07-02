import React, { Component } from 'react';
import moment from 'moment';
import { Grid, Avatar, Tooltip } from '@material-ui/core';
import { UtilsService } from 'shared/utils';
import MessageContent from './message-content';

export default class MessageItem extends Component<any, any> {
	state = {
		toggleCreatedAtText: false,
	};
  
  toggleCreatedText() {
    this.setState((state) => ({
      toggleCreatedAtText: !state.toggleCreatedAtText,
    }))
  }

	render() {
		const { toggleCreatedAtText } = this.state;
		const { item, classes, isCurrentUser } = this.props;

		return isCurrentUser ? (
			<Grid
				className={classes.messageItem}
				direction="column"
				container
				justify="flex-end"
				alignItems="flex-end"
				onClick={() => this.toggleCreatedText()}>
				{/* <Chip label={item.body} color="primary" /> */}
				<MessageContent primary={true} label={item.body}></MessageContent>
				<span style={{ fontSize: '0.75rem', color: 'grey' }}>
					{toggleCreatedAtText
						? `${moment(item.createdAt).format('LLLL')}`
						: ''}
				</span>
			</Grid>
		) : (
			<Grid 
			className={classes.messageItem}
			direction="column"container>
				<Grid
					direction="row"
					container
          onClick={() => this.toggleCreatedText()}>
					<Tooltip
						title={`${item.author.profile.firstName} ${item.author.profile.lastName}`}>
						<Avatar>
							{UtilsService.getInitials(item.author.profile)}
						</Avatar>
					</Tooltip>
					<div style={{ display: 'flex', flexDirection: 'column', marginLeft: '0.5rem' }}>
						<MessageContent label={item.body}></MessageContent>
					</div>
				</Grid>
				<span style={{ fontSize: '0.75rem', color: 'grey' }}>
					{toggleCreatedAtText ? `${moment(item.createdAt).format('LLLL')}` : ''}
				</span>
			</Grid>
		);
	}
}
