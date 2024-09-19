import { Schema, model } from 'mongoose';
// import { User } from './User';

// 1. Create an interface representing a document in MongoDB.
interface INote {
  title: string;
  content: string;
  tags: string[];
  user: Schema.Types.ObjectId;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create a Schema corresponding to the document interface.
const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    content: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPinned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// 3. Create a Model.
const Note = model<INote>('Note', noteSchema);

export { Note, INote };
