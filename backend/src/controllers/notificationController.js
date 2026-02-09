const Student = require('../models/Student');
const Lecturer = require('../models/Lecturer');
const Attendance = require('../models/Attendance');
const { sendAttendanceReport, sendParentReport, sendLecturerReminder } = require('../services/emailService');

const sendStudentParentReports = async (req, res) => {
  try {
    const students = await Student.findAll();
    let emailCount = 0;
    
    for (const student of students) {
      const attendance = await Attendance.findAll({
        where: { studentId: student.id }
      });
      
      if (attendance.length > 0) {
        await sendAttendanceReport(student, attendance);
        emailCount++;
        
        if (student.guardianEmail) {
          await sendParentReport(student, student.guardianEmail, attendance);
          emailCount++;
        }
      }
    }
    
    res.json({
      message: 'Reports sent successfully',
      emailCount,
      students: students.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendLecturerReminders = async (req, res) => {
  try {
    const lecturers = await Lecturer.findAll();
    let emailCount = 0;
    
    for (const lecturer of lecturers) {
      await sendLecturerReminder(lecturer);
      emailCount++;
    }
    
    res.json({
      message: 'Reminders sent successfully',
      emailCount,
      lecturers: lecturers.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendStudentParentReports,
  sendLecturerReminders
};
