import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['To-Do', 'In Progress', 'Done'], default: 'To-Do' },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: Date
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
