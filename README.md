# GenieACS Panel

GenieACS Panel is a modern management console for GenieACS TR-069 deployments on Ubuntu 22.04 LTS.

## Overview

This project ships with:
- Express.js backend for REST APIs and JWT auth
- React frontend for the management dashboard
- GenieACS NBI integration layer
- systemd unit files for GenieACS services and panel
- Nginx reverse proxy example with HTTPS redirect
- automated installer script for Ubuntu 22.04

## Architecture

- GenieACS CWMP: port 7547
- GenieACS NBI: port 7557
- GenieACS File Server: port 7567
- GenieACS UI: port 3000
- Panel Web API: port 5000
- Frontend: public web app served by Nginx or Vite dev server

## Quick install

```bash
sudo bash install.sh
```

## Manual install

1. Install dependencies:
   ```bash
   sudo apt update
   sudo apt install -y curl wget gnupg ca-certificates git
   ```
2. Run the installer:
   ```bash
   sudo bash install.sh
   ```
3. Open the app:
   - HTTPS: https://your-domain
   - Local dev: http://localhost:5173 for frontend or http://localhost:5000/api for backend

## Default credentials

The installer creates a default admin account:
- username: `admin`
- password: `GenieACS@2025!`

You should change this immediately in the UI or by editing the environment variables.

## Environment variables

Backend `.env.example`:

```env
PORT=5000
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
GENIEACS_NBI_URL=http://127.0.0.1:7557
GENIEACS_API_KEY=
SESSION_SECRET=change_this_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=GenieACS@2025!
```

## Supported operations

- Device listing and filtering
- Detailed device metadata
- Task creation: get/set/reboot/reset/download firmware
- Task queue and retry workflow
- Logs viewer for GenieACS services
- Role-based access (Admin, Operator, Viewer)

## Developer workflow

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Production notes

- Bind service ports to localhost only behind Nginx.
- Use HTTPS with Let's Encrypt or a valid certificate.
- Restrict firewall access to 80, 443, and 7547.
- Keep `JWT_SECRET` unique and secure.

## License

MIT
