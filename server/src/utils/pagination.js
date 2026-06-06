// ─── Pagination Helper ──────────────────────────────────────
// Purpose: Calculates skip/take values for Prisma from page & limit query params.
// Why: Almost every "list" endpoint needs pagination. Instead of repeating
//      the same math in every controller, we extract it here.
//
// Usage: const { skip, take, page, limit } = paginate(req.query);
//        const results = await prisma.student.findMany({ skip, take });

const paginate = (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100); // Max 100 per page
  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit };
};

// Builds the pagination metadata to include in API responses
const paginationMeta = (total, page, limit) => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
};

module.exports = { paginate, paginationMeta };
