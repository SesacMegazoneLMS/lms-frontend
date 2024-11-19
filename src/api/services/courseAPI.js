import { professors } from '../mock/data/professors'
import { courses } from '../mock/data/courses'

export const courseAPI = {
  // 모든 강의 조회
  getAllCourses: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`/api/courses?${params}`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  // 특정 강의 조회
  getCourses: async () => {
    const response = await fetch(`/api/courses/`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  // 모든 강의 조회
  getAllCourses: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`/api/courses?${params}`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  // 특정 강의 조회
  getCourses: async () => {
    const response = await fetch(`/api/courses/`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  // 특정 강의 상세 조회
  getCourse: async (courseId) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }
      return response.json();

    } catch (error) {
      console.error('Error in getCourse:', error);
      throw new Error('Failed to fetch course details');
    }
  },

  // 교수의 강의 목록 조회
  getProfessorCourses: async () => {
    try {
      const currentProfessor = professors[0]
      if (!currentProfessor?.courses) {
        return []
      }
      return currentProfessor.courses
    } catch (error) {
      console.error('Error in getProfessorCourses:', error)
      throw new Error('Failed to fetch professor courses')
    }
  },

  // 새 강의 생성
  createCourse: async (courseData) => {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
  },

  // 강의 정보 수정
  updateCourse: async (id, updates) => {
    const response = await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update course');
    return response.json();
  },

  // 강의 삭제
  deleteCourse: async (id) => {
    const response = await fetch(`/api/courses/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete course');
    return response.json();
  },

  // 강의 수강생 목록 조회
  getCourseStudents: async (courseId) => {
    const response = await fetch(`/api/courses/${courseId}/enrollments`);
    if (!response.ok) throw new Error('Failed to fetch course students');
    return response.json();
  }
};

export default courseAPI;