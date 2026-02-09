const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

const updateAttendance = async (req, res) => {
  try {
    const { studentId, subject, totalHours, attendedHours } = req.body;
    
    let attendance = await Attendance.findOne({
      where: { studentId, subject }
    });
    
    if (attendance) {
      attendance.totalHours = totalHours;
      attendance.attendedHours = attendedHours;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        studentId,
        subject,
        totalHours,
        attendedHours,
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear()
      });
    }
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bulkUpdateAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body;
    
    const promises = attendanceData.map(async (data) => {
      let attendance = await Attendance.findOne({
        where: { studentId: data.studentId, subject: data.subject }
      });
      
      if (attendance) {
        attendance.totalHours = data.totalHours;
        attendance.attendedHours = data.attendedHours;
        return await attendance.save();
      } else {
        return await Attendance.create({
          ...data,
          month: new Date().toLocaleString('default', { month: 'long' }),
          year: new Date().getFullYear()
        });
      }
    });
    
    await Promise.all(promises);
    
    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAttendanceByClass = async (req, res) => {
  try {
    const { branch, batch } = req.query;
    
    const students = await Student.findAll({ where: { branch, batch } });
    const studentIds = students.map(s => s.id);
    
    const attendance = await Attendance.findAll({
      where: { studentId: studentIds }
    });
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateAttendance,
  bulkUpdateAttendance,
  getAttendanceByClass
};
