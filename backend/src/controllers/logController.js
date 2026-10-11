import { genieacsService } from '../services/genieacsService.js';

export async function getLogs(req, res) {
  const logs = await genieacsService.getLogs();
  res.json(logs);
}
