// ─── Server Entry Point ─────────────────────────────────────
// Purpose: Starts the Express server and connects to the database.

const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/db');

const startServer = async () => {
  try {
    // Connect to database FIRST
    await prisma.$connect();
    console.log('✅ Database connected successfully.');

    // Then start listening
    const server = app.listen(env.PORT, () => {
      console.log(`\n🚀 CampusSyncERP Server`);
      console.log(`   Environment: ${env.NODE_ENV}`);
      console.log(`   Port:        ${env.PORT}`);
      console.log(`   URL:         http://localhost:${env.PORT}`);
      console.log(`   Health:      http://localhost:${env.PORT}/api/health\n`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ Database disconnected. Server stopped.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);

    if (error.message.includes('connect') || error.message.includes('ECONNREFUSED') || error.message.includes('database')) {
      console.error('❌ Database connection failed. Server will not start.');
    }

    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
};

startServer();