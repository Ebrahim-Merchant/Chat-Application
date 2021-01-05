import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  profile: {},
  profilePicture: string,
  email: string,
  password: string,
  resetPasswordToken?: string,
  resetPasswordExpires?: Date
};

const UserSchema: Schema = new Schema({
    profile:
    {  
        firstName: String, 
        lastName: String
    },
    profilePicture: String,
    email: {type: String, required: true},
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {timestamps: true});

export default mongoose.model<IUser>('User', UserSchema);