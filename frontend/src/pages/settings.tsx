import React, { useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Save, ShieldCheck, Lock, Bell, ServerCog } from 'lucide-react';

export function SettingsPage() {
  const [form, setForm] = useState({
    platformName: 'GenieACS Panel',
    jwtExpiry: '7d',
    nbiUrl: 'http://127.0.0.1:7557',
    fileServer: 'http://127.0.0.1:7567',
    enableAuditLogging: true,
    require2FA: false,
  });

  return (
    <Shell>
      <div className="container-main">
        <PageHeader title="Settings" description="System configuration and operational preferences" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Platform Name</label>
                <Input value={form.platformName} onChange={(e) => setForm({ ...form, platformName: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">JWT Expiry</label>
                <Input value={form.jwtExpiry} onChange={(e) => setForm({ ...form, jwtExpiry: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">GenieACS NBI URL</label>
                <Input value={form.nbiUrl} onChange={(e) => setForm({ ...form, nbiUrl: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-medium">JWT Authentication</div>
                    <div className="text-sm text-muted-foreground">Secure token-based access</div>
                  </div>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-medium">Require 2FA</div>
                    <div className="text-sm text-muted-foreground">Optional for administrator accounts</div>
                  </div>
                </div>
                <Button variant={form.require2FA ? 'default' : 'outline'} size="sm" onClick={() => setForm({ ...form, require2FA: !form.require2FA })}>
                  {form.require2FA ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-medium">Audit Logging</div>
                    <div className="text-sm text-muted-foreground">Record login and configuration changes</div>
                  </div>
                </div>
                <Button variant={form.enableAuditLogging ? 'default' : 'outline'} size="sm" onClick={() => setForm({ ...form, enableAuditLogging: !form.enableAuditLogging })}>
                  {form.enableAuditLogging ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <ServerCog className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-medium">File Server</div>
                    <div className="text-sm text-muted-foreground">{form.fileServer}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline">Discard</Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </Shell>
  );
}
