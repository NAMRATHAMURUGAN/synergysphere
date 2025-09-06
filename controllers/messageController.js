import Message from '../models/Message.js';

export const createMessage = async (req, res) => {
  const { projectId, content } = req.body;
  if (!projectId || !content) return res.status(400).json({ message: 'Missing fields' });
  const msg = await Message.create({ projectId, senderId: req.user._id, content });
  res.status(201).json(msg);
};

export const getMessagesByProject = async (req, res) => {
  const msgs = await Message.find({ projectId: req.params.projectId }).populate('senderId','name email avatar');
  res.json(msgs);
};
