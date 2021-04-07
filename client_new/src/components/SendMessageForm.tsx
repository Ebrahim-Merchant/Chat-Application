import React, { ReactElement, useState } from 'react'
import { connect } from 'react-redux';
import { sendMessage } from '../store/actionCreator';
import { IAppState } from '../store/types';
import './SendMessageForm.css';
// interface Props {
//   any;
// }

const SendMessageForm = ({ placeholder, userId, conversationId, sendMessage}: any): ReactElement => {

  const [message, setMessage] = useState('')

  function submitMessage($event: React.FormEvent<HTMLFormElement>) {
    $event.preventDefault();
    // console.log({message, conversationId, userId})
    sendMessage(message, conversationId, userId);
  }

  return (
    <form className="bottom-message" onSubmit={(e) => submitMessage(e)}>
      <input type="text" value={message} onChange={$e => setMessage($e.target.value)} placeholder={placeholder}/>
    </form>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
	sendMessage: (message: string, conversationId: string, author: string) => dispatch(sendMessage({ message, conversationId, author})),
});

const mapStateToProps = ({ user, currentConversationId }: IAppState) => ({
	userId: user ? user.id: null,
  conversationId: currentConversationId
});
export default connect(mapStateToProps, mapDispatchToProps)(SendMessageForm);