// ─── CORS Configuration ─────────────────────────────────────
// Purpose: Controls which domains can make requests to our API.
// Why: Browsers block cross-origin requests by default (security).
//      Our React frontend runs on localhost:5173 but backend is on :5000.
//      This config tells Express to allow requests from our frontend.
//      `credentials: true` allows cookies (our JWT) to be sent cross-origin.

const env = require('./env');

const corsOptions = {
  origin: env.CLIENT_URL,
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = corsOptions;
