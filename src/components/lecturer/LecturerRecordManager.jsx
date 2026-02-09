import React, { useState } from 'react';
import { Plus, Edit3, Trash2, CheckCircle, X, Save, User, Mail, Phone, Layers, Calendar, Filter } from 'lucide-react';
import { BATCHES } from '../../constants';

const LecturerRecordManager = ({ students, setStudents, branches, setBranches }) => {
  const [activeTab, setActiveTab] = useState('students');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    name: '',
    rollNo: '',
    email: '',
    phone: '',
    branch: 'CSE',
    batch: '2024-2028',
    dob: '',
    guardianName: '',
    guardianPhone: ''
  });
  const [branchInput, setBranchInput] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  const allYears = [...new Set(students.map(s => s.batch?.substring(0, 4) || '2024'))].sort();
  
  const filteredStudents = students.filter(s => {
    const branchMatch = filterBranch === 'all' || s.branch === filterBranch;
    const batchYear = s.batch?.substring(0, 4);
    const yearMap = {'2024': '1', '2023': '2', '2022': '3', '2021': '4'};
    const studentYear = yearMap[batchYear] || '1';
    const yearMatch = filterYear === 'all' || studentYear === filterYear;
    return branchMatch && yearMatch;
  });

  const handleAdd = () => {
    setEditMode(false);
    setCurrentStudent({
      name: '',
      rollNo: '',
      email: '',
      phone: '',
      branch: 'CSE',
      batch: '2024-2028',
      dob: '',
      guardianName: '',
      guardianPhone: ''
    });
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setEditMode(true);
    setCurrentStudent(student);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editMode) {
      setStudents(prev => prev.map(s => s.id === currentStudent.id ? currentStudent : s));
      alert('Student updated successfully!');
    } else {
      setStudents(prev => [...prev, {
        ...currentStudent,
        id: `S${Date.now()}`,
        role: 'student',
        password: 'pass',
        verified: false
      }]);
      alert('Student added! They can now verify their account using email.');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
      alert('Student deleted successfully!');
    }
  };

  const handleAddBranch = () => {
    if (branchInput && !branches.includes(branchInput)) {
      setBranches(prev => [...prev, branchInput]);
      setBranchInput('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit">
        <button onClick={() => setActiveTab('students')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'students' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Manage Students</button>
        <button onClick={() => setActiveTab('branches')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'branches' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Manage Branches</button>
      </div>

      {activeTab === 'students' ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-xl">Student Records</h3>
              <p className="text-slate-500 text-sm mt-1">Manage student information</p>
            </div>
            <div className="flex gap-2 items-center">
              <select
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
              >
                <option value="all">All Branches</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="all">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-md transition-colors"
              >
                <Plus size={18} />
                Add Student
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Roll No</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Branch</th>
                  <th className="px-6 py-4">Year</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Verified</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-600 font-medium">{s.rollNo}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{s.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        {s.branch}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {(() => {
                        const yearMap = {'2024': '1st Yr', '2023': '2nd Yr', '2022': '3rd Yr', '2021': '4th Yr'};
                        return yearMap[s.batch?.substring(0, 4)] || '1st Yr';
                      })()}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{s.email}</td>
                    <td className="px-6 py-4">
                      {s.verified ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle size={14}/> Yes
                        </span>
                      ) : (
                        <span className="text-orange-500">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(s)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Filter size={32} className="mb-2" />
                        <p className="font-medium">No students match the current filter</p>
                        <button
                          onClick={() => {
                            setFilterBranch('all');
                            setFilterYear('all');
                          }}
                          className="mt-2 text-blue-600 hover:underline text-sm"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-lg">
          <h3 className="font-bold text-slate-800 mb-4">Manage Branches</h3>
          <div className="flex gap-2 mb-6">
            <input className="flex-1 p-2 border rounded" placeholder="New Branch Name (e.g. IT)" value={branchInput} onChange={e => setBranchInput(e.target.value)} />
            <button onClick={handleAddBranch} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add</button>
          </div>
          <ul className="space-y-2">
            {branches.map((b, i) => (
              <li key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                <span className="font-medium">{b}</span>
                <button className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">
                {editMode ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <User size={14} /> Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentStudent.name}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentStudent.rollNo}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, rollNo: e.target.value })}
                    placeholder="24CSE101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Mail size={14} /> Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentStudent.email}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                    placeholder="student@college.edu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Phone size={14} /> Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentStudent.phone}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
                    placeholder="9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Layers size={14} /> Branch
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentStudent.branch}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, branch: e.target.value })}
                  >
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Calendar size={14} /> Year
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={(() => {
                      const yearMap = {'2024-2028': '1', '2023-2027': '2', '2022-2026': '3', '2021-2025': '4'};
                      return yearMap[currentStudent.batch] || '1';
                    })()}
                    onChange={(e) => {
                      const batchMap = {'1': '2024-2028', '2': '2023-2027', '3': '2022-2026', '4': '2021-2025'};
                      setCurrentStudent({ ...currentStudent, batch: batchMap[e.target.value] });
                    }}
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentStudent.dob}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, dob: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentStudent.guardianName}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, guardianName: e.target.value })}
                    placeholder="Parent Name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Guardian Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentStudent.guardianPhone}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, guardianPhone: e.target.value })}
                    placeholder="9988776655"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save size={16} />
                {editMode ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerRecordManager;
