import { scheduleStrings } from './schedules';
export const courses = [
  {
    courseId: '11111111-aaaa-1111-1111-111111111111',
    departmentId: '11111111-1111-1111-1111-111111111111',
    courseCode: 'CS101',
    courseName: '컴퓨터프로그래밍기초',
    credits: 3,
    description: '프로그래밍 기초 과정',
    openings: [
      {
        openingId: 'bbbbbbbb-1111-aaaa-1111-111111111111',
        professorId: 'ffffffff-1111-1111-1111-111111111111',
        year: 2024,
        semester: '1',
        maxStudents: 30,
        currentStudents: 0,
        status: 'OPENED'
      }
    ]
  },
  // ... 더 많은 강의 데이터
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
