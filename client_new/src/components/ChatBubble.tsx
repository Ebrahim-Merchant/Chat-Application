import { Tooltip } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';

const ChatBubble = ({ body, time, author, isCurrentUser, isPending }: any) => {

	return (
		<div>
			{author !== 'You' ? (
				<Tooltip title={author} placement='bottom'>
					<Avatar
						src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
						alt='Han Solo'
					/>
				</Tooltip>
			) : null}

			<Tooltip title={time} placement={isCurrentUser ? 'left' : 'right'}>
				<span
					style={{
						background: isCurrentUser ? ( isPending ? '#00609F' :'#0099ff') : '#e4e6ea',
            color: isCurrentUser ? 'white' : 'black',
						padding: '0.5rem',
						borderRadius: '15px',
					}}>
					{body}
				</span>
			</Tooltip>
		</div>
	);
};

export default ChatBubble;
