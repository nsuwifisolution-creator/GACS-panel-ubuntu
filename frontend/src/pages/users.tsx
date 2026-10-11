import React, { useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, ShieldCheck, UserCog, Activity, Lock, Mail, Ban } from 'lucide-react';

const sampleUsers = [
  { id: 'u-001', username: 'admin', role: 'admin', email: 'admin@isp.local', lastLogin: 'Now', status: 'active' },
  { id: 'u-002', username: 'operator-1', role: 'operator', email: 'ops1@isp.local', lastLogin: '2 hours ago', status: 'active' },
  { id: 'u-003', username: 'viewer-1', role: 'viewer', email: 'viewer@isp.local', lastLogin: 'Yesterday', status: 'inactive' },
];

export function UsersPage() {
  const [search, setSearch] = useState('');
  const filtered = sampleUsers.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Shell>
      <div className="container-main">
        <PageHeader
          title="Users"
          description="Manage access roles and operator accounts"
          action={<Button><Plus className="w-4 h-4 mr-2" />Invite User</Button>}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                  <div className="text-2xl font-bold">{sampleUsers.length}</div>
                </div>
                <UserCog className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Admins</div>
                  <div className="text-2xl font-bold">{sampleUsers.filter((u) => u.role === 'admin').length}</div>
                </div>
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Active Sessions</div>
                  <div className="text-2xl font-bold">2</div>
                </div>
                <Activity className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <th className="py-3 pr-4">Username</th>
                    <th className="py-3 pr-4">Role</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Last Login</th>
                    <th className="py-3 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/40">
                      <td className="py-3 pr-4 font-medium">{user.username}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={user.role === 'admin' ? 'default' : user.role === 'operator' ? 'secondary' : 'outline'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">{user.email}</td>
                      <td className="py-3 pr-4">{user.lastLogin}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={user.status === 'active' ? 'success' : 'destructive'}>{user.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
