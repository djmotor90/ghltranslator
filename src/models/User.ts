import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  ghlId: string;
  accessToken: string;
  refreshToken?: string;
  name?: string;
  avatar?: string;
  language: 'en' | 'ru';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    ghlId: {
      type: String,
      required: true,
      unique: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    name: {
      type: String,
    },
    avatar: {
      type: String,
    },
    language: {
      type: String,
      enum: ['en', 'ru'],
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
