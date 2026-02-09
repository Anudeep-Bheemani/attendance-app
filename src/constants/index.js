export const INITIAL_BRANCHES = ["CSE", "ECE", "MECH", "CIVIL", "EEE"];

export const YEAR_BATCH_MAP = {
  "1": "2024-2028",
  "2": "2023-2027",
  "3": "2022-2026",
  "4": "2021-2025"
};

export const BATCHES = Object.values(YEAR_BATCH_MAP);

export const SUBJECTS = {
  CSE: ["Data Structures", "Operating Systems", "DBMS", "AI/ML", "Networks"],
  ECE: ["Signals & Systems", "Digital Electronics", "Control Systems", "VLSI"],
};

export const INITIAL_STUDENTS = [
  // CSE Students (2024 batch)
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `S${2024000 + i}`,
    role: 'student',
    name: `Student ${i + 1}`,
    email: `student${i + 1}@college.edu`,
    password: 'pass',
    rollNo: `24CSE${101 + i}`,
    branch: "CSE",
    batch: "2024-2028", 
    dob: "2004-05-15",
    phone: "9876543210",
    guardianName: `Parent of Student ${i + 1}`, 
    guardianPhone: "9988776655",
    verified: true
  })),
  // ECE Students (2023 batch)
  ...Array.from({ length: 4 }).map((_, i) => ({
    id: `S${2023000 + i}`,
    role: 'student',
    name: `ECE Student ${i + 1}`,
    email: `ece.student${i + 1}@college.edu`,
    password: 'pass',
    rollNo: `23ECE${101 + i}`,
    branch: "ECE",
    batch: "2023-2027", 
    dob: "2003-05-15",
    phone: "9876543210",
    guardianName: `Parent of ECE Student ${i + 1}`, 
    guardianPhone: "9988776655",
    verified: true
  })),
  // MECH Students (2024 batch)
  ...Array.from({ length: 3 }).map((_, i) => ({
    id: `S${2024100 + i}`,
    role: 'student',
    name: `MECH Student ${i + 1}`,
    email: `mech.student${i + 1}@college.edu`,
    password: 'pass',
    rollNo: `24MECH${101 + i}`,
    branch: "MECH",
    batch: "2024-2028", 
    dob: "2004-05-15",
    phone: "9876543210",
    guardianName: `Parent of MECH Student ${i + 1}`, 
    guardianPhone: "9988776655",
    verified: true
  })),
  // CSE Students (2022 batch)
  ...Array.from({ length: 3 }).map((_, i) => ({
    id: `S${2022000 + i}`,
    role: 'student',
    name: `Senior CSE Student ${i + 1}`,
    email: `senior.cse${i + 1}@college.edu`,
    password: 'pass',
    rollNo: `22CSE${101 + i}`,
    branch: "CSE",
    batch: "2022-2026", 
    dob: "2002-05-15",
    phone: "9876543210",
    guardianName: `Parent of Senior CSE Student ${i + 1}`, 
    guardianPhone: "9988776655",
    verified: true
  }))
];

export const INITIAL_STAFF = [
  { id: 'L1', role: 'lecturer', name: "Prof. Alan Turing", email: "alan@college.edu", password: "pass", subjects: ["AI/ML", "Data Structures"] },
  { id: 'L2', role: 'lecturer', name: "Prof. Grace Hopper", email: "grace@college.edu", password: "pass", subjects: ["Operating Systems", "DBMS"] },
];

export const INITIAL_ADMIN = [
  { id: 'A1', role: 'admin', name: "Administrator", email: "admin@college.edu", password: "admin" }
];
