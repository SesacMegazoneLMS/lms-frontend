import axios from 'axios';

export const gradeAPI = {
  getCourseGrades: (courseId, semester, professorId, year) => {
    return axios.get('/grades/course', {
      params: {
        courseId,
        semester,
        professorId,
        year
      }
    });
  },

  updateGrades: (courseId, grades) => {
    return axios.put(`/grades/scores/batch`, {
      courseId,
      grades
    });
  }
};

export default gradeAPI;