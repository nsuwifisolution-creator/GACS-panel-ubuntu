import { genieacsService } from '../services/genieacsService.js';

export async function getDashboard(req, res) {
  const [devices, tasks, logs] = await Promise.all([
    genieacsService.listDevices(),
    genieacsService.getTasks(),
    genieacsService.getLogs(),
  ]);

  res.json({
    summary: {
      online: devices.devices.filter((device) => device.online).length,
      total: devices.devices.length,
      tasksPending: tasks.tasks.filter((task) => task.status === 'pending').length,
      tasksFailed: tasks.tasks.filter((task) => task.status === 'failed').length,
    },
    devices: devices.devices,
    tasks: tasks.tasks,
    logs: logs.logs,
  });
}
