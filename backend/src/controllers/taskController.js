import { genieacsService } from '../services/genieacsService.js';

export async function listTasks(req, res) {
  const tasks = await genieacsService.getTasks();
  res.json(tasks);
}

export async function createTask(req, res) {
  const { deviceId, payload } = req.body;
  if (!deviceId || !payload) {
    return res.status(400).json({ error: 'deviceId and payload are required' });
  }

  const created = await genieacsService.createTask(deviceId, payload);
  res.status(201).json(created);
}
