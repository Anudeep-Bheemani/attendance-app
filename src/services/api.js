import { API_URL } from '../config';

export const api = {
  async login(role, credentials) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, ...credentials })
    });
    return res.json();
  },

  async getStudents() {
    const res = await fetch(`${API_URL}/students`);
    return res.json();
  },

  async getAttendance(studentId) {
    const res = await fetch(`${API_URL}/attendance/${studentId}`);
    return res.json();
  }
};
