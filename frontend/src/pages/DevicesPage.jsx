import { useEffect, useState } from 'react';
import api from '../services/api';

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/devices?query={}', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDevices(res.data.devices || []);
      } catch (error) {
        console.error('Devices fetch failed:', error);
      }
    }

    load();
  }, []);

  return (
    <div>
      <header className="page-header">
        <h2>Devices</h2>
      </header>

      <section className="panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Alias</th>
              <th>Model</th>
              <th>Status</th>
              <th>Firmware</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <td>{device.id}</td>
                <td>{device.alias || '-'}</td>
                <td>{device.productClass || '-'}</td>
                <td>{device.online ? 'Online' : 'Offline'}</td>
                <td>{device.softwareVersion || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
