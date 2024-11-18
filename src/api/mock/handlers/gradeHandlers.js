import { http, HttpResponse } from 'msw';
import { grades } from '../data/grades';

export const gradeHandlers = [
  // 단일 성적 조회
  http.get('/grades/:gradeId', ({ params }) => {
    const grade = grades.find(g => g.gradeId === params.gradeId);
    if (!grade) {
      return new HttpResponse(
        JSON.stringify({ message: '성적을 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }
    return HttpResponse.json(grade);
  }),

  // 강의별 성적 조회
  http.get('/grades/course', ({ request }) => {
    const url = new URL(request.url);
    const courseName = url.searchParams.get('courseName');
    const semester = url.searchParams.get('semester');

    const filteredGrades = grades.filter(g =>
      g.courseOpening.course.courseName === courseName &&
      g.courseOpening.semester === semester
    );
    return HttpResponse.json(filteredGrades);
  }),

  // 성적 일괄 수정
  http.put('/grades/scores/batch', async ({ request }) => {
    const updates = await request.json();
    return HttpResponse.json({ message: '성적이 수정되었습니다.' });
  }),

  // 학점 계산
  http.get('/grades/gpa/:scoreId', ({ params }) => {
    const grade = grades.find(g => g.score.scoreId === params.scoreId);
    if (!grade) {
      return new HttpResponse(
        JSON.stringify({ message: '성적을 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }
    return HttpResponse.json({
      scoreId: params.scoreId,
      gpa: 4.0, // 예시 값
      grade: 'A'
    });
  }),

  // 성적 목록 조회
  http.get('/grades/list/:openingId', ({ params, request }) => {
    const url = new URL(request.url);
    const sortBy = url.searchParams.get('sortBy') || 'totalScore';
    const filteredGrades = grades.filter(g =>
      g.courseOpening.openingId === params.openingId
    );
    return HttpResponse.json(filteredGrades);
  }),

  // 성적 통계 조회
  http.get('/grades/statistics/:openingId', ({ params }) => {
    return HttpResponse.json({
      average: 85.5,
      highest: 100,
      lowest: 60,
      distribution: {
        A: 10,
        B: 15,
        C: 8,
        D: 4,
        F: 1
      }
    });
  }),

  // 성적 공개 설정
  http.put('/grades/visibility', async ({ request }) => {
    const visibilityData = await request.json();
    return HttpResponse.json({ message: '성적 공개 설정이 변경되었습니다.' });
  }),

  // 성적 공개 여부 확인
  http.get('/grades/visibility/:gradeId', ({ params }) => {
    const grade = grades.find(g => g.gradeId === params.gradeId);
    if (!grade) {
      return new HttpResponse(
        JSON.stringify({ message: '성적을 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }
    return HttpResponse.json(grade.visibility);
  })
];