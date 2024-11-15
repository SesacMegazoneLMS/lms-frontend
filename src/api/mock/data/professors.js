import { scheduleStrings } from './schedules';
export const professors = [
  {
    id: 'prof001',
    name: '김교수',
    email: 'kim@university.ac.kr',
    department: '컴퓨터공학과',
    courses: [
      {
        id: 1,
        name: '웹 프로그래밍',
        code: 'CSE101',
        professor: '김교수',
        credits: 3,
        capacity: 40,
        enrolled: 35,
        schedule: scheduleStrings[1],
        room: '공학관 401호',
        description: '웹 개발의 기초를 배우는 과목',
        category: 'MAJOR_REQUIRED',
        semester: '2024-1',
        status: 'active',
        progress: 85,
        attendance: 92
      },
      {
        id: 2,
        name: '프로그래밍 실습',
        code: 'CSE202',
        professor: '김교수',
        credits: 3,
        capacity: 45,
        enrolled: 40,
        schedule: scheduleStrings[2],
        room: '공학관 B02호',
        description: '프로그래밍 실습 과목',
        category: 'MAJOR_ELECTIVE',
        semester: '2024-1',
        status: 'active',
        progress: 55,
        attendance: 90
      }
    ],
    weeklySchedule: [
      // 기존 weeklySchedule 유지
    ],
    notices: [
      // 기존 notices 유지
    ],
    todos: [
      {
        title: '중간고사 채점',
        description: 'CSE101 중간고사 채점 완료하기',
        priority: 'high',
        daysLeft: 3
      },
      {
        title: '과제 검토',
        description: 'CSE202 프로그래밍 과제 검토',
        priority: 'medium',
        daysLeft: 5
      }
    ],
    stats: {
      totalCourses: 2,
      totalStudents: 75,
      pendingAssignments: 15,
      upcomingExams: 2
    }
  }
];