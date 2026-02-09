import React, { useState } from 'react';
import AppShell from './components/common/AppShell';
import LandingPage from './components/common/LandingPage';
import StudentDashboard from './components/student/StudentDashboard';
import ClassAttendanceView from './components/student/ClassAttendanceView';
import StudentProfile from './components/student/StudentProfile';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminStaffManager from './components/admin/AdminStaffManager';
import AdminStudentManagement from './components/admin/AdminStudentManagement';
import AdminBranchManager from './components/admin/AdminBranchManager';
import LecturerDashboard from './components/lecturer/LecturerDashboard';
import AttendanceEntry from './components/lecturer/AttendanceEntry';
import LecturerRecordManager from './components/lecturer/LecturerRecordManager';
import SubjectManager from './components/common/SubjectManager';
import { INITIAL_STUDENTS, INITIAL_STAFF, INITIAL_ADMIN, INITIAL_BRANCHES, SUBJECTS } from './constants';
import { generateMockAttendance } from './utils';

const MainApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [subjects, setSubjects] = useState(SUBJECTS);
  const [attendanceData, setAttendanceData] = useState(() => generateMockAttendance(INITIAL_STUDENTS, SUBJECTS));

  const handleLogin = (role, credentials) => {
    let user = null;
    
    if (role === 'student' || role === 'parent') {
      const student = students.find(s => s.rollNo === credentials.id || s.email === credentials.id);
      if (student && student.password === credentials.password) {
         user = role === 'parent' 
           ? { ...student, id: 'P-'+student.id, role: 'parent', name: `Parent of ${student.name}`, childId: student.id } 
           : student;
      }
    } else if (role === 'lecturer') {
      user = staffList.find(s => s.email === credentials.id && s.password === credentials.password);
    } else if (role === 'admin') {
      user = INITIAL_ADMIN.find(a => a.email === credentials.id && a.password === credentials.password);
    }

    if (user) {
      setCurrentUser(user);
      setActiveView('dashboard');
    } else {
      alert("Invalid credentials. Try the demo accounts.");
    }
  };

  const handleVerifyStudent = (email, newPassword) => {
    setStudents(prev => prev.map(s => {
      if (s.email === email) {
        return { ...s, password: newPassword, verified: true };
      }
      return s;
    }));
  };

  const handleUpdateAttendance = (studentId, subject, field, value) => {
    setAttendanceData(prev => {
      const existingIndex = prev.findIndex(r => r.studentId === studentId && r.subject === subject);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], [field]: value };
        return updated;
      } else {
        return prev;
      }
    });
  };

  const handleUpdateProfile = (updatedStudent) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    if (currentUser.id === updatedStudent.id) {
       setCurrentUser(updatedStudent);
    }
    alert("Profile updated successfully!");
  };

  const renderContent = () => {
    if (!currentUser) return <LandingPage onLogin={handleLogin} onVerify={handleVerifyStudent} />;

    switch (currentUser.role) {
      case 'admin':
        if (activeView === 'student-management') return <AdminStudentManagement students={students} setStudents={setStudents} branches={branches} />;
        if (activeView === 'staff-management') return <AdminStaffManager staffList={staffList} setStaffList={setStaffList} />;
        if (activeView === 'branch-management') return <AdminBranchManager branches={branches} setBranches={setBranches} />;
        if (activeView === 'subject-management') return <SubjectManager subjects={subjects} setSubjects={setSubjects} branches={branches} />;
        if (activeView === 'reports') return <div className="p-8 text-center text-slate-400">Reports feature coming soon...</div>;
        if (activeView === 'settings') return <div className="p-8 text-center text-slate-400">Settings feature coming soon...</div>;
        return <AdminDashboard students={students} attendanceData={attendanceData} staffList={staffList} />;
      
      case 'lecturer':
        if (activeView === 'entry') return <AttendanceEntry students={students} attendanceData={attendanceData} updateAttendance={handleUpdateAttendance} branches={branches} staffList={staffList} />;
        if (activeView === 'manage-records') return <LecturerRecordManager students={students} setStudents={setStudents} branches={branches} setBranches={setBranches} />;
        if (activeView === 'subject-management') return <SubjectManager subjects={subjects} setSubjects={setSubjects} branches={branches} />;
        return <LecturerDashboard user={currentUser} students={students} attendanceData={attendanceData} />;

      case 'student':
        if (activeView === 'classmates') return <ClassAttendanceView currentUser={currentUser} allStudents={students} attendanceData={attendanceData} />;
        if (activeView === 'profile') return <StudentProfile student={currentUser} />;
        return <StudentDashboard student={currentUser} attendanceData={attendanceData} onUpdateProfile={handleUpdateProfile} isReadOnly={false} />;

      case 'parent':
        const child = students.find(s => s.id === currentUser.childId);
        return <StudentDashboard student={child} attendanceData={attendanceData} isReadOnly={true} />;
      
      default:
        return <div>Unknown Role</div>;
    }
  };

  if (!currentUser) return <LandingPage onLogin={handleLogin} onVerify={handleVerifyStudent} darkMode={darkMode} setDarkMode={setDarkMode} />;

  return (
    <AppShell 
      user={currentUser} 
      onLogout={() => setCurrentUser(null)} 
      activeView={activeView}
      setActiveView={setActiveView}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    >
      {renderContent()}
    </AppShell>
  );
};

export default MainApp;
