import Layout from 'antd/lib/layout/layout';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import ChatContent from '../components/ChatContent';
import AppHeader from '../components/Header';
import SendMessageForm from '../components/SendMessageForm';
import Sidebar from '../components/Sidebar';
import { getConversations } from '../store/actionCreator';
import { IAppState } from '../store/types';

const ChatPage = ({ getConversations, conversations, userId }: any) => {
	useEffect(() => {
		getConversations(userId);
	}, [getConversations, userId]);

	return (
		<Layout style={{height: '100vh'}}>
			<Sidebar menuItems={conversations}></Sidebar>{' '}
			<Layout className='site-layout' style={{ marginLeft: 300 }}>
				<AppHeader></AppHeader>
        <ChatContent></ChatContent>
				{/* <Footer style={{ textAlign: 'center' }}>
					Ant Design ©2018 Created by Ant UED
				</Footer> */}
				      <SendMessageForm></SendMessageForm>
			</Layout>
		</Layout>
	);
};

const mapStateToProps = (state: IAppState) => ({
	conversations: state.conversations,
	userId: state.user?.id,
});

const mapDispatchToProps = (dispatch: any) => ({
	getConversations: (id: string) => dispatch(getConversations(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);
