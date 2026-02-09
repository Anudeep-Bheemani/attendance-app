const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME
      },
      subject,
      html
    };
    
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

const sendAttendanceReport = async (student, attendanceData) => {
  const totalHours = attendanceData.reduce((sum, a) => sum + a.totalHours, 0);
  const attendedHours = attendanceData.reduce((sum, a) => sum + a.attendedHours, 0);
  const percentage = totalHours > 0 ? ((attendedHours / totalHours) * 100).toFixed(1) : 0;
  
  const status = percentage >= 75 ? '✅ Safe' : percentage >= 65 ? '⚠️ Warning' : '❌ Critical';
  
  const subjectRows = attendanceData.map(a => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${a.subject}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${a.attendedHours}/${a.totalHours}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${((a.attendedHours/a.totalHours)*100).toFixed(1)}%</td>
    </tr>
  `).join('');
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Monthly Attendance Report</h2>
      <p>Dear ${student.name},</p>
      <p>Your attendance report for this month:</p>
      
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0;">Overall Attendance: ${percentage}%</h3>
        <p style="margin: 5px 0;">Status: ${status}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #e5e7eb;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Subject</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Hours</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Percentage</th>
          </tr>
        </thead>
        <tbody>
          ${subjectRows}
        </tbody>
      </table>
      
      ${percentage < 75 ? '<p style="color: #dc2626;">⚠️ Your attendance is below 75%. Please improve to avoid academic issues.</p>' : ''}
      
      <p>Best regards,<br>SmartAttd System</p>
    </div>
  `;
  
  return await sendEmail(student.email, 'Monthly Attendance Report', html);
};

const sendParentReport = async (student, parentEmail, attendanceData) => {
  const totalHours = attendanceData.reduce((sum, a) => sum + a.totalHours, 0);
  const attendedHours = attendanceData.reduce((sum, a) => sum + a.attendedHours, 0);
  const percentage = totalHours > 0 ? ((attendedHours / totalHours) * 100).toFixed(1) : 0;
  
  const status = percentage >= 75 ? '✅ Safe Zone' : percentage >= 65 ? '⚠️ Warning Zone' : '❌ Critical - Immediate Attention Required';
  
  const subjectRows = attendanceData.map(a => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${a.subject}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${a.attendedHours}/${a.totalHours}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${((a.attendedHours/a.totalHours)*100).toFixed(1)}%</td>
    </tr>
  `).join('');
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Your Child's Monthly Attendance Report</h2>
      <p>Dear Parent/Guardian,</p>
      <p>This is the monthly attendance report for your child <strong>${student.name}</strong> (${student.rollNo}).</p>
      
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0;">Overall Attendance: ${percentage}%</h3>
        <p style="margin: 5px 0;">Status: ${status}</p>
      </div>
      
      <h3>Subject-wise Breakdown:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #e5e7eb;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Subject</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Hours</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Percentage</th>
          </tr>
        </thead>
        <tbody>
          ${subjectRows}
        </tbody>
      </table>
      
      ${percentage < 75 ? `
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin: 0 0 10px 0;">⚠️ ATTENTION REQUIRED</h4>
          <p style="margin: 0;">Your child's attendance is below the required 75% threshold. This may affect their academic eligibility. Please ensure regular attendance to avoid complications.</p>
        </div>
      ` : ''}
      
      <p>For any concerns, please contact the class teacher.</p>
      <p>Best regards,<br>SmartAttd System</p>
    </div>
  `;
  
  return await sendEmail(parentEmail, `Your Child's Monthly Attendance Report - ${student.name}`, html);
};

const sendLecturerReminder = async (lecturer) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Monthly Attendance Entry Reminder</h2>
      <p>Dear ${lecturer.name},</p>
      <p>This is a reminder to complete the attendance entry for all your assigned students for this month.</p>
      <p>Please log in to SmartAttd and submit the attendance records before the month ends.</p>
      <p>Thank you for your cooperation.</p>
      <p>Best regards,<br>SmartAttd System</p>
    </div>
  `;
  
  return await sendEmail(lecturer.email, 'Monthly Attendance Entry Reminder', html);
};

module.exports = {
  sendEmail,
  sendAttendanceReport,
  sendParentReport,
  sendLecturerReminder
};
