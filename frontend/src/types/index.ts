export interface User {
  id: string;
  username: string;
  role: 'admin' | 'operator' | 'viewer';
  email?: string;
  createdAt?: string;
}

export interface Device {
  id: string;
  alias: string;
  manufacturer: string;
  oui: string;
  productClass: string;
  softwareVersion: string;
  ip: string;
  online: boolean;
  lastInform: string;
  parameters?: Record<string, any>;
}

export interface Task {
  id: string;
  deviceId: string;
  name: string;
  type: 'get' | 'set' | 'reboot' | 'reset' | 'download';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  payload?: Record<string, any>;
  result?: Record<string, any>;
  createdAt: string;
  completedAt?: string;
  retries?: number;
}

export interface Preset {
  id: string;
  name: string;
  description?: string;
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Firmware {
  id: string;
  name: string;
  version: string;
  productClass: string;
  fileSize: number;
  url: string;
  checksum?: string;
  releaseNotes?: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  pendingTasks: number;
  failedTasks: number;
  lastUpdated: string;
}
