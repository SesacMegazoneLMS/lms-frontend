import { http, HttpResponse } from 'msw'
import { courses } from '../data/courses'
import { professors } from '../data/professors'

export const courseHandlers = [
  // 모든 강의 조회
  http.get('/api/courses', () => {
    return HttpResponse.json(courses)
  }),

  // 특정 강의 조회
  http.get('/api/courses/:id', ({ params }) => {
    try {
      const course = courses.find(c => c.id === Number(params.id))
      if (!course) {
        return new HttpResponse(
          JSON.stringify({ message: '강의를 찾을 수 없습니다.' }),
          { status: 404 }
        )
      }
      return HttpResponse.json(course)
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({ message: '서버 오류가 발생했습니다.' }),
        { status: 500 }
      )
    }
  }),

  // 교수의 강의 목록 조회 (학기별)
  http.get('/api/professors/courses', ({ request }) => {
    try {
      const url = new URL(request.url);
      const year = url.searchParams.get('year');
      const semester = url.searchParams.get('semester');
      
      const professor = professors[0];
      
      const filteredCourses = professor.courses.filter(course => 
        course.year === parseInt(year) && 
        course.semester === semester
      );
      
      return HttpResponse.json(filteredCourses);
    } catch (error) {
      console.error('Error in course handler:', error);
      return new HttpResponse(
        JSON.stringify({ message: '강의 목록을 불러오는데 실패했습니다.' }),
        { status: 500 }
      );
    }
  }),

  // 새 강의 생성
  http.post('/api/courses', async ({ request }) => {
    const newCourse = await request.json()
    const course = {
      id: `CSE${courses.length + 101}`,
      ...newCourse,
      enrolled: 0,
      status: 'active'
    }
    courses.push(course)
    return HttpResponse.json(course, { status: 201 })
  }),

  // 강의 정보 수정
  http.put('/api/courses/:id', async ({ request, params }) => {
    const updates = await request.json()
    const courseIndex = courses.findIndex(c => c.id === params.id)
    
    if (courseIndex === -1) {
      return HttpResponse.json(
        { message: '강의를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    courses[courseIndex] = { ...courses[courseIndex], ...updates }
    return HttpResponse.json(courses[courseIndex])
  }),

  // 강의 삭제
  http.delete('/api/courses/:id', ({ params }) => {
    try {
      const courseId = params.id
      const professor = professors[0]
      const courseIndex = professor.courses.findIndex(c => c.id === courseId)

      if (courseIndex === -1) {
        return new HttpResponse(
          JSON.stringify({ message: '강의를 찾을 수 없습니다.' }),
          { status: 404 }
        )
      }

      professor.courses.splice(courseIndex, 1)
      return HttpResponse.json({ message: '강의가 삭제되었습니다.' })
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({ message: '강의 삭제에 실패했습니다.' }),
        { status: 500 }
      )
    }
  })
]