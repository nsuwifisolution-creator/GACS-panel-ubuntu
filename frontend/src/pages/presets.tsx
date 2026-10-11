import React, { useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Copy } from 'lucide-react';
import { Preset } from '@/types';

const samplePresets: Preset[] = [
  {
    id: 'preset-001',
    name: 'Default ONT Configuration',
    description: 'Standard configuration for ZTE ONT devices',
    config: {
      'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.Enable': 'true',
      'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress': 'DHCP',
    },
    createdAt: '2024-09-15T10:30:00Z',
    updatedAt: '2024-10-11T08:00:00Z',
  },
  {
    id: 'preset-002',
    name: 'Enterprise Gateway Setup',
    description: 'Configuration for enterprise gateway devices',
    config: {
      'InternetGatewayDevice.ManagementServer.URL': 'https://acs.example.com/acs',
      'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.Enable': 'true',
    },
    createdAt: '2024-10-01T14:20:00Z',
    updatedAt: '2024-10-10T09:15:00Z',
  },
  {
    id: 'preset-003',
    name: 'Residential Router Config',
    description: 'Configuration for residential router devices',
    config: {
      'InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.1.Enable': 'true',
      'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.Enable': 'true',
    },
    createdAt: '2024-09-20T11:45:00Z',
    updatedAt: '2024-10-08T16:30:00Z',
  },
];

export function PresetsPage() {
  const [search, setSearch] = useState('');
  const [presets, setPresets] = useState(samplePresets);

  const filteredPresets = presets.filter((preset) =>
    preset.name.toLowerCase().includes(search.toLowerCase()) ||
    preset.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Shell>
      <div className="container-main">
        <PageHeader
          title="Presets"
          description="Manage device configuration presets and provisioning templates"
          action={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Preset
            </Button>
          }
        />

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Search Presets</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPresets.map((preset) => (
            <Card key={preset.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{preset.name}</CardTitle>
                    <CardDescription className="mt-1">{preset.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon"><Copy className="w-4 h-4" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Configuration</h4>
                    <div className="max-h-40 overflow-y-auto bg-muted/30 rounded p-3">
                      <pre className="text-xs text-foreground font-mono">{JSON.stringify(preset.config, null, 2)}</pre>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Updated {new Date(preset.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(preset.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}
