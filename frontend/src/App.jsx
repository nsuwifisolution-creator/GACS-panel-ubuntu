import { Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import DevicesPage from './pages/DevicesPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import LogsPage from './pages/LogsPage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>GenieACS Panel</h1>
        </div>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/devices">Devices</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/logs">Logs</Link>
        </nav>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/logs" element={<LogsPage />} />
        </Routes>
      </main>
    </div>
  );
}
