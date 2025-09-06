import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, avatar });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = name ?? user.name;
    user.avatar = avatar ?? user.avatar;
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
