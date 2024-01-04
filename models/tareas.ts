import { Schema, Document, model } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface Task {
  title: string;
  description: string;
  assignedTo: ObjectId;
  dueDate: Date;
  completed: boolean;
}

export type TaskDocument = Task & Document<any, any, Task>;

const TaskSchema = new Schema<TaskDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<TaskDocument>('Task', TaskSchema);

