import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  const notes = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(notes);
};

export const markRead = async (req, res) => {
  const note = await Notification.findById(req.params.id);
  if (!note) return res.status(404).json({ message: 'Not found' });
  note.read = true;
  await note.save();
  res.json(note);
};
