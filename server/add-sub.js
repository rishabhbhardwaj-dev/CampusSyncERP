const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const course = await prisma.course.findFirst({ where: { code: 'BTCSE' }});
  if (course) {
    // Check if it already exists to avoid unique constraint errors
    const exists = await prisma.subject.findUnique({ where: { code: 'CS401' } });
    if (!exists) {
      await prisma.subject.create({
        data: { name: 'Computer Networks', code: 'CS401', courseId: course.id, semester: 4, credits: 4, type: 'THEORY' }
      });
      console.log('Added CS401 for Sem 4');
    } else {
      console.log('CS401 already exists.');
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
