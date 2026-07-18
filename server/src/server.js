// ─── Server Entry Point ─────────────────────────────────────
// Purpose: Starts the Express server and connects to the database.
// Why separate from app.js?
//   - This file handles the "runtime" concerns: port binding, graceful shutdown.
//   - app.js handles "configuration" concerns: middleware, routes.

const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/db');

const startServer = async () => {
  try {
    // Start listening immediately to avoid blocking on DB connection
    // (Crucial for preventing cold start / container startup timeouts on Render)
    const server = app.listen(env.PORT, () => {
      console.log(`\n🚀 CampusSyncERP Server`);
      console.log(`   Environment: ${env.NODE_ENV}`);
      console.log(`   Port:        ${env.PORT}`);
      console.log(`   URL:         http://localhost:${env.PORT}`);
      console.log(`   Health:      http://localhost:${env.PORT}/api/health\n`);
    });

    // Connect to database asynchronously
    prisma.$connect()
      .then(() => {
        console.log('✅ Database connected successfully.');
      })
      .catch((error) => {
        console.error('❌ Database connection failed:', error.message);
      });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown — close DB connection when server stops
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();