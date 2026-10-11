import { Router } from 'express';
import { listDevices, getDevice } from '../controllers/deviceController.js';

const router = Router();
router.get('/devices', listDevices);
router.get('/devices/:id', getDevice);

export default router;
