const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      where: { studentId: req.params.id }
    });
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentAttendance
};
