// ─── Seed More Students ─────────────────────────────────────
// Adds 15 sample students for a rich demo experience.
// Run: node server/src/prisma/seedStudents.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const students = [
  { name: 'Aarav Patel', email: 'aarav@campussync.com', phone: '9100000001', enrollmentNo: 'CSE2024002', courseCode: 'BTCSE', semester: 3, section: 'A', year: 2024, dept: 'CSE' },
  { name: 'Ananya Singh', email: 'ananya@campussync.com', phone: '9100000002', enrollmentNo: 'CSE2024003', courseCode: 'BTCSE', semester: 3, section: 'B', year: 2024, dept: 'CSE' },
  { name: 'Rohit Sharma', email: 'rohit@campussync.com', phone: '9100000003', enrollmentNo: 'CSE2023001', courseCode: 'BTCSE', semester: 5, section: 'A', year: 2023, dept: 'CSE' },
  { name: 'Sneha Gupta', email: 'sneha@campussync.com', phone: '9100000004', enrollmentNo: 'ECE2024001', courseCode: 'BTECE', semester: 3, section: 'A', year: 2024, dept: 'ECE' },
  { name: 'Vikram Reddy', email: 'vikram@campussync.com', phone: '9100000005', enrollmentNo: 'ECE2024002', courseCode: 'BTECE', semester: 1, section: 'A', year: 2024, dept: 'ECE' },
  { name: 'Kavya Nair', email: 'kavya@campussync.com', phone: '9100000006', enrollmentNo: 'CSE2023002', courseCode: 'BTCSE', semester: 5, section: 'B', year: 2023, dept: 'CSE' },
  { name: 'Arjun Menon', email: 'arjun@campussync.com', phone: '9100000007', enrollmentNo: 'CSE2024004', courseCode: 'BTCSE', semester: 1, section: 'A', year: 2024, dept: 'CSE' },
  { name: 'Diya Joshi', email: 'diya@campussync.com', phone: '9100000008', enrollmentNo: 'ECE2023001', courseCode: 'BTECE', semester: 5, section: 'A', year: 2023, dept: 'ECE' },
  { name: 'Karthik Iyer', email: 'karthik@campussync.com', phone: '9100000009', enrollmentNo: 'CSE2022001', courseCode: 'BTCSE', semester: 7, section: 'A', year: 2022, dept: 'CSE' },
  { name: 'Meera Krishnan', email: 'meera@campussync.com', phone: '9100000010', enrollmentNo: 'ECE2024003', courseCode: 'BTECE', semester: 3, section: 'B', year: 2024, dept: 'ECE' },
  { name: 'Rahul Verma', email: 'rahul@campussync.com', phone: '9100000011', enrollmentNo: 'CSE2024005', courseCode: 'BTCSE', semester: 1, section: 'B', year: 2024, dept: 'CSE' },
  { name: 'Ishita Agarwal', email: 'ishita@campussync.com', phone: '9100000012', enrollmentNo: 'CSE2023003', courseCode: 'BTCSE', semester: 5, section: 'A', year: 2023, dept: 'CSE' },
  { name: 'Aditya Kulkarni', email: 'aditya@campussync.com', phone: '9100000013', enrollmentNo: 'ECE2023002', courseCode: 'BTECE', semester: 5, section: 'B', year: 2023, dept: 'ECE' },
  { name: 'Pooja Bhatt', email: 'pooja@campussync.com', phone: '9100000014', enrollmentNo: 'CSE2024006', courseCode: 'BTCSE', semester: 3, section: 'A', year: 2024, dept: 'CSE' },
  { name: 'Siddharth Das', email: 'siddharth@campussync.com', phone: '9100000015', enrollmentNo: 'ECE2024004', courseCode: 'BTECE', semester: 1, section: 'A', year: 2024, dept: 'ECE' },
];

async function main() {
  console.log('🌱 Seeding 15 sample students...\n');
  const hashedPassword = await bcrypt.hash('student123', 10);

  const depts = await prisma.department.findMany();
  const courses = await prisma.course.findMany();
  const deptMap = Object.fromEntries(depts.map(d => [d.code, d.id]));
  const courseMap = Object.fromEntries(courses.map(c => [c.code, c.id]));

  for (const s of students) {
    const existing = await prisma.user.findUnique({ where: { email: s.email } });
    if (existing) { console.log(`  ⏭ ${s.name} already exists`); continue; }

    const user = await prisma.user.create({
      data: { name: s.name, email: s.email, password: hashedPassword, phone: s.phone, role: 'STUDENT', departmentId: deptMap[s.dept] || null },
    });
    await prisma.student.create({
      data: { userId: user.id, enrollmentNo: s.enrollmentNo, courseId: courseMap[s.courseCode], semester: s.semester, section: s.section, admissionYear: s.year },
    });
    console.log(`  ✅ ${s.name} (${s.enrollmentNo})`);
  }

  console.log('\n🎉 Student seeding complete!');
}

main().catch(e => { console.error('❌', e); process.exit(1); }).finally(() => prisma.$disconnect());
