import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export const calculatePercentage = (attended, total) => {
  if (!total || total === 0) return 0;
  return ((attended / total) * 100).toFixed(1);
};

export const getRiskStatus = (percentage) => {
  const p = parseFloat(percentage);
  if (p >= 75) return { label: 'Safe', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
  if (p >= 65) return { label: 'Warning', color: 'text-orange-600', bg: 'bg-orange-100', icon: AlertTriangle };
  return { label: 'Critical', color: 'text-red-600', bg: 'bg-red-100', icon: XCircle };
};

export const predictHours = (attended, total, target) => {
  const currentP = attended / total;
  if (currentP >= target) return 0; 
  const needed = (target * total - attended) / (1 - target);
  return Math.ceil(needed);
};

export const generateMockAttendance = (students, SUBJECTS) => {
  const records = [];
  const subjects = SUBJECTS.CSE;
  students.forEach(student => {
    subjects.forEach(sub => {
      const total = 40; 
      const rand = Math.random();
      let attended;
      if (rand > 0.8) attended = 38; 
      else if (rand > 0.5) attended = 28; 
      else attended = 18; 

      records.push({
        id: Math.random().toString(36).substr(2, 9),
        studentId: student.id,
        studentName: student.name,
        rollNo: student.rollNo,
        subject: sub,
        month: "October",
        totalHours: total,
        attendedHours: attended
      });
    });
  });
  return records;
};
