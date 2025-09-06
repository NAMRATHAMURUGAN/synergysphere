import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createTask, getTasksByProject, updateTask, deleteTask
} from '../controllers/taskController.js';

const router = express.Router();
router.use(protect);

router.post('/', createTask);
router.get('/project/:projectId', getTasksByProject);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
