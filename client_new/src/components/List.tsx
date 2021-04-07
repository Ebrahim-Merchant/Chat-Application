import { List, Avatar } from 'antd';
import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { getInitials, getUsername } from '../services/utils';
import { setCurrentRecipient } from '../store/action';
import { getMessages } from '../store/actionCreator';
import { IConversation, IUser } from '../store/types';
import './List.css';

interface Props {
	conversations: IConversation[];
}

const MessageList = ({ conversations }: Props): ReactElement => {
	const dispatch = useDispatch();
	let selectedUserId = '';
	return (
		<List
			itemLayout='horizontal'
			dataSource={conversations}
			renderItem={(item: any) => (
				<List.Item
					onClick={() => {
						selectedUserId = item.recipientId;
						dispatch([
							setCurrentRecipient({
								...getUser(item.participants[item.recipientId]),
								conversationId: item.conversationId
							}),
							getMessages(item.conversationId)
            ]);
					}}
					className={
						`list-item ${(selectedUserId === item.recipientId ? 'selected' : 'unselected')}`
					}>
					<List.Item.Meta
						avatar={
							<Avatar>
								{getInitials(item.participants[item.recipientId].profile)}
							</Avatar> 
						}
						title={getUsername(item.participants[item.recipientId].profile)}
						description={item.body}
					/>
				</List.Item>
			)}
		/>
	);
};

const getUser = (user: any): IUser => {
	return {
		...user.profile,
		id: user._id,
	};
};
export default MessageList;
