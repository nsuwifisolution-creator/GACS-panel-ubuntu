import { genieacsService } from '../services/genieacsService.js';

export async function listDevices(req, res) {
  const query = req.query.query || '{}';
  const devices = await genieacsService.listDevices(query);
  res.json(devices);
}

export async function getDevice(req, res) {
  const deviceData = await genieacsService.getDevice(req.params.id);
  res.json(deviceData);
}
