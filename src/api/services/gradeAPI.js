import { API_BASE_URL } from '../config';

export const gradeAPI = {
  // 강의별 성적 조회
  getGradesByCourse: async (courseCode, semester, year) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/grades/course?courseCode=${courseCode}&semester=${semester}&year=${year}`
      );
      if (!response.ok) throw new Error('성적 조회에 실패했습니다');
      return response.json();
    } catch (error) {
      console.error('Error fetching grades:', error);
      return [];
    }
  },

  // 성적 일괄 수정
  updateGrades: async (updateRequests) => {
    const response = await fetch(`${API_BASE_URL}/grades/scores/batch`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateRequests)
    });
    if (!response.ok) throw new Error('성적 수정에 실패했습니다');
    return response.json();
  }
};