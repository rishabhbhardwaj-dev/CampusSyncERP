const prisma = require('./src/config/db');

async function main() {
  try {
    const stats = await Promise.all([
      prisma.student.count(),
      prisma.faculty.count(),
      prisma.department.count(),
    ]);
    console.log("Stats:", stats);

    const notices = await prisma.notice.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { postedBy: { select: { name: true } } }
    });
    console.log("Notices count:", notices.length);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
