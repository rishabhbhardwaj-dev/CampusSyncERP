require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cse = await prisma.course.findUnique({ where: { code: 'BTCSE' } });
  const ece = await prisma.course.findUnique({ where: { code: 'BTECE' } });
  
  if (!cse || !ece) return console.error('Courses not found');

  const faculty = await prisma.faculty.findFirst();
  if (!faculty) return console.error('Faculty not found');

  // Clear old timetable data
  await prisma.timetable.deleteMany();

  const createSchedule = async (courseId, semester) => {
    const subjects = await prisma.subject.findMany({ where: { courseId, semester } });
    if (subjects.length < 3) return; // Need subjects to seed
    
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM'];
    const endTimes = ['10:00 AM', '11:00 AM', '12:00 PM'];
    
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    
    for (const day of days) {
      for (let i = 0; i < 3; i++) {
        await prisma.timetable.create({
          data: {
            dayOfWeek: day,
            startTime: timeSlots[i],
            endTime: endTimes[i],
            room: `Room ${courseId === cse.id ? '30' : '40'}${i+1}`,
            subjectId: subjects[i].id,
            facultyId: faculty.id,
            courseId: courseId,
            semester: semester,
            session: '2025-26'
          }
        });
      }
    }
  };

  // Seed for Sem 6, 7, 8
  for (const sem of [6, 7, 8]) {
    await createSchedule(cse.id, sem);
    await createSchedule(ece.id, sem);
  }

  console.log('✅ Timetable seeded for Sem 6, 7, and 8 for both CSE and ECE');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
