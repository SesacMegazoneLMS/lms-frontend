export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

export const API_ENDPOINTS = {
  GRADES: `${API_BASE_URL}/grades`,
  COURSES: `${API_BASE_URL}/courses`,
  STUDENTS: `${API_BASE_URL}/students`,
  PROFESSORS: `${API_BASE_URL}/professors`,
  ASSIGNMENTS: `${API_BASE_URL}/assignments`
};