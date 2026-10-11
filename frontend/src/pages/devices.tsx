import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shell } from '@/components/layout/shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';
import { EmptyState } from '@/components/ui/empty-state';
import { Search, Plus, Download, Upload, Edit, Trash2, Eye, Database, ChevronDown } from 'lucide-react';
import { Device } from '@/types';

const sampleDevices: Device[] = [
  {
    id: 'ONT-001',
    alias: 'ONT-Subscriber-001',
    manufacturer: 'ZTE',
    oui: '001A2F',
    productClass: 'ZXHN F670',
    softwareVersion: 'V5.0.1',
    ip: '192.168.10.12',
    online: true,
    lastInform: '2024-10-11T08:45:30Z',
  },
  {
    id: 'ONT-002',
    alias: 'ONT-Subscriber-002',
    manufacturer: 'Huawei',
    oui: '001E4A',
    productClass: 'HG8145V5',
    softwareVersion: 'V3.0.0',
    ip: '192.168.10.45',
    online: true,
    lastInform: '2024-10-11T08:40:00Z',
  },
  {
    id: 'ROUTER-001',
    alias: 'ROUTER-Office-001',
    manufacturer: 'Cisco',
    oui: '0017C2',
    productClass: 'ISR4331',
    softwareVersion: 'V16.9.4',
    ip: '192.168.10.1',
    online: false,
    lastInform: '2024-10-10T23:10:00Z',
  },
  {
    id: 'GATEWAY-001',
    alias: 'GW-Central-001',
    manufacturer: 'Nokia',
    oui: '00E04B',
    productClass: 'BTS3700',
    softwareVersion: 'V12.3.1',
    ip: '192.168.10.100',
    online: true,
    lastInform: '2024-10-11T08:50:00Z',
  },
  {
    id: 'ONT-003',
    alias: 'ONT-Subscriber-003',
    manufacturer: 'ZTE',
    oui: '001A2F',
    productClass: 'ZXHN H198N',
    softwareVersion: 'V2.1.0',
    ip: '192.168.10.23',
    online: true,
    lastInform: '2024-10-11T08:35:00Z',
  },
];

interface Filters {
  search: string;
  status: 'all' | 'online' | 'offline';
  manufacturer: 'all' | string;
}

interface SortConfig {
  key: keyof Device | null;
  direction: 'asc' | 'desc';
}

