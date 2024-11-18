import axios from 'axios';

const BASE_URL = 'http://localhost:8081'; // 백엔드 서버 주소

export const courseAPI = {
  // 교수의 강의 목록 조회
  getProfessorCourses: async (professorId, year, semester) => {
    try {
      if (!professorId) throw new Error('교수 ID가 필요합니다');
      const response = await axios.get(`${BASE_URL}/api/professor/${professorId}/courses`, {
        params: {
          year,
          semester
        }
      });

      // 응답 데이터가 배열인지 확인
      const courses = Array.isArray(response.data) ? response.data : [];

      // 현재 로그인한 교수의 강의만 필터링
      return courses.filter(course => course.professorId === professorId);
    } catch (error) {
      console.error('Error in getProfessorCourses:', error);
      throw error;
    }
  },

  // 특정 강의 상세 조회
  getCourse: async (courseId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error in getCourse:', error);
      throw error;
    }
  }
};

export default courseAPI;