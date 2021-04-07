import { IUser } from './user';
import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
	participants: IUser['_id'][];
}

// Schema defines how chat messages will be stored in MongoDB
const ConversationSchema: Schema<IConversation> = new Schema({
	participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model<IConversation>(
	'Conversation',
	ConversationSchema
);
