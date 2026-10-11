import React, { useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Download, Trash2 } from 'lucide-react';
import { Firmware } from '@/types';

const sampleFirmwares: Firmware[] = [
  {
    id: 'fw-001',
    name: 'ZTE ZXHN F670 v5.0.2',
    version: 'V5.0.2',
    productClass: 'ZXHN F670',
    fileSize: 51234567,
    url: 'https://firmware.example.com/zte-f670-v5.0.2.bin',
    checksum: 'abc123def456',
    releaseNotes: 'Security patches and performance improvements',
    createdAt: '2024-10-10T15:30:00Z',
  },
  {
    id: 'fw-002',
    name: 'Huawei HG8145V5 v3.0.1',
    version: 'V3.0.1',
    productClass: 'HG8145V5',
    fileSize: 48901234,
    url: 'https://firmware.example.com/huawei-hg8145v5-v3.0.1.bin',
    checksum: 'xyz789uvw012',
    releaseNotes: 'Bug fixes and stability improvements',
    createdAt: '2024-10-09T10:20:00Z',
  },
  {
    id: 'fw-003',
    name: 'Cisco ISR4331 v16.9.5',
    version: 'V16.9.5',
    productClass: 'ISR4331',
    fileSize: 156234567,
    url: 'https://firmware.example.com/cisco-isr4331-v16.9.5.bin',
    checksum: 'pqr345stu678',
    releaseNotes: 'Major feature release with new capabilities',
    createdAt: '2024-10-05T12:00:00Z',
  },
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function FirmwarePage() {
  const [search, setSearch] = useState('');
  const [firmwares, setFirmwares] = useState(sampleFirmwares);

  const filteredFirmwares = firmwares.filter((fw) =>
    fw.name.toLowerCase().includes(search.toLowerCase()) ||
    fw.productClass.toLowerCase().includes(search.toLowerCase()) ||
    fw.version.includes(search)
  );

  const handleDelete = (id: string) => {
    setFirmwares((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <Shell>
      <div className="container-main">
        <PageHeader
          title="Firmware"
          description="Manage device firmware images and updates"
          action={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Firmware
            </Button>
          }
        />

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Search Firmware</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name, version, or product class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Firmware List */}
        <div className="space-y-4">
          {filteredFirmwares.map((fw) => (
            <Card key={fw.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{fw.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{fw.releaseNotes}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Version</span>
                        <p className="font-medium mt-1">{fw.version}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Product Class</span>
                        <p className="font-medium mt-1">{fw.productClass}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">File Size</span>
                        <p className="font-medium mt-1">{formatFileSize(fw.fileSize)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Uploaded</span>
                        <p className="font-medium mt-1">{new Date(fw.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 md:flex-none text-destructive hover:text-destructive"
                      onClick={() => handleDelete(fw.id)}
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
