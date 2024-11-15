// 학생 기본 데이터
export const students = [
  {
    id: 1,
    username: 'student1', 
    name: '홍길동',
    email: 'student1@university.ac.kr',
    department: '컴퓨터공학과',
    year: 2,
    semester: '2024-1',
    status: 'active',
    enrolledCourses: ['CSE101', 'CSE102', 'CSE103'],
    role: 'student'
  },
  {
    id: 2,
    username: 'student2',
    name: '김학생', 
    email: 'student2@university.ac.kr',
    department: '컴퓨터공학과',
    year: 3,
    semester: '2024-1',
    status: 'active',
    enrolledCourses: ['CSE101', 'CSE104'],
    role: 'student'
  }
];

// 대시보드용 데이터
export const studentDashboardData = {
  enrolledCourses: [
    {
      id: 1,
      name: '웹 프로그래밍',
      professor: '김교수',
      schedule: '월,수 10:30-12:00',
      room: '공학관 401호',
      progress: 85,
      attendance: 95
    },
    {
      id: 2,
      name: '데이터베이스',
      professor: '이교수',
      schedule: '화,목 13:30-15:00',
      room: '공학관 502호',
      progress: 80,
      attendance: 92
    },
    {
      id: 3,
      name: '알고리즘',
      professor: '박교수',
      schedule: '화,금 15:30-17:00',
      room: '공학관 303호',
      progress: 75,
      attendance: 88
    }
  ],
  weeklySchedule: [
    {
      day: '월요일',
      title: '웹 프로그래밍 중간고사',
      time: '10:30 - 12:00'
    },
    {
      day: '수요일',
      title: '데이터베이스 팀 프로젝트 발표',
      time: '13:30 - 15:00'
    },
    {
      day: '금요일',
      title: '알고리즘 과제 제출',
      time: '15:30 - 17:00'
    }
  ],
  notices: [
    {
      id: 1,
      type: '공지',
      title: '2024-1학기 중간고사 일정 안내',
      date: '2024.03.15'
    },
    {
      id: 2,
      type: '과제',
      title: '웹 프로그래밍 과제 3 공지',
      date: '2024.03.14'
    },
    {
      id: 3,
      type: '행사',
      title: '학술제 참가 신청 안내',
      date: '2024.03.12'
    }
  ],
  todos: [
    {
      id: 1,
      title: '웹 프로그래밍 과제 제출',
      description: 'React 컴포넌트 구현',
      dueDate: '2024-03-20',
      priority: 'high',
      daysLeft: 2
    },
    {
      id: 2,
      title: '데이터베이스 중간고사',
      description: '1-7장 범위',
      dueDate: '2024-03-23',
      priority: 'medium',
      daysLeft: 5
    },
    {
      id: 3,
      title: '알고리즘 팀 프로젝트',
      description: '정렬 알고리즘 구현',
      dueDate: '2024-03-25',
      priority: 'low',
      daysLeft: 7
    }
  ],
  stats: {
    totalCourses: 6,
    averageAttendance: 94.5,
    submittedAssignments: '12/15',
    upcomingExams: 3
  }
};