import { getDashboard } from '../controllers/dashboardController.js';
import { loginUser } from '../controllers/authController.js';
import { listDevices, getDevice } from '../controllers/deviceController.js';
import { listTasks, createTask } from '../controllers/taskController.js';
import { getLogs } from '../controllers/logController.js';
import { Router } from 'express';

const router = Router();

router.post('/login', loginUser);

router.get('/dashboard', getDashboard);
router.get('/devices', listDevices);
router.get('/devices/:id', getDevice);
router.get('/tasks', listTasks);
router.post('/tasks', createTask);
router.get('/logs', getLogs);
router.get('/health', (req, res) => res.json({ ok: true }));

export default router;
