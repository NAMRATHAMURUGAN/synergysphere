import Project from '../models/Project.js';
import User from '../models/User.js';

export const createProject = async (req, res) => {
  const { title, description, members } = req.body;
  if (!title) return res.status(400).json({ message: 'Title required' });
  const project = await Project.create({
    title, description, createdBy: req.user._id, members: [req.user._id, ...(members || [])]
  });
  res.status(201).json(project);
};

export const getProjectsForUser = async (req, res) => {
  const projects = await Project.find({ members: req.user._id }).populate('createdBy', 'name email');
  res.json(projects);
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('members', 'name email avatar');
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const addMember = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (!project.members.includes(user._id)) project.members.push(user._id);
  await project.save();
  res.json(project);
};

export const removeMember = async (req, res) => {
  const { memberId } = req.params;
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  project.members = project.members.filter(m => m.toString() !== memberId);
  await project.save();
  res.json(project);
};

export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
