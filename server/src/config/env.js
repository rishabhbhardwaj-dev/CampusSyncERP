// ─── Environment Config ─────────────────────────────────────
// Purpose: Centralizes all environment variables in one place.
// Why: Instead of calling process.env everywhere (scattered, error-prone),
//      we import from here. If a var is missing, we catch it early.

require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_MAX_AGE: parseInt(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000, // 7 days
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

// Validate critical env vars at startup
const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
for (const varName of requiredVars) {
  if (!env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    process.exit(1);
  }
}

module.exports = env;
