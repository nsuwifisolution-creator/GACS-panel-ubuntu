import React from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '@/components/layout/shell';
import { PageHeader, StatsGrid, StatCard } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, AlertCircle, Clock, Zap, ArrowRight } from 'lucide-react';

const chartData = [
  { name: 'Jan', devices: 40, tasks: 24, uptime: 95 },
  { name: 'Feb', devices: 50, tasks: 32, uptime: 97 },
  { name: 'Mar', devices: 45, tasks: 28, uptime: 94 },
  { name: 'Apr', devices: 65, tasks: 45, uptime: 98 },
  { name: 'May', devices: 75, tasks: 52, uptime: 99 },
  { name: 'Jun', devices: 85, tasks: 61, uptime: 98 },
];

const recentDevices = [
  { id: 'ONT-001', name: 'ONT-001', status: 'online', vendor: 'ZTE', lastInform: '2 min ago' },
  { id: 'ONT-002', name: 'ONT-002', status: 'online', vendor: 'Huawei', lastInform: '5 min ago' },
  { id: 'ROUTER-001', name: 'ROUTER-001', status: 'offline', vendor: 'Cisco', lastInform: '1 hour ago' },
  { id: 'GATEWAY-001', name: 'GATEWAY-001', status: 'online', vendor: 'Nokia', lastInform: 'Just now' },
];

const recentTasks = [
  { id: 'task-001', device: 'ONT-001', type: 'Firmware Update', status: 'completed' },
  { id: 'task-002', device: 'ONT-002', type: 'Config Sync', status: 'pending' },
  { id: 'task-003', device: 'ROUTER-001', type: 'Reboot', status: 'failed' },
  { id: 'task-004', device: 'GATEWAY-001', type: 'Parameter Get', status: 'in_progress' },
];

export function DashboardPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'destructive';
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'destructive';
      case 'in_progress':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Shell>
      <div className="container-main">
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here's your system overview."
          isLoading={isLoading}
        />

        <StatsGrid>
          <StatCard
            title="Total Devices"
            value="284"
            change="12% from last month"
            trend="up"
            icon={<Activity className="w-5 h-5" />}
            isLoading={isLoading}
          />
          <StatCard
            title="Online"
            value="276"
            change="2.8% offline"
            trend="up"
            icon={<Zap className="w-5 h-5" />}
            isLoading={isLoading}
          />
          <StatCard
            title="Pending Tasks"
            value="12"
            change="Down 5 from today"
            trend="up"
            icon={<Clock className="w-5 h-5" />}
            isLoading={isLoading}
          />
          <StatCard
            title="Alerts"
            value="3"
            change="1 critical"
            trend="down"
            icon={<AlertCircle className="w-5 h-5" />}
            isLoading={isLoading}
          />
        </StatsGrid>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Device Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Device Activity</CardTitle>
              <CardDescription>Total devices and task execution over time</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '10px',
                      }}
                    />
                    <Line type="monotone" dataKey="devices" stroke="hsl(262, 80%, 50%)" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="tasks" stroke="hsl(262, 80%, 70%)" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Uptime Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Uptime</CardTitle>
              <CardDescription>Average uptime this month</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '10px',
                      }}
                    />
                    <Area type="monotone" dataKey="uptime" stroke="hsl(142, 76%, 36%)" fill="hsl(142, 76%, 36%, 0.1)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Devices */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Recent Devices</CardTitle>
                <CardDescription>Latest connected devices</CardDescription>
              </div>
              <Link to="/devices">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{device.vendor}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusColor(device.status)}>{device.status}</Badge>
                      <p className="text-xs text-muted-foreground w-20 text-right">{device.lastInform}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Latest task executions</CardDescription>
              </div>
              <Link to="/tasks">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.type}</p>
                      <p className="text-xs text-muted-foreground">{task.device}</p>
                    </div>
                    <Badge variant={statusColor(task.status)}>{task.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
