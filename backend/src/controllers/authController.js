import config from '../config/index.js';

const users = [
  {
    id: 'u-1',
    username: config.adminUsername,
    password: config.adminPassword,
    role: 'admin',
  },
];

export function loginUser(req, res) {
  const { username, password } = req.body || {};
  const user = users.find((entry) => entry.username === username && entry.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = {
    token: `mock-token-${user.id}`,
    user: { id: user.id, username: user.username, role: user.role },
  };

  res.json(token);
}
