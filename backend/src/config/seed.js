const { sequelize } = require('./database');
const User = require('../models/User');
const Student = require('../models/Student');
const Lecturer = require('../models/Lecturer');
const Attendance = require('../models/Attendance');

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');
    
    await sequelize.sync({ force: true });
    
    // Create Admin
    const admin = await User.create({
      email: 'admin@college.edu',
      password: 'admin123',
      role: 'admin',
      name: 'System Administrator',
      isVerified: true
    });
    console.log('✅ Admin created');
    
    // Create Lecturers
    const lecturer1 = await User.create({
      email: 'alan@college.edu',
      password: 'pass',
      role: 'lecturer',
      name: 'Dr. Alan Turing',
      isVerified: true
    });
    
    await Lecturer.create({
      userId: lecturer1.id,
      name: 'Dr. Alan Turing',
      email: 'alan@college.edu',
      phone: '+91 9876543210',
      branch: 'CSE',
      subjects: ['Data Structures', 'Algorithms', 'Database Systems'],
      assignedClass: 'CSE-1'
    });
    console.log('✅ Lecturer created');
    
    // Create Students
    const students = [
      { rollNo: '24CSE100', name: 'Rahul Kumar', branch: 'CSE', batch: '2024-2028' },
      { rollNo: '24CSE101', name: 'Priya Sharma', branch: 'CSE', batch: '2024-2028' },
      { rollNo: '24CSE102', name: 'Amit Patel', branch: 'CSE', batch: '2024-2028' },
      { rollNo: '24ECE100', name: 'Sneha Reddy', branch: 'ECE', batch: '2024-2028' },
      { rollNo: '24ECE101', name: 'Vikram Singh', branch: 'ECE', batch: '2024-2028' }
    ];
    
    for (const studentData of students) {
      const user = await User.create({
        email: `${studentData.rollNo.toLowerCase()}@college.edu`,
        password: 'pass',
        role: 'student',
        rollNo: studentData.rollNo,
        name: studentData.name,
        phone: '+91 9876543210',
        isVerified: true
      });
      
      const student = await Student.create({
        userId: user.id,
        rollNo: studentData.rollNo,
        name: studentData.name,
        email: `${studentData.rollNo.toLowerCase()}@college.edu`,
        phone: '+91 9876543210',
        branch: studentData.branch,
        batch: studentData.batch,
        guardianName: `Parent of ${studentData.name}`,
        guardianEmail: `parent.${studentData.rollNo.toLowerCase()}@college.edu`,
        guardianPhone: '+91 9876543211'
      });
      
      // Create sample attendance
      await Attendance.create({
        studentId: student.id,
        subject: 'Data Structures',
        totalHours: 40,
        attendedHours: Math.floor(Math.random() * 10) + 30,
        month: 'October',
        year: 2024
      });
      
      await Attendance.create({
        studentId: student.id,
        subject: 'Algorithms',
        totalHours: 40,
        attendedHours: Math.floor(Math.random() * 10) + 30,
        month: 'October',
        year: 2024
      });
    }
    
    console.log('✅ Students and attendance created');
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@college.edu / admin123');
    console.log('Lecturer: alan@college.edu / pass');
    console.log('Student: 24CSE100 / pass');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
