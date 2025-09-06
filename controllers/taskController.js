import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  const { projectId, title, description, assigneeId, dueDate } = req.body;
  if (!projectId || !title) return res.status(400).json({ message: 'Missing fields' });
  const task = await Task.create({ projectId, title, description, assigneeId, dueDate });
  res.status(201).json(task);
};

export const getTasksByProject = async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.projectId }).populate('assigneeId','name email avatar');
  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
