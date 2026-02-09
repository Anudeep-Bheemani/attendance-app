import React, { useState } from 'react';
import { Sparkles, Calendar, X, Loader2, PieChart, BarChart2, Users, Filter, MoreHorizontal, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, Legend, Sector } from 'recharts';
import { callGemini } from '../../services/gemini';
import { notifyAttendanceSaved } from '../../services/notificationService';
import RiskBadge from '../common/RiskBadge';

const LecturerDashboard = ({ user, students, attendanceData }) => {
  const [aiReport, setAiReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [activePieIndex, setActivePieIndex] = useState(null);
  const [branchFilter, setBranchFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState(user.branch || 'CSE');
  const [selectedYear, setSelectedYear] = useState('1');

  const subject = user.subjects?.[0] || 'General';
  const assignedClass = user.assignedClass || `${user.branch || 'CSE'}-${user.academicYear?.charAt(0) || '1'}`;
  
  const allBranches = [...new Set(students.map(s => s.branch))].filter(Boolean).sort();
  const allYears = ['1', '2', '3', '4'];
  
  const currentClass = `${selectedBranch}-${selectedYear}`;
  const classStudents = students.filter(s => s.branch === selectedBranch && s.batch?.includes(`202${8-parseInt(selectedYear)}`) || s.rollNo?.substring(0,2) === `2${8-parseInt(selectedYear)}`);
  
  const subjectRecords = attendanceData.filter(r => {
    const student = students.find(st => st.id === r.studentId);
    return r.subject === subject && student?.branch === selectedBranch;
  });
  
  const totalStudents = subjectRecords.length;
  if (totalStudents === 0) return <div className="p-8 text-center text-slate-400">No data available for {subject} in {currentClass}. Please enter attendance first.</div>;

  const totalConducted = subjectRecords[0]?.totalHours || 40;
  
  let safe = 0, warning = 0, critical = 0;
  let totalAttendedSum = 0;

  const studentStats = subjectRecords.map(record => {
    const attended = record.attendedHours;
    const pct = (attended / totalConducted) * 100;
    totalAttendedSum += pct;
    
    if (pct >= 75) safe++;
    else if (pct >= 65) warning++;
    else critical++;
    
    return { ...record, pct };
  });

  const branches = [...new Set(students.map(s => s.branch || s.rollNo?.substring(2, 5) || 'CSE'))].sort();
  const years = [...new Set(students.map(s => {
    const rollYear = s.rollNo?.substring(0, 2);
    return rollYear || s.batch?.substring(0, 4).slice(-2) || '24';
  }))].sort();

  const filteredStudents = studentStats.filter(s => {
    const student = students.find(st => st.id === s.studentId);
    const studentBranch = student?.branch || s.rollNo?.substring(2, 5) || 'CSE';
    const studentYear = s.rollNo?.substring(0, 2) || '24';
    
    const attendanceMatch = activeFilter === 'all' || 
      (activeFilter === 'safe' && s.pct >= 75) ||
      (activeFilter === 'warning' && s.pct >= 65 && s.pct < 75) ||
      (activeFilter === 'critical' && s.pct < 65);
    
    const branchMatch = branchFilter === 'all' || studentBranch === branchFilter;
    const yearMatch = yearFilter === 'all' || studentYear === yearFilter;
    
    return attendanceMatch && branchMatch && yearMatch;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'rank') return b.pct - a.pct;
    if (sortBy === 'name') return a.studentName.localeCompare(b.studentName);
    return 0;
  }).map((s, idx) => ({ ...s, rank: idx + 1 }));

  const avgAttendance = (totalAttendedSum / totalStudents).toFixed(1);

  const pieData = [
    { name: 'Safe', label: 'Safe (≥75%)', value: safe, color: '#22c55e', percentage: ((safe/totalStudents)*100).toFixed(1) },
    { name: 'Warning', label: 'Warning (65-75%)', value: warning, color: '#f97316', percentage: ((warning/totalStudents)*100).toFixed(1) },
    { name: 'Critical', label: 'Critical (<65%)', value: critical, color: '#ef4444', percentage: ((critical/totalStudents)*100).toFixed(1) },
  ];

  const distributionData = [
    { range: '0-50%', count: studentStats.filter(s => s.pct < 50).length },
    { range: '50-65%', count: studentStats.filter(s => s.pct >= 50 && s.pct < 65).length },
    { range: '65-75%', count: studentStats.filter(s => s.pct >= 65 && s.pct < 75).length },
    { range: '75-100%', count: studentStats.filter(s => s.pct >= 75).length },
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setShowReportModal(true);
    const prompt = `Generate a professional, short Monthly Attendance Report for the College Head of Department.
    Subject: ${subject}
    Class: CSE 2024-2028
    Total Students: ${totalStudents}
    Class Average Attendance: ${avgAttendance}%
    Safe Zone Students: ${safe}
    Warning Zone Students: ${warning}
    Critical Zone Students (<65%): ${critical}

    Please summarize the class performance, highlight the critical risk situation, and suggest 2 specific actions for the lecturer to improve attendance. Format with clear headings.`;

    const report = await callGemini(prompt);
    setAiReport(report);
    setIsGenerating(false);
  };

  const MetricCard = ({ title, value, subtext, type, active }) => {
    let baseStyles = "p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md";
    let typeStyles = "";
    
    if (active) {
      if (type === 'all') typeStyles = "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-300 ring-offset-2";
      if (type === 'safe') typeStyles = "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200 ring-2 ring-green-300 ring-offset-2";
      if (type === 'warning') typeStyles = "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200 ring-2 ring-orange-300 ring-offset-2";
      if (type === 'critical') typeStyles = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200 ring-2 ring-red-300 ring-offset-2";
    } else {
      if (type === 'all') typeStyles = "bg-white border-slate-200 hover:border-blue-300";
      if (type === 'safe') typeStyles = "bg-green-50 border-green-100 hover:border-green-300";
      if (type === 'warning') typeStyles = "bg-orange-50 border-orange-100 hover:border-orange-300";
      if (type === 'critical') typeStyles = "bg-red-50 border-red-100 hover:border-red-300";
    }

    return (
      <div 
        onClick={() => setActiveFilter(type)} 
        className={`${baseStyles} ${typeStyles}`}
      >
        <div className={`text-xs font-bold uppercase tracking-wider ${active ? 'text-white/80' : 'text-slate-500'}`}>{title}</div>
        <div className={`text-3xl font-black mt-2 ${active ? 'text-white' : 'text-slate-800'}`}>{value}</div>
        {subtext && <div className={`text-xs mt-1 ${active ? 'text-white/90' : 'text-slate-400'}`}>{subtext}</div>}
      </div>
    );
  };

  return (
     <div className="space-y-6 pb-12">
        <div className="sticky top-0 z-30 -mx-6 -mt-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 mx-4 mt-4 rounded-3xl shadow-xl border border-blue-200/50 backdrop-blur-sm">
            <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Users size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                    {currentClass}
                  </h1>
                  <p className="text-blue-600 text-sm font-medium mt-1">Class Overview & Analytics</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <select
                    className="px-3 py-2 border-2 border-blue-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none bg-white text-blue-700"
                    value={selectedBranch}
                    onChange={(e) => {
                      setSelectedBranch(e.target.value);
                      setBranchFilter(e.target.value);
                    }}
                  >
                    {allBranches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                  <select
                    className="px-3 py-2 border-2 border-blue-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none bg-white text-blue-700"
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(e.target.value);
                      const yearMap = {'1': '24', '2': '23', '3': '22', '4': '21'};
                      setYearFilter(yearMap[e.target.value]);
                    }}
                  >
                    {allYears.map(year => (
                      <option key={year} value={year}>Year {year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    const classStudentsWithRecords = students.filter(s => 
                      subjectRecords.some(r => r.studentId === s.id)
                    );
                    const result = notifyAttendanceSaved(classStudentsWithRecords, subjectRecords, []);
                    alert(`📧 Sent ${result.count} emails to students and parents!\n\nCheck console for email details.`);
                  }}
                  className="group relative flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-sm shadow-lg hover:scale-105 active:scale-95"
                >
                  <Bell size={18} />
                  <span>Send Reports</span>
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-sm shadow-lg hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Sparkles size={18} className="relative z-10 animate-pulse" />
                  <span className="relative z-10">AI Insight</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                </button>
                <div className="px-5 py-3 bg-white/60 backdrop-blur-md text-blue-700 rounded-2xl text-sm font-semibold border border-blue-200/50 flex items-center gap-2 shadow-md">
                  <Calendar size={16} />
                  Oct 2024
                </div>
              </div>
            </div>
          </div>
        </div>

        {showReportModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-purple-50">
                <h3 className="text-lg font-bold text-purple-800 flex items-center gap-2">
                  <Sparkles size={20} /> AI Insight Report
                </h3>
                <button onClick={() => setShowReportModal(false)} className="text-slate-500 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <Loader2 size={40} className="animate-spin mb-4 text-purple-500" />
                    <p>Analyzing class data...</p>
                  </div>
                ) : (
                  <div className="prose prose-purple max-w-none text-slate-700 whitespace-pre-line">
                    {aiReport}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <MetricCard 
             title="Total Students" 
             value={totalStudents} 
             subtext={`Avg: ${avgAttendance}%`} 
             type="all" 
             active={activeFilter === 'all'} 
           />
           <MetricCard 
             title="Safe Zone" 
             value={safe} 
             subtext="> 75%" 
             type="safe" 
             active={activeFilter === 'safe'} 
           />
           <MetricCard 
             title="Warning Zone" 
             value={warning} 
             subtext="65% - 75%" 
             type="warning" 
             active={activeFilter === 'warning'} 
           />
           <MetricCard 
             title="Critical Risk" 
             value={critical} 
             subtext="< 65%" 
             type="critical" 
             active={activeFilter === 'critical'} 
           />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                Attendance Distribution
                <PieChart size={18} className="text-slate-400" />
              </h3>
              <div className="h-72 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <RPieChart>
                    <Pie 
                      data={pieData} 
                      cx="50%"
                      cy="50%"
                      innerRadius={70} 
                      outerRadius={95} 
                      paddingAngle={3} 
                      dataKey="value"
                      activeIndex={activePieIndex}
                      activeShape={(props) => {
                        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
                        return (
                          <g>
                            <Sector
                              cx={cx}
                              cy={cy}
                              innerRadius={innerRadius}
                              outerRadius={outerRadius + 10}
                              startAngle={startAngle}
                              endAngle={endAngle}
                              fill={fill}
                            />
                            <Sector
                              cx={cx}
                              cy={cy}
                              innerRadius={outerRadius + 12}
                              outerRadius={outerRadius + 15}
                              startAngle={startAngle}
                              endAngle={endAngle}
                              fill={fill}
                              opacity={0.3}
                            />
                          </g>
                        );
                      }}
                      onMouseEnter={(_, index) => setActivePieIndex(index)}
                      onMouseLeave={() => setActivePieIndex(null)}
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          className="cursor-pointer transition-all duration-300"
                          style={{ filter: activePieIndex === index ? 'brightness(1.1)' : 'brightness(1)' }}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white px-4 py-3 rounded-lg shadow-xl border border-slate-200">
                              <p className="font-bold text-slate-800 mb-1">{data.label}</p>
                              <p className="text-2xl font-black" style={{ color: data.color }}>{data.value} students</p>
                              <p className="text-sm text-slate-500 mt-1">{data.percentage}% of class</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RPieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="text-center">
                      <span className="text-4xl font-black text-slate-800">{avgAttendance}%</span>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">Class Average</p>
                   </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {pieData.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
                    onMouseEnter={() => setActivePieIndex(idx)}
                    onMouseLeave={() => setActivePieIndex(null)}
                  >
                    <div className="w-3 h-3 rounded-full group-hover:scale-125 transition-transform" style={{ backgroundColor: item.color }}></div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-medium">{item.name}</p>
                      <p className="text-lg font-bold text-slate-800">{item.value}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600">{item.percentage}%</span>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
                 Performance Brackets
                 <BarChart2 size={18} className="text-slate-400" />
              </h3>
              <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="range" type="category" width={70} tick={{fontSize: 12}} />
                      <RechartsTooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32}>
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f97316' : index === 2 ? '#eab308' : '#22c55e'} />
                        ))}
                      </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-slate-500" />
                Student List
                <span className="text-xs font-normal text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full ml-2">
                  Showing {sortedStudents.length} Students
                </span>
             </h3>
             <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                >
                  <option value="all">All Branches</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
                <select
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>20{year}</option>
                  ))}
                </select>
                <select
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="rank">Sort by Rank</option>
                </select>
             </div>
           </div>
           
           <div className="overflow-x-auto">
              {filteredStudents.length > 0 ? (
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                       <tr>
                          {sortBy === 'rank' && <th className="px-6 py-4 w-20">Rank</th>}
                          <th className="px-6 py-4 w-1/3">Student Name</th>
                          <th className="px-6 py-4 w-1/4">Status</th>
                          <th className="px-6 py-4">Attendance Progress</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {sortedStudents.map(s => (
                          <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                             {sortBy === 'rank' && (
                               <td className="px-6 py-4">
                                 <span className={`font-bold ${s.rank <= 3 ? 'text-amber-500' : 'text-slate-400'}`}>
                                   #{s.rank}
                                 </span>
                               </td>
                             )}
                             <td className="px-6 py-4">
                                <div className="font-bold text-base text-slate-800">{s.studentName}</div>
                                <div className="text-sm text-slate-500 font-mono">{s.rollNo}</div>
                             </td>
                             <td className="px-6 py-4">
                                <RiskBadge percent={s.pct} />
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <span className="font-bold text-slate-700 w-12">{s.pct.toFixed(1)}%</span>
                                   <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[100px]">
                                      <div 
                                        className={`h-full rounded-full ${s.pct >= 75 ? 'bg-green-500' : s.pct >= 65 ? 'bg-orange-500' : 'bg-red-500'}`}
                                        style={{ width: `${s.pct}%` }}
                                      />
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                                   <MoreHorizontal size={18} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              ) : (
                 <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                       <Filter size={24} className="text-slate-300" />
                    </div>
                    <p className="font-medium">No students match the current filter.</p>
                    <button 
                      onClick={() => {
                        setActiveFilter('all');
                        setBranchFilter('all');
                        setYearFilter('all');
                      }}
                      className="mt-2 text-blue-600 hover:underline text-sm"
                    >
                      Clear All Filters
                    </button>
                 </div>
              )}
           </div>
        </div>
     </div>
  );
};

export default LecturerDashboard;
