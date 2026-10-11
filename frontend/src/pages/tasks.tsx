import React, { useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { PageHeader, StatsGrid, StatCard } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { Task } from '@/types';

const sampleTasks: Task[] = [
  {
    id: 'task-001',
    deviceId: 'ONT-001',
    name: 'Set Parameter',
    type: 'set',
    status: 'completed',
    createdAt: '2024-10-11T08:45:30Z',
    completedAt: '2024-10-11T08:46:00Z',
  },
  {
    id: 'task-002',
    deviceId: 'ONT-002',
    name: 'Configuration Sync',
    type: 'get',
    status: 'in_progress',
    createdAt: '2024-10-11T08:50:00Z',
  },
  {
    id: 'task-003',
    deviceId: 'ROUTER-001',
    name: 'Device Reboot',
    type: 'reboot',
    status: 'failed',
    createdAt: '2024-10-11T07:30:00Z',
    completedAt: '2024-10-11T07:31:00Z',
    retries: 2,
  },
  {
    id: 'task-004',
    deviceId: 'GATEWAY-001',
    name: 'Firmware Download',
    type: 'download',
    status: 'pending',
    createdAt: '2024-10-11T09:00:00Z',
  },
];

export function TasksPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'failed'>('all');

  const filteredTasks = sampleTasks.filter((task) => {
    const matchesSearch =
      task.id.includes(search) ||
      task.deviceId.includes(search) ||
      task.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || task.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: sampleTasks.length,
    pending: sampleTasks.filter((t) => t.status === 'pending').length,
    inProgress: sampleTasks.filter((t) => t.status === 'in_progress').length,
    completed: sampleTasks.filter((t) => t.status === 'completed').length,
    failed: sampleTasks.filter((t) => t.status === 'failed').length,
  };

  const statusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'default';
      case 'failed':
        return 'destructive';
    }
  };

  const statusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <Zap className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Shell>
      <div className="container-main">
        <PageHeader
          title="Tasks"
          description="Monitor and manage device configuration and maintenance tasks"
          action={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          }
        />

        <StatsGrid>
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={<Zap className="w-5 h-5" />}
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            change={`${((stats.pending / stats.total) * 100).toFixed(0)}%`}
            trend="down"
            icon={<Clock className="w-5 h-5" />}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Zap className="w-5 h-5" />}
          />
          <StatCard
            title="Failed"
            value={stats.failed}
            change={`${((stats.failed / stats.total) * 100).toFixed(0)}%`}
            trend="up"
            icon={<AlertCircle className="w-5 h-5" />}
          />
        </StatsGrid>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by task ID, device, or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'pending', 'in_progress', 'completed', 'failed'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(status)}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {statusIcon(task.status)}
                      <h3 className="font-semibold text-lg">{task.name}</h3>
                      <Badge variant={statusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Task ID</span>
                        <p className="font-mono text-xs mt-1">{task.id}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Device ID</span>
                        <p className="font-medium mt-1">{task.deviceId}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type</span>
                        <p className="font-medium mt-1 capitalize">{task.type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created</span>
                        <p className="font-medium mt-1">{new Date(task.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}
