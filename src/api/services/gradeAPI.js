import { API_BASE_URL } from '../config';

export const gradeAPI = {
  // 강의별 성적 조회
  getGradesByCourse: async (courseName, semester, year) => {
    const response = await fetch(
      `${API_BASE_URL}/grades/course?courseName=${courseName}&semester=${semester}&year=${year}`
    );
    if (!response.ok) throw new Error('성적 조회에 실패했습니다');
    return response.json();
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