import { scheduleStrings } from './schedules';
export const courses = [

  {
    id: 1,
    name: '웹 프로그래밍',
    professor: '김교수',
    schedule: scheduleStrings[1],
    room: '공학관 401호',
    credits: 3,
    capacity: 40,
    enrolled: 35,
    description: '웹 개발의 기초를 배우는 과목',
    category: 'MAJOR_REQUIRED',
    semester: '2024-1',
    status: 'active',
    progress: 85,
    attendance: 95
  },
  {
    id: 2,
    name: '데이터베이스',
    professor: '이교수',
    schedule: scheduleStrings[2],
    room: '공학관 502호',
    credits: 3,
    capacity: 35,
    enrolled: 30,
    description: '데이터베이스 설계와 SQL을 학습하는 과목',
    category: 'MAJOR_REQUIRED',
    semester: '2024-1',
    status: 'active',
    progress: 80,
    attendance: 92
  },
  {
    id: 3,
    name: '알고리즘',
    professor: '박교수',
    schedule: scheduleStrings[3],
    room: '공학관 303호',
    credits: 3,
    capacity: 45,
    enrolled: 40,
    description: '알고리즘 설계와 분석을 학습하는 과목',
    category: 'MAJOR_REQUIRED',
    semester: '2024-1',
    status: 'active',
    progress: 75,
    attendance: 88
  }
];

// 교수별 강의 목록
export const professorCourses = {
  'prof001': {
    courses: [courses[0], courses[1]],
    stats: {
      totalCourses: 2,
      totalStudents: 65,
      averageAttendance: 93.5,
      upcomingDeadlines: 3
    }
  }
};
