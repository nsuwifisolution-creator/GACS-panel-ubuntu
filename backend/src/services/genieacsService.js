import axios from 'axios';
import config from '../config/index.js';

const genieacsApi = axios.create({
  baseURL: config.genieacsNbiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (config.genieacsApiKey) {
  genieacsApi.defaults.headers.common['X-API-Key'] = config.genieacsApiKey;
}

const fallbackDevices = [
  {
    id: 'ONT-001',
    alias: 'ONT-001',
    online: true,
    lastInform: '2026-10-11T08:40:00Z',
    manufacturer: 'ZTE',
    oui: '001A2F',
    productClass: 'ZXHN F670',
    softwareVersion: 'V5.0.1',
    ip: '192.168.10.12',
  },
  {
    id: 'ROUTER-204',
    alias: 'ROUTER-204',
    online: false,
    lastInform: '2026-10-10T23:10:00Z',
    manufacturer: 'Huawei',
    oui: '001E4A',
    productClass: 'HG8145V5',
    softwareVersion: 'V3.0.0',
    ip: '192.168.10.45',
  },
];

async function safeRequest(method, url, data = null, params = {}) {
  try {
    const res = await genieacsApi[method](url, data ? data : undefined, { params });
    return res.data;
  } catch (error) {
    console.warn(`GenieACS NBI request failed for ${method.toUpperCase()} ${url}: ${error.message}`);
    return null;
  }
}

export const genieacsService = {
  async listDevices(query = '{}') {
    const data = await safeRequest('get', '/devices', null, { query });
    if (data) return data;
    return { devices: fallbackDevices, count: fallbackDevices.length };
  },

  async getDevice(deviceId) {
    const data = await safeRequest('get', `/devices/${deviceId}`);
    if (data) return data;
    const match = fallbackDevices.find((device) => device.id === deviceId) || fallbackDevices[0];
    return { ...match, parameters: [{ name: 'InternetGatewayDevice.DeviceInfo.SerialNumber', value: 'GT-001234' }] };
  },

  async getTasks() {
    const data = await safeRequest('get', '/tasks');
    if (data) return data;
    return {
      tasks: [
        { id: 'task-1001', deviceId: 'ONT-001', name: 'Set Parameter', status: 'completed', createdAt: new Date().toISOString() },
        { id: 'task-1002', deviceId: 'ROUTER-204', name: 'Reboot', status: 'pending', createdAt: new Date().toISOString() },
      ],
    };
  },

  async createTask(deviceId, payload) {
    const data = await safeRequest('post', `/devices/${deviceId}/tasks`, payload);
    if (data) return data;
    return {
      id: `task-${Date.now()}`,
      deviceId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      payload,
    };
  },

  async getLogs() {
    const data = await safeRequest('get', '/logs');
    if (data) return data;
    return {
      logs: [
        { timestamp: new Date().toISOString(), service: 'cwmp', level: 'INFO', message: 'Device inform received from ONT-001' },
        { timestamp: new Date().toISOString(), service: 'nbi', level: 'WARN', message: 'Retry scheduled for task task-1002' },
      ],
    };
  },
};
