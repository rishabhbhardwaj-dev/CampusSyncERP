// ─── Database Seed Script ───────────────────────────────────
// Purpose: Creates initial data so the app is usable right after setup.
// Why: You need at least one ADMIN user to login and create other users.
//      This script creates that first admin. Run it once after migration.
//
// Usage: npm run prisma:seed

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Create departments
  const csDept = await prisma.department.upsert({
    where: { code: 'CSE' },
    update: {},
    create: { name: 'Computer Science & Engineering', code: 'CSE' },
  });

  const eceDept = await prisma.department.upsert({
    where: { code: 'ECE' },
    update: {},
    create: { name: 'Electronics & Communication Engineering', code: 'ECE' },
  });

  const meDept = await prisma.department.upsert({
    where: { code: 'ME' },
    update: {},
    create: { name: 'Mechanical Engineering', code: 'ME' },
  });

  console.log('✅ Departments created:', csDept.name, eceDept.name, meDept.name);

  // Create courses
  const btechCSE = await prisma.course.upsert({
    where: { code: 'BTCSE' },
    update: {},
    create: {
      name: 'B.Tech Computer Science',
      code: 'BTCSE',
      departmentId: csDept.id,
      duration: 4,
      totalSemesters: 8,
    },
  });

  const btechECE = await prisma.course.upsert({
    where: { code: 'BTECE' },
    update: {},
    create: {
      name: 'B.Tech Electronics & Communication',
      code: 'BTECE',
      departmentId: eceDept.id,
      duration: 4,
      totalSemesters: 8,
    },
  });

  console.log('✅ Courses created:', btechCSE.name, btechECE.name);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@campussync.com' },
    update: {},
    create: {
      email: 'admin@campussync.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'ADMIN',
      phone: '9999999999',
    },
  });

  console.log('✅ Admin user created:', admin.email, '(password: admin123)');

  // Create a sample faculty
  const facultyPassword = await bcrypt.hash('faculty123', 10);
  const facultyUser = await prisma.user.upsert({
    where: { email: 'faculty@campussync.com' },
    update: {},
    create: {
      email: 'faculty@campussync.com',
      password: facultyPassword,
      name: 'Dr. Rajesh Kumar',
      role: 'FACULTY',
      phone: '9876543210',
      departmentId: csDept.id,
    },
  });

  await prisma.faculty.upsert({
    where: { userId: facultyUser.id },
    update: {},
    create: {
      userId: facultyUser.id,
      employeeId: 'FAC001',
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Computer Science',
      joiningDate: new Date('2020-01-15'),
    },
  });

  console.log('✅ Faculty created:', facultyUser.email, '(password: faculty123)');

  // Create a sample student
  const studentPassword = await bcrypt.hash('student123', 10);
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@campussync.com' },
    update: {},
    create: {
      email: 'student@campussync.com',
      password: studentPassword,
      name: 'Priya Sharma',
      role: 'STUDENT',
      phone: '9123456789',
      departmentId: csDept.id,
    },
  });

  await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      enrollmentNo: 'CSE2024001',
      courseId: btechCSE.id,
      semester: 3,
      section: 'A',
      admissionYear: 2024,
      guardianName: 'Ramesh Sharma',
      guardianPhone: '9876543211',
    },
  });

  console.log('✅ Student created:', studentUser.email, '(password: student123)');

  // Create sample subjects
  const subjects = [
    { name: 'Data Structures & Algorithms', code: 'CS301', courseId: btechCSE.id, semester: 3, credits: 4, type: 'THEORY' },
    { name: 'Database Management Systems', code: 'CS302', courseId: btechCSE.id, semester: 3, credits: 4, type: 'THEORY' },
    { name: 'Operating Systems', code: 'CS303', courseId: btechCSE.id, semester: 3, credits: 3, type: 'THEORY' },
    { name: 'DSA Lab', code: 'CS301L', courseId: btechCSE.id, semester: 3, credits: 2, type: 'PRACTICAL' },
    { name: 'DBMS Lab', code: 'CS302L', courseId: btechCSE.id, semester: 3, credits: 2, type: 'PRACTICAL' },
  ];

  for (const subj of subjects) {
    await prisma.subject.upsert({
      where: { code: subj.code },
      update: {},
      create: subj,
    });
  }

  console.log('✅ Subjects created:', subjects.length, 'subjects');

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
