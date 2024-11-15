export const currentUser = {
    id: '1',
    studentId: '2020123456',
    name: '김학생',
    department: '컴퓨터공학과',
    year: 3,
    semester: '2024-1',
    email: 'student@university.ac.kr'
  };
  
  export const enrollmentLimits = {
    maxCredits: 18,
    minCredits: 12,
    maxMajorCredits: 12,
    maxGeneralCredits: 6
  };
  
  export const enrollmentHistory = {
    '2024-1': [
      {
        id: '1',
        courseId: '1',
        status: 'confirmed',
        enrolledAt: '2024-02-15 10:30:22'
      }
    ]
  };