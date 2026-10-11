import { useEffect, useState } from 'react';
import api from './services/api';

export default function DashboardPage() {
  const [data, setData] = useState({ summary: {}, devices: [], tasks: [], logs: [] });

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await api.get('/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (error) {
        console.error('Dashboard fetch failed:', error);
      }
    }

    load();
  }, []);

  return (
    <div>
      <header className="page-header">
        <h2>Dashboard</h2>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <label>Total</label>
          <strong>{data.summary.total || 0}</strong>
        </div>
        <div className="stat-card">
          <label>Online</label>
          <strong>{data.summary.online || 0}</strong>
        </div>
        <div className="stat-card">
          <label>Tasks Pending</label>
          <strong>{data.summary.tasksPending || 0}</strong>
        </div>
        <div className="stat-card">
          <label>Tasks Failed</label>
          <strong>{data.summary.tasksFailed || 0}</strong>
        </div>
      </div>

      <section className="panel">
        <h3>Recent devices</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vendor</th>
              <th>Status</th>
              <th>Last Inform</th>
            </tr>
          </thead>
          <tbody>
            {data.devices.slice(0, 5).map((device) => (
              <tr key={device.id}>
                <td>{device.id}</td>
                <td>{device.manufacturer || device.vendor || 'Unknown'}</td>
                <td>{device.online ? 'Online' : 'Offline'}</td>
                <td>{device.lastInform || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
