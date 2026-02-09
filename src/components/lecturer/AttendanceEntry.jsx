import React, { useState, useEffect } from 'react';
import { Calendar, Layers, BookOpen, Clock, ChevronDown, Search, Save, Loader2, Eye, X, Filter, Activity, AlertTriangle, CheckCircle, Users, TrendingUp, Zap } from 'lucide-react';
import { YEAR_BATCH_MAP, SUBJECTS, INITIAL_BRANCHES } from '../../constants';
import { calculatePercentage, predictHours } from '../../utils';
import RiskBadge from '../common/RiskBadge';
import { notifyAttendanceSaved } from '../../services/notificationService';

const AttendanceEntry = ({ students, attendanceData, updateAttendance, branches }) => {
  const [selectedYear, setSelectedYear] = useState("1"); 
  const [selectedBranch, setSelectedBranch] = useState("CSE");
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS.CSE[0]);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [classTotalHours, setClassTotalHours] = useState(40); 
  const [isSaving, setIsSaving] = useState(false);
  const [bulkValue, setBulkValue] = useState('');
  const [showStats, setShowStats] = useState(true); 

  const branchOptions = branches || INITIAL_BRANCHES;
  const selectedBatch = YEAR_BATCH_MAP[selectedYear];

  const classStudents = students.filter(s => s.branch === selectedBranch && s.batch === selectedBatch);
  
  const filteredStudents = classStudents.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (filteredStudents.length > 0) {
      const firstRecord = attendanceData.find(r => r.studentId === filteredStudents[0].id && r.subject === selectedSubject);
      if (firstRecord) {
        setClassTotalHours(firstRecord.totalHours);
      }
    }
  }, [selectedYear, selectedBranch, selectedSubject, attendanceData]); 

  const handleAttendanceChange = (studentId, field, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue > classTotalHours) {
      alert(`Attended hours cannot exceed total class hours (${classTotalHours})`);
      return;
    }
    updateAttendance(studentId, selectedSubject, field, numValue);
  };

  const handleClassTotalChange = (e) => {
    const newVal = parseInt(e.target.value) || 0;
    setClassTotalHours(newVal);
    
    filteredStudents.forEach(student => {
      updateAttendance(student.id, selectedSubject, 'totalHours', newVal);
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(`Attendance for ${selectedSubject} has been successfully saved!\n\n📧 Note: Monthly attendance reports will be sent to students and parents at the start of next month after all subjects are completed.`);
    }, 1000);
  };

  const classStats = {
    total: filteredStudents.length,
    present: filteredStudents.filter(s => {
      const record = attendanceData.find(r => r.studentId === s.id && r.subject === selectedSubject);
      return record && calculatePercentage(record.attendedHours, classTotalHours) >= 75;
    }).length,
    warning: filteredStudents.filter(s => {
      const record = attendanceData.find(r => r.studentId === s.id && r.subject === selectedSubject);
      const pct = calculatePercentage(record?.attendedHours || 0, classTotalHours);
      return pct >= 65 && pct < 75;
    }).length,
    critical: filteredStudents.filter(s => {
      const record = attendanceData.find(r => r.studentId === s.id && r.subject === selectedSubject);
      return calculatePercentage(record?.attendedHours || 0, classTotalHours) < 65;
    }).length
  };

  const handleBulkUpdate = () => {
    if (!bulkValue || bulkValue === '') return;
    const val = parseInt(bulkValue);
    if (val > classTotalHours) {
      alert(`Value cannot exceed ${classTotalHours}`);
      return;
    }
    filteredStudents.forEach(student => {
      updateAttendance(student.id, selectedSubject, 'attendedHours', val);
    });
    setBulkValue('');
    alert(`Updated ${filteredStudents.length} students!`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 rounded-2xl border border-blue-100 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Attendance Entry</h2>
              <p className="text-sm text-slate-500">Mark attendance for {selectedSubject}</p>
            </div>
          </div>
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            {showStats ? 'Hide' : 'Show'} Stats
          </button>
        </div>

        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Users size={16} className="text-blue-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase">Total</span>
              </div>
              <p className="text-2xl font-black text-slate-800">{classStats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-xs font-semibold text-green-700 uppercase">Safe</span>
              </div>
              <p className="text-2xl font-black text-green-700">{classStats.present}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={16} className="text-orange-600" />
                <span className="text-xs font-semibold text-orange-700 uppercase">Warning</span>
              </div>
              <p className="text-2xl font-black text-orange-700">{classStats.warning}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-red-600" />
                <span className="text-xs font-semibold text-red-700 uppercase">Critical</span>
              </div>
              <p className="text-2xl font-black text-red-700">{classStats.critical}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          <div className="relative group md:w-40">
            <Calendar className="absolute left-3 top-2.5 text-slate-500 z-10" size={16} />
            <select 
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:bg-slate-100 cursor-pointer"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
          </div>

          <div className="relative group md:w-40">
            <Layers className="absolute left-3 top-2.5 text-slate-500 z-10" size={16} />
            <select 
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:bg-slate-100 cursor-pointer"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
          </div>

          <div className="relative group flex-1 min-w-[200px]">
            <BookOpen className="absolute left-3 top-2.5 text-slate-500 z-10" size={16} />
            <select 
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium appearance-none outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:bg-slate-100 cursor-pointer"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {SUBJECTS.CSE.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
          </div>

          <div className="relative group md:w-40">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="text-blue-600" size={18} />
              </div>
              <input 
                type="number"
                min="1"
                className="block w-full pl-10 pr-3 py-2.5 bg-blue-50 border-2 border-blue-300 rounded-lg text-sm font-bold text-blue-700 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                value={classTotalHours}
                onChange={handleClassTotalChange}
                placeholder="Total Hours"
              />
            </div>
            <label className="text-xs font-semibold text-blue-600 mt-1 block text-center">Total Class Hours</label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch lg:w-auto border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save Data</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-700">Bulk Update:</span>
        <input
          type="number"
          placeholder="Hours"
          className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          value={bulkValue}
          onChange={(e) => setBulkValue(e.target.value)}
        />
        <button
          onClick={handleBulkUpdate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Apply to All Students
        </button>
      </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 font-bold border-b-2 border-slate-300">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4 w-32">Attended</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 w-20">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(student => {
                    const record = attendanceData.find(r => r.studentId === student.id && r.subject === selectedSubject) || {
                      totalHours: 40, attendedHours: 0
                    };
                    const percent = calculatePercentage(record.attendedHours, classTotalHours);

                    return (
                      <tr key={student.id} className="hover:bg-blue-50 transition-all duration-200 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-base">{student.name}</div>
                              <div className="text-sm text-slate-500 font-medium">{student.rollNo}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              min="0"
                              max={classTotalHours}
                              className="w-20 px-3 py-2 border-2 border-slate-300 rounded-lg text-center font-bold text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all hover:border-blue-400"
                              value={record.attendedHours === 0 ? '' : record.attendedHours}
                              placeholder="0"
                              onChange={(e) => handleAttendanceChange(student.id, 'attendedHours', e.target.value)}
                              onBlur={(e) => {
                                if (e.target.value === '') {
                                  handleAttendanceChange(student.id, 'attendedHours', '0');
                                }
                              }}
                            />
                            <span className="text-slate-400 font-medium">/ {classTotalHours}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <RiskBadge percent={percent} />
                            <div className="flex-1 max-w-[120px]">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-700">{percent}%</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${percent >= 75 ? 'bg-green-500' : percent >= 65 ? 'bg-orange-500' : 'bg-red-500'}`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => setSelectedStudent(student)}
                            className="text-blue-500 hover:text-white p-2 bg-blue-50 hover:bg-blue-600 rounded-lg transition-all shadow-sm hover:shadow-md group-hover:scale-110"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center">
              <Filter size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">No students found</p>
              <p className="text-sm">Try adjusting the Year, Branch, or Search filters.</p>
            </div>
          )}
        </div>

        {selectedStudent && (
          <div className="w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-6 fixed right-0 top-16 bottom-0 z-40 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800">Student Details</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 border-4 border-white shadow-lg">
                {selectedStudent.name.charAt(0)}
              </div>
              <h4 className="font-bold text-slate-900 text-lg">{selectedStudent.name}</h4>
              <p className="text-sm text-slate-500 font-medium">{selectedStudent.rollNo}</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="text-xs text-slate-500 uppercase tracking-wide font-bold">Branch & Year</label>
                <div className="flex items-center gap-2 mt-1">
                  <Layers size={14} className="text-blue-500" />
                  <p className="font-medium text-slate-700">{selectedStudent.branch} • {(() => {
                    const yearMap = {'2024': '1st Yr', '2023': '2nd Yr', '2022': '3rd Yr', '2021': '4th Yr'};
                    return yearMap[selectedStudent.batch?.substring(0, 4)] || '1st Yr';
                  })()}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="text-xs text-slate-500 uppercase tracking-wide font-bold">Contact</label>
                <p className="font-medium text-slate-700 mt-1">{selectedStudent.phone}</p>
                <p className="text-slate-500 text-xs">{selectedStudent.email}</p>
              </div>
               
               <div className="mt-6 pt-6 border-t border-slate-100">
                 <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <Activity size={16} className="text-blue-500" /> Performance
                 </h5>
                  {(() => {
                    const studentRecords = attendanceData.filter(r => r.studentId === selectedStudent.id);
                    const totalC = studentRecords.reduce((acc, curr) => acc + curr.totalHours, 0);
                    const totalA = studentRecords.reduce((acc, curr) => acc + curr.attendedHours, 0);
                    const overallP = calculatePercentage(totalA, totalC);
                    const n75 = predictHours(totalA, totalC, 0.75);

                    return (
                      <div className="space-y-4">
                        <div className="bg-slate-800 p-4 rounded-xl text-center text-white relative overflow-hidden">
                           <div className="relative z-10">
                            <div className="text-xs text-slate-400 uppercase font-bold">Overall Attendance</div>
                            <div className="text-3xl font-black mt-1">{overallP}%</div>
                           </div>
                           <Activity className="absolute right-2 bottom-2 text-slate-700 opacity-20" size={48} />
                        </div>

                        {overallP < 75 && (
                          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                            <div className="flex items-start gap-2">
                              <AlertTriangle size={16} className="text-orange-500 mt-0.5 shrink-0" />
                              <div className="text-xs text-slate-700 leading-relaxed">
                                Needs <strong>{n75} hours</strong> (aggregate) to reach Safe Zone.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceEntry;
