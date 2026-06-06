// ─── Prisma Client Singleton ────────────────────────────────
// Purpose: Creates ONE shared Prisma client instance for the entire app.
// Why: Prisma recommends a singleton pattern to avoid opening too many
//      database connections (each `new PrismaClient()` opens a connection pool).
//      We reuse the same instance everywhere via this import.

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

module.exports = prisma;
