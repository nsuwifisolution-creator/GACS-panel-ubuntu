import { Router } from 'express';
import { listTasks, createTask } from '../controllers/taskController.js';

const router = Router();
router.get('/tasks', listTasks);
router.post('/tasks', createTask);

export default router;
