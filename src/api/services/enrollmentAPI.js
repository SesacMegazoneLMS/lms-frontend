export const enrollmentAPI = {
    // 수강신청
    enrollCourse: async (studentId, courseId) => {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, courseId })
      });
      if (!response.ok) throw new Error('Failed to enroll in course');
      return response.json();
    },
    
    getEnrollments: async () => {
      const response = await fetch('/api/enrollments');
      if (!response.ok) throw new Error('Failed to fetch enrollments');
      return response.json();
    },
    
    // 수강 취소
    dropCourse: async (enrollmentId) => {
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to drop course');
      return response.json();
    },
  
    // 학생의 수강 목록 조회
    getStudentEnrollments: async (studentId) => {
      const response = await fetch(`/api/students/${studentId}/enrollments`);
      if (!response.ok) throw new Error('Failed to fetch student enrollments');
      return response.json();
    },
  
    // 수강신청 가능 여부 확인
    checkEnrollmentEligibility: async (studentId, courseId) => {
      const response = await fetch(`/api/enrollments/check?studentId=${studentId}&courseId=${courseId}`);
      if (!response.ok) throw new Error('Failed to check enrollment eligibility');
      return response.json();
    },
  
    // 선수과목 확인
    checkPrerequisites: async (studentId, courseId) => {
      const response = await fetch(`/api/enrollments/prerequisites?studentId=${studentId}&courseId=${courseId}`);
      if (!response.ok) throw new Error('Failed to check prerequisites');
      return response.json();
    },
  
    // 시간표 충돌 확인
    checkTimeConflict: async (studentId, courseId) => {
      const response = await fetch(`/api/enrollments/timeconflict?studentId=${studentId}&courseId=${courseId}`);
      if (!response.ok) throw new Error('Failed to check time conflict');
      return response.json();
    },

    // 학생 상태 조회
    getStatus: async () => {
      // 예시: mock 데이터 반환
      return {
        user: {
          id: 1,
          semester: '2024-1', // 예시 데이터
        },
      };
    },

    // 학생의 수강 내역 조회
    getHistory: async (semester, studentId) => {
        const response = await fetch(`/api/students/history?semester=${semester}&studentId=${studentId}`);
        if (!response.ok) throw new Error('Failed to fetch enrollment history');
        return response.json();
    }
};
  
export default enrollmentAPI;