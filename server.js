import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173' }
});

io.on('connection', socket => {
  console.log('Socket connected:', socket.id);
  socket.on('joinProject', projectId => socket.join(projectId));
  socket.on('sendMessage', msg => io.to(msg.projectId).emit('receiveMessage', msg));
  socket.on('taskUpdated', payload => io.to(payload.projectId).emit('taskUpdated', payload));
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('MongoDB connected');
    httpServer.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
