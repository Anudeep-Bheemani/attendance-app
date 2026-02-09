const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

const updateAttendance = async (req, res) => {
  try {
    const { studentId, subject, totalHours, attendedHours } = req.body;

    if (!studentId || !subject) {
      return res.status(400).json({ error: 'Missing required fields: studentId or subject' });
    }

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    let attendance = await Attendance.findOne({
      where: {
        studentId,
        subject,
        month: currentMonth,
        year: currentYear
      }
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
        month: currentMonth,
        year: currentYear
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

    if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({ error: 'attendanceData must be a non-empty array' });
    }

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    const promises = attendanceData.map(async (data) => {
      if (!data.studentId || !data.subject) return null; // Skip invalid entries

      let attendance = await Attendance.findOne({
        where: {
          studentId: data.studentId,
          subject: data.subject,
          month: currentMonth,
          year: currentYear
        }
      });

      if (attendance) {
        attendance.totalHours = data.totalHours;
        attendance.attendedHours = data.attendedHours;
        return await attendance.save();
      } else {
        return await Attendance.create({
          ...data,
          month: currentMonth,
          year: currentYear
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
