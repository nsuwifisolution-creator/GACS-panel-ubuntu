import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || 'development-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  genieacsNbiUrl: process.env.GENIEACS_NBI_URL || 'http://127.0.0.1:7557',
  genieacsApiKey: process.env.GENIEACS_API_KEY || '',
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'GenieACS@2025!',
  sessionSecret: process.env.SESSION_SECRET || 'development-session-secret-change-me',
};

export default config;
