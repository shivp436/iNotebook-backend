import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string;
  userName: string;
  email: string;
  password: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    avatar: { type: String, default: 'https://www.gravatar.com/avatar/?d=mp' },
  },
  {
    timestamps: true,
  }
);

// 3. Create a Model.
const User = model<IUser>('User', userSchema);

export { User, IUser };
