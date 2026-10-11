import { useEffect, useState } from 'react';
import api from '../services/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data.tasks || []);
      } catch (error) {
        console.error('Tasks fetch failed:', error);
      }
    }

    load();
  }, []);

  return (
    <div>
      <header className="page-header">
        <h2>Tasks</h2>
      </header>

      <section className="panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Device</th>
              <th>Task</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.deviceId}</td>
                <td>{task.name || 'Provisioning'}</td>
                <td>{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
