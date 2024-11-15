import { http, HttpResponse } from 'msw'
import { students } from '../data/students'
import { enrollments } from '../data/enrollments'
import { courses } from '../data/courses'

export const studentHandlers = [
  // 학생 정보 조회 (현재 로그인한 학생)
  http.get('/api/student/info', () => {
    const currentStudent = students[0]
    return HttpResponse.json(currentStudent)
  }),

  // 수강 중인 강의 목록 조회
  http.get('/api/student/courses', () => {
    const currentStudent = students[0]
    return HttpResponse.json(currentStudent.enrolledCourses)
  }),

  // 주간 일정 조회
  http.get('/api/student/schedule', () => {
    const currentStudent = students[0]
    return HttpResponse.json(currentStudent.weeklySchedule)
  }),

  // 공지사항 조회
  http.get('/api/student/notices', () => {
    const currentStudent = students[0]
    return HttpResponse.json(currentStudent.notices)
  }),

  // 할 일 목록 조회
  http.get('/api/student/todos', () => {
    const currentStudent = students[0]
    return HttpResponse.json(currentStudent.todos)
  }),

  // 학습 현황 조회
  http.get('/api/student/dashboard/stats', () => {
    const currentStudent = students[0]
    return HttpResponse.json({
      totalCourses: currentStudent.enrolledCourses.length,
      averageAttendance: 94.5,
      submittedAssignments: '12/15',
      upcomingExams: 3
    })
  }),

  // 특정 학생 정보 조회
  http.get('/api/students/:id', ({ params }) => {
    const { id } = params
    const student = students.find(s => s.id === parseInt(id)) // ID를 정수로 변환

    if (!student) {
      return new HttpResponse(
        JSON.stringify({ message: '학생을 찾을 수 없습니다.' }), 
        { status: 404 }
      )
    }

    return HttpResponse.json(student)
  }),

  // 특정 학생의 수강 목록 조회 
  http.get('/api/students/:id/courses', ({ params }) => {
    const { id } = params
    const student = students.find(s => s.id === parseInt(id)) // ID를 정수로 변환

    if (!student) {
      return new HttpResponse(
        JSON.stringify({ message: '학생을 찾을 수 없습니다.' }),
        { status: 404 }
      )
    }

    const studentCourses = courses.filter(course => student.enrolledCourses.includes(course.id))
    return HttpResponse.json(studentCourses)
  }),

  // 특정 학생의 성적 조회
  http.get('/api/students/:id/grades', ({ params }) => {
    const { id } = params
    const student = students.find(s => s.id === parseInt(id)) // ID를 정수로 변환

    if (!student) {
      return new HttpResponse(
        JSON.stringify({ message: '학생을 찾을 수 없습니다.' }),
        { status: 404 }
      )
    }

    return HttpResponse.json(student.grades)
  }),

  // 학생 정보 수정
  http.put('/api/students/:id', async ({ params, request }) => {
    const { id } = params
    const updates = await request.json()
    const studentIndex = students.findIndex(s => s.id === parseInt(id)) // ID를 정수로 변환

    if (studentIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: '학생을 찾을 수 없습니다.' }),
        { status: 404 }
      )
    }

    students[studentIndex] = { ...students[studentIndex], ...updates }
    return HttpResponse.json(students[studentIndex])
  }),

  // 학생의 출석 정보 업데이트
  http.put('/api/students/:studentId/courses/:courseId/attendance', async ({ params, request }) => {
    const { studentId, courseId } = params
    const { attendance } = await request.json()

    const enrollment = enrollments.find(e => e.studentId === studentId && e.courseId === courseId)

    if (!enrollment) {
      return new HttpResponse(
        JSON.stringify({ message: '수강 정보를 찾을 수 없습니다.' }),
        { status: 404 }
      )
    }

    enrollment.attendance = attendance
    return HttpResponse.json(enrollment)
  }),

  // 학생의 수강 내역 조회
  http.get('/api/students/history', async ({ request }) => {
    const url = new URL(request.url);
    const semester = url.searchParams.get('semester');
    const studentId = url.searchParams.get('studentId'); // 학생 ID를 쿼리 파라미터로 받는다고 가정

    const student = students.find(s => s.id === parseInt(studentId)); // 학생 ID를 정수로 변환
    if (!student) {
      return HttpResponse.json(
        { message: '학생을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 학생의 수강 내역을 semester에 따라 필터링
    const studentEnrollments = enrollments.filter(e => e.studentId === studentId && e.semester === semester);
    return HttpResponse.json(studentEnrollments, { status: 200 });
  })
]