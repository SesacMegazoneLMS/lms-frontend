import { http, HttpResponse } from 'msw';
import { enrollments } from '../data/enrollments';
import { courses } from '../data/courses';
import { students } from '../data/students';

export const enrollmentHandlers = [
  // 수강신청
  http.post('/api/enrollments', async ({ request }) => {
    const { studentId, courseId } = await request.json();
    const student = students.find(s => s.id === studentId);
    const course = courses.find(c => c.id === courseId);

    if (!student || !course) {
      return new HttpResponse(
        JSON.stringify({ message: '학생 또는 강의를 찾을 수 없습니다.' }), 
        { status: 404 }
      );
    }

    if (course.enrolled >= course.capacity) {
      return new HttpResponse(
        JSON.stringify({ message: '수강 인원이 초과되었습니다.' }),
        { status: 400 }
      );
    }

    const newEnrollment = {
      id: enrollments.length + 1,
      studentId,
      courseId,
      status: 'enrolled',
      enrolledAt: new Date().toISOString(),
      grade: null,
      attendance: 0
    };

    enrollments.push(newEnrollment);
    course.enrolled += 1;
    student.enrolledCourses.push(courseId);

    return HttpResponse.json(newEnrollment, { status: 201 });
  }),

  // 수강 취소
  http.delete('/api/enrollments/:id', async ({ params }) => {
    const { id } = params;
    const enrollmentIndex = enrollments.findIndex(e => e.id === parseInt(id));

    if (enrollmentIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: '수강 신청 정보를 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }

    const enrollment = enrollments[enrollmentIndex];
    const course = courses.find(c => c.id === enrollment.courseId);
    const student = students.find(s => s.id === enrollment.studentId);

    enrollments.splice(enrollmentIndex, 1);
    course.enrolled -= 1;
    student.enrolledCourses = student.enrolledCourses.filter(c => c !== enrollment.courseId);

    return HttpResponse.json({ message: '수강 취소가 완료되었습니다.' }, { status: 200 });
  }),

  // 학생의 수강 목록 조회
  http.get('/api/students/:id/enrollments', async ({ params }) => {
    const { id } = params;
    const studentEnrollments = enrollments.filter(e => e.studentId === id);
    return HttpResponse.json(studentEnrollments, { status: 200 });
  }),

  // 강의의 수강생 목록 조회
  http.get('/api/courses/:id/enrollments', async ({ params }) => {
    const { id } = params;
    const courseEnrollments = enrollments.filter(e => e.courseId === id);
    return HttpResponse.json(courseEnrollments, { status: 200 });
  }),

  // 수강신청 가능 여부 확인
  http.get('/api/enrollments/check', async ({ request }) => {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');
    const courseId = url.searchParams.get('courseId');
    
    const student = students.find(s => s.id === studentId);
    const course = courses.find(c => c.id === courseId);

    if (!student || !course) {
      return new HttpResponse(
        JSON.stringify({ message: '학생 또는 강의를 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }

    const canEnroll = course.enrolled < course.capacity && !student.enrolledCourses.includes(courseId);
    return HttpResponse.json({ canEnroll }, { status: 200 });
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
];