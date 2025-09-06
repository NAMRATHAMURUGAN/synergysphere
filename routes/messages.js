import express from 'express';
import { protect } from '../middleware/auth.js';
import { createMessage, getMessagesByProject } from '../controllers/messageController.js';

const router = express.Router();
router.use(protect);

router.post('/', createMessage);
router.get('/project/:projectId', getMessagesByProject);

export default router;
