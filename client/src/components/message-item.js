import React, { Component } from 'react';
import moment from 'moment';
import { Chip, Grid, Avatar, Tooltip } from '@material-ui/core';

export default class MessageItem extends Component {
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
		const { item, classes, index, isCurrentUser } = this.props;

		return isCurrentUser ? (
			<Grid
				className={classes.messageItem}
				key={index}
				direction="column"
				container
				justify="flex-end"
				alignItems="flex-end"
				onClick={() => this.toggleCreatedText()}>
				<Chip label={item.body} color="primary" />
				<span style={{ fontSize: '0.75rem', color: 'grey' }}>
					{toggleCreatedAtText
						? `${moment(item.createdAt).format('LLLL')}`
						: ''}
				</span>
			</Grid>
		) : (
			<Grid key={index} direction="column" container>
				<Grid
					direction="row"
					container
          onClick={() => this.toggleCreatedText()}>
					<Tooltip
						title={`${item.author.profile.firstName} ${item.author.profile.lastName}`}>
						<Avatar>
							{`${item.author.profile.firstName.substring(0,1)} ${item.author.profile.lastName.substring(0, 1)}`}
						</Avatar>
					</Tooltip>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<Chip label={item.body} />
					</div>
				</Grid>
				<span style={{ fontSize: '0.75rem', color: 'grey' }}>
					{toggleCreatedAtText ? `${moment(item.createdAt).format('LLLL')}` : ''}
				</span>
			</Grid>
		);
	}
}
