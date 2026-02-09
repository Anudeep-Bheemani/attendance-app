const { generateAIInsight } = require('../services/aiService');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

const getAIInsight = async (req, res) => {
  try {
    const { prompt } = req.body;

    const insight = await generateAIInsight(prompt);

    res.json({ insight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClassAnalytics = async (req, res) => {
  try {
    const { branch, batch, subject, month, year } = req.query;

    const currentMonth = month || new Date().toLocaleString('default', { month: 'long' });
    const currentYear = year || new Date().getFullYear();

    const students = await Student.findAll({ where: { branch, batch } });
    const studentIds = students.map(s => s.id);

    const attendance = await Attendance.findAll({
      where: {
        studentId: studentIds,
        subject,
        month: currentMonth,
        year: currentYear
      }
    });

    const totalStudents = students.length;

    // If no attendance records found for this month, return empty stats but valid structure
    if (attendance.length === 0) {
      return res.json({
        analytics: {
          totalStudents,
          safe: 0,
          warning: 0,
          critical: totalStudents, // Assuming no attendance = critical, or handle as 0
          avgAttendance: "0.0"
        },
        aiInsight: "No attendance data available for this month."
      });
    }

    const safe = attendance.filter(a => (a.attendedHours / a.totalHours) >= 0.75).length;
    const warning = attendance.filter(a => {
      const pct = a.attendedHours / a.totalHours;
      return pct >= 0.65 && pct < 0.75;
    }).length;
    const critical = attendance.filter(a => (a.attendedHours / a.totalHours) < 0.65).length;

    const avgAttendance = attendance.reduce((sum, a) => {
      return sum + (a.attendedHours / a.totalHours);
    }, 0) / attendance.length * 100;

    const prompt = `Generate a professional, short Monthly Attendance Report for the College Head of Department.
    Subject: ${subject}
    Class: ${branch} ${batch}
    Month: ${currentMonth} ${currentYear}
    Total Students: ${totalStudents}
    Class Average Attendance: ${avgAttendance.toFixed(1)}%
    Safe Zone Students: ${safe}
    Warning Zone Students: ${warning}
    Critical Zone Students (<65%): ${critical}
    
    Please summarize the class performance, highlight the critical risk situation, and suggest 2 specific actions for the lecturer to improve attendance. Format with clear headings.`;

    const aiInsight = await generateAIInsight(prompt);

    res.json({
      analytics: {
        totalStudents,
        safe,
        warning,
        critical,
        avgAttendance: avgAttendance.toFixed(1)
      },
      aiInsight
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAIInsight,
  getClassAnalytics
};
