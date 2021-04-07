import { Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { getUsername } from '../services/utils';
import { IAppState } from '../store/types';
import ChatBubble from './ChatBubble';

interface CommentProps {
	authorName: string;
	body: string;
	time: string;
	isCurrentUser: boolean;
	isPending?: boolean;
}

const ChatItem = ({ authorName, body, time, isCurrentUser, isPending }: CommentProps) => {
	const momentTime = moment(time);
	momentTime.format('YYYY-MM-DD HH:mm:ss');
	return (
    <ChatBubble
      isCurrentUser={isCurrentUser}
			isPending={isPending}
    	author={isCurrentUser ? 'You' : authorName}
      body={body}
      time={momentTime.fromNow()}
    ></ChatBubble>
	);
};

const ChatContent = ({ messages, user, currentRecipient }: any) => {
	return (
		<Content style={{ margin: '24px 16px 36px', overflow: 'scroll' }}>
			{messages.map((message: any) => {
				const justify = message.author._id === user.id ? 'end' : 'start';
				return (
					<Row justify={justify} style={{ margin: '1rem' }}>
						<ChatItem
							isCurrentUser={message.author._id === user.id}
							authorName={
								getUsername(
									message.author._id === user.id ? user : currentRecipient
								) ?? ''
							}
							body={message.body}
							time={message.createdAt}
							isPending={message?.isPending ? message?.isPending : false}
						/>
					</Row>
				);
			})}
		</Content>
	);
};

const mapStateToProps = ({ messages, user, currentRecipient }: IAppState) => ({
	messages,
	user,
	currentRecipient,
});
export default connect(mapStateToProps)(ChatContent);
