import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import deviceRoutes from './routes/devices.js';
import taskRoutes from './routes/tasks.js';
import logRoutes from './routes/logs.js';
import systemRoutes from './routes/system.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRequired } from './middleware/auth.js';
import config from './config/index.js';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('combined'));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'genieacs-panel-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api', authRequired, deviceRoutes);
app.use('/api', authRequired, taskRoutes);
app.use('/api', authRequired, logRoutes);
app.use('/api', authRequired, systemRoutes);

app.use(errorHandler);

const PORT = config.port || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`GenieACS Panel backend listening on http://0.0.0.0:${PORT}`);
});