export function DevicesPage() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    manufacturer: 'all',
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 10;

  // Get unique manufacturers
  const manufacturers = Array.from(new Set(sampleDevices.map((d) => d.manufacturer)));

  // Filter devices
  const filteredDevices = useMemo(() => {
    return sampleDevices.filter((device) => {
      const matchesSearch =
        device.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        device.alias.toLowerCase().includes(filters.search.toLowerCase()) ||
        device.manufacturer.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === 'all' || (filters.status === 'online' ? device.online : !device.online);

      const matchesManufacturer =
        filters.manufacturer === 'all' || device.manufacturer === filters.manufacturer;

      return matchesSearch && matchesStatus && matchesManufacturer;
    });
  }, [filters]);

  // Sort devices
  const sortedDevices = useMemo(() => {
    const sorted = [...filteredDevices];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredDevices, sortConfig]);

  // Paginate devices
  const paginatedDevices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedDevices.slice(start, start + itemsPerPage);
  }, [sortedDevices, currentPage]);

  const totalPages = Math.ceil(sortedDevices.length / itemsPerPage);

  const handleSort = (key: keyof Device) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSelectAll = () => {
    if (selectedDevices.length === paginatedDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(paginatedDevices.map((d) => d.id));
    }
  };

  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId) ? prev.filter((id) => id !== deviceId) : [...prev, deviceId]
    );
  };

  const handleViewDetail = (device: Device) => {
    setSelectedDevice(device);
    setIsDetailOpen(true);
  };

  return (
    <Shell>
      <div className="container-main">
        <PageHeader
          title="Devices"
          description="Manage and monitor all connected CPE devices"
          action={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Device
            </Button>
          }
        />

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Device ID, alias, vendor..."
                  value={filters.search}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, search: e.target.value }));
                    setCurrentPage(1);
                  }}
                  prefix={<Search className="w-4 h-4" />}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, status: e.target.value as any }));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Manufacturer</label>
                <select
                  value={filters.manufacturer}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, manufacturer: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                >
                  <option value="all">All Manufacturers</option>
                  {manufacturers.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setFilters({ search: '', status: 'all', manufacturer: 'all' });
                    setCurrentPage(1);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedDevices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between"
          >
            <div className="text-sm font-medium">{selectedDevices.length} device(s) selected</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedDevices([])}>
                Clear
              </Button>
              <Button variant="destructive" size="sm">
                Delete Selected
              </Button>
            </div>
          </motion.div>
        )}

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : paginatedDevices.length === 0 ? (
              <EmptyState
                icon={<Database className="w-12 h-12" />}
                title="No devices found"
                description="Try adjusting your filters or add a new device."
                action={<Button>Add Device</Button>}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedDevices.length === paginatedDevices.length}
                          onChange={handleSelectAll}
                          className="rounded border-input"
                        />
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                        onClick={() => handleSort('id')}
                      >
                        Device ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Alias
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {paginatedDevices.map((device, idx) => (
                        <motion.tr
                          key={device.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedDevices.includes(device.id)}
                              onChange={() => handleSelectDevice(device.id)}
                              className="rounded border-input"
                            />
                          </td>
                          <td className="px-6 py-4 font-medium text-sm">{device.id}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{device.alias}</td>
                          <td className="px-6 py-4 text-sm">{device.manufacturer}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{device.productClass}</td>
                          <td className="px-6 py-4">
                            <Badge variant={device.online ? 'success' : 'destructive'}>
                              {device.online ? 'Online' : 'Offline'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{device.ip}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Tooltip content="View Details">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewDetail(device)}
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Tooltip>
                              <Tooltip content="Edit">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Tooltip>
                              <Tooltip content="Delete">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </Tooltip>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedDevices.length)} of{' '}
              {sortedDevices.length} devices
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Device Detail Sheet */}
      <AnimatePresence>
        {isDetailOpen && selectedDevice && (
          <DeviceDetailSheet device={selectedDevice} onClose={() => setIsDetailOpen(false)} />
        )}
      </AnimatePresence>
    </Shell>
  );
}

interface DeviceDetailSheetProps {
  device: Device;
  onClose: () => void;
}

function DeviceDetailSheet({ device, onClose }: DeviceDetailSheetProps) {
  const [activeTab, setActiveTab] = React.useState<'info' | 'parameters' | 'tasks'>('info');

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50"
      />
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-card border-l border-border shadow-lg overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 border-b border-border bg-card p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{device.id}</h2>
            <p className="text-sm text-muted-foreground">{device.alias}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border sticky top-16 bg-card">
          <div className="flex gap-0 px-6">
            {(['info', 'parameters', 'tasks'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase">Device Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Manufacturer</span>
                    <span className="text-sm font-medium">{device.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Product Class</span>
                    <span className="text-sm font-medium">{device.productClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">OUI</span>
                    <span className="text-sm font-mono font-medium">{device.oui}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Firmware Version</span>
                    <span className="text-sm font-medium">{device.softwareVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">IP Address</span>
                    <span className="text-sm font-mono font-medium">{device.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={device.online ? 'success' : 'destructive'}>
                      {device.online ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Inform</span>
                    <span className="text-sm font-medium">{new Date(device.lastInform).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button className="flex-1">Send Command</Button>
                <Button variant="outline" className="flex-1">
                  Run Task
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'parameters' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">No parameters available</p>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">No tasks found for this device</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
