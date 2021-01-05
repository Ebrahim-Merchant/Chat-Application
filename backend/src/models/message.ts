import { IUser } from './user';
import { IConversation } from './conversation';
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: IConversation['_id'],
  body: string,
  author: IUser['_id']
}

const MessageSchema: Schema = new Schema({  
  conversationId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;