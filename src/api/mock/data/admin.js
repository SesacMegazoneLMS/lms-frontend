export const dashboardStats = {
  totalStudents: 1200,
  totalProfessors: 80,
  totalCourses: 150,
  activeEnrollments: 3000,
  recentActivities: [
    {
      id: 1,
      type: 'enrollment',
      description: '홍길동님이 프로그래밍 기초 과목을 수강신청 하였습니다.',
      timestamp: '2024-03-20T09:00:00Z'
    },
    {
      id: 2, 
      type: 'grade',
      description: '김교수님이 자료구조 과목의 성적을 등록하였습니다.',
      timestamp: '2024-03-19T15:30:00Z'
    },
    {
      id: 3,
      type: 'notice',
      description: '2024학년도 1학기 중간고사 일정이 공지되었습니다.',
      timestamp: '2024-03-18T11:00:00Z'
    }
  ]
};

export const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@sesac.ac.kr',
    role: 'admin',
    name: '관리자',
    department: '시스템관리부',
    status: 'active'
  },
  {
    id: 2,
    username: 'professor1',
    email: 'kim@sesac.ac.kr', 
    role: 'professor',
    name: '김교수',
    department: '컴퓨터공학과',
    status: 'active'
  },
  {
    id: 3,
    username: 'student1',
    email: 'hong@sesac.ac.kr',
    role: 'student', 
    name: '홍길동',
    department: '컴퓨터공학과',
    status: 'active'
  }
];

// 전체 데이터를 하나의 객체로 export
export const mockData = {
  dashboardStats,
  users
};