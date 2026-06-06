require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cseSubjects = {
  1: ['Programming Fundamentals', 'Engineering Mathematics I', 'Digital Logic Basics'],
  2: ['Data Structures', 'Engineering Mathematics II', 'Computer Organization'],
  3: ['Object Oriented Programming', 'Database Management Systems', 'Operating Systems'],
  4: ['Computer Networks', 'Software Engineering', 'Design & Analysis of Algorithms'],
  5: ['Web Technologies', 'Compiler Design', 'Theory of Computation'],
  6: ['Artificial Intelligence', 'Cloud Computing', 'Cyber Security'],
  7: ['Machine Learning', 'Distributed Systems', 'Big Data Analytics'],
  8: ['Blockchain Technology', 'DevOps & Deployment', 'Major Project']
};

const eceSubjects = {
  1: ['Engineering Mathematics I', 'Basic Electrical Engineering', 'Engineering Physics'],
  2: ['Engineering Mathematics II', 'Electronic Devices', 'Network Theory'],
  3: ['Analog Electronics', 'Signals & Systems', 'Digital Electronics'],
  4: ['Microprocessors & Microcontrollers', 'Communication Systems', 'Electromagnetic Theory'],
  5: ['Digital Signal Processing', 'VLSI Design', 'Control Systems'],
  6: ['Wireless Communication', 'Embedded Systems', 'Optical Communication'],
  7: ['Internet of Things (IoT)', 'Satellite Communication', 'Robotics & Automation'],
  8: ['5G Communication', 'Industrial Electronics', 'Major Project']
};

function generateCode(name, branch, sem, idx) {
  return `${branch}${sem}0${idx + 1}`;
}

async function main() {
  // Get or Create Department
  let eceDept = await prisma.department.findUnique({ where: { code: 'ECE' } });
  if (!eceDept) {
    eceDept = await prisma.department.create({
      data: { name: 'Electronics and Communication', code: 'ECE' }
    });
  }

  // Get or Create ECE Course
  let eceCourse = await prisma.course.findUnique({ where: { code: 'BTECE' } });
  if (!eceCourse) {
    eceCourse = await prisma.course.create({
      data: { name: 'B.Tech Electronics & Communication', code: 'BTECE', departmentId: eceDept.id, duration: 4, totalSemesters: 8 }
    });
  }

  // Get CSE Course
  const cseCourse = await prisma.course.findUnique({ where: { code: 'BTCSE' } });

  // Delete existing subjects to prevent duplicates and start fresh
  await prisma.subject.deleteMany({
    where: { OR: [{ courseId: cseCourse?.id }, { courseId: eceCourse.id }] }
  });

  // Seed CSE
  if (cseCourse) {
    for (const [semStr, subjects] of Object.entries(cseSubjects)) {
      const semester = parseInt(semStr);
      for (let i = 0; i < subjects.length; i++) {
        await prisma.subject.create({
          data: {
            name: subjects[i],
            code: generateCode(subjects[i], 'CS', semester, i),
            courseId: cseCourse.id,
            semester,
            credits: 4,
            type: 'THEORY'
          }
        });
      }
    }
    console.log('✅ Seeded all CSE Subjects');
  }

  // Seed ECE
  for (const [semStr, subjects] of Object.entries(eceSubjects)) {
    const semester = parseInt(semStr);
    for (let i = 0; i < subjects.length; i++) {
      await prisma.subject.create({
        data: {
          name: subjects[i],
          code: generateCode(subjects[i], 'EC', semester, i),
          courseId: eceCourse.id,
          semester,
          credits: 4,
          type: 'THEORY'
        }
      });
    }
  }
  console.log('✅ Seeded all ECE Subjects');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
