import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createProject, getProjectsForUser, getProjectById, addMember, removeMember, deleteProject
} from '../controllers/projectController.js';

const router = express.Router();
router.use(protect);

router.get('/', getProjectsForUser);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.post('/:id/members', addMember);
router.delete('/:id/members/:memberId', removeMember);
router.delete('/:id', deleteProject);

export default router;
