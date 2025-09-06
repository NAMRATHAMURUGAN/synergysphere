import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';
import Notification from './models/Notification.js';

dotenv.config();
const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  console.error('Please set MONGO_URI in .env');
  process.exit(1);
}

await mongoose.connect(MONGO);

await User.deleteMany({});
await Project.deleteMany({});
await Task.deleteMany({});
await Notification.deleteMany({});

const pass = await bcrypt.hash('123456', 10);

const alice = await User.create({ name: 'Alice', email: 'alice@test.com', password: pass });
const bob = await User.create({ name: 'Bob', email: 'bob@test.com', password: pass });
const carol = await User.create({ name: 'Carol', email: 'carol@test.com', password: pass });

const project = await Project.create({
  title: 'Demo Project',
  description: 'This is a demo project seeded for SynergySphere.',
  createdBy: alice._id,
  members: [alice._id, bob._id, carol._id]
});

await Task.create([
  { projectId: project._id, title: 'Design Homepage', description: 'Create wireframes', status: 'To-Do', assigneeId: alice._id },
  { projectId: project._id, title: 'API: Auth', description: 'Implement login/register', status: 'In Progress', assigneeId: bob._id },
  { projectId: project._id, title: 'Deployment', description: 'Deploy to cloud', status: 'To-Do', assigneeId: carol._id }
]);

await Notification.create([
  { userId: alice._id, message: 'Welcome to SynergySphere Alice', type: 'welcome' },
  { userId: bob._id, message: 'Welcome to SynergySphere Bob', type: 'welcome' }
]);

console.log('✅ Seed complete. Users: alice@test.com, bob@test.com, carol@test.com (password 123456)');
process.exit(0);
