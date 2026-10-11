import { useEffect, useState } from 'react';
import api from '../services/api';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/logs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data.logs || []);
      } catch (error) {
        console.error('Logs fetch failed:', error);
      }
    }

    load();
  }, []);

  return (
    <div>
      <header className="page-header">
        <h2>Logs</h2>
      </header>

      <section className="panel">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Service</th>
              <th>Level</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={`${log.timestamp}-${index}`}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.service}</td>
                <td>{log.level}</td>
                <td>{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
