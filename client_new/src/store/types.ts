export interface IAppState {
  messages: any[];
  conversations: IConversation[];
  user?: IUser;
  currentRecipient: IUser
  currentConversationId: string;
}

export interface IConversation {
  id: string;
  participants: string[]
}

export type id = string;

export interface IMessage {
  id: string,
  author: id;
  body: string;
  conversationId: id;
  createdAt: string;
  _id?: string;
}

export interface IUser {
  id: string,
  firstName: string,
  lastName: string
}