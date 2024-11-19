import { http, HttpResponse } from 'msw'
import { professors } from '../data/professors'
import { professorAPI } from '../../services/professorAPI'

export const professorHandlers = [
  // 교수 정보 조회 (현재 로그인한 교수)
  http.get('/api/professors/me', () => {
    const currentProfessor = professors[0]
    return HttpResponse.json(currentProfessor)
  }),

  // 교수 강의 목록 조회
  http.get('/api/professors/courses', () => {
    const currentProfessor = professors[0]
    return HttpResponse.json(currentProfessor.courses)
  }),

  // 교수 정보 조회 (현재 로그인한 교수)
  http.get('/api/professors/info', () => {
    // PROF001을 가진 교수 정보를 반환
    const currentProfessor = professors.find(p => p.id === 'PROF001')
    
    if (!currentProfessor) {
      return new HttpResponse(
        JSON.stringify({ message: '교수 정보를 찾을 수 없습니다.' }),
        { status: 404 }
      )
    }

    return HttpResponse.json(currentProfessor)
  }),

  // 특정 교수 정보 조회 - ID 형식을 'PROF001' 형태로 처리
  http.get('/api/professors/:id', ({ params }) => {
    const professor = professors.find(p => p.id === params.id)
    
    if (!professor) {
      return new HttpResponse(
        JSON.stringify({ message: '교수를 찾을 수 없습니다.' }),
        { status: 404 }
      )
    }

    return HttpResponse.json(professor)
  }),

  // 교수의 주간 일정 조회
  http.get('/api/professors/:id/schedule', ({ params }) => {
    const professor = professors.find(p => p.id === params.id)
    
    if (!professor) {
      return new HttpResponse(
        JSON.stringify({ message: '교수를 찾을 수 없습니다.' }),
        { status: 404 }
      )
    }

    return HttpResponse.json(professor.weeklySchedule)
  }),

  // 교수의 공지사항 조회
  http.get('/api/professors/:id/notices', ({ params }) => {
    const professor = professors.find(p => p.id === params.id)
    
    if (!professor) {
      return new HttpResponse(
        JSON.stringify({ message: '교수를 찾을 수 없습니다.' }),
        { status: 404 }
      )
    }

    return HttpResponse.json(professor.notices)
  }),

  // 교수 정보 수정
  http.put('/api/professors/:id', async ({ request, params }) => {
    const updates = await request.json()
    const professorIndex = professors.findIndex(p => p.id === params.id)
    
    if (professorIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: '교수를 찾을 수 없습니다.' }),
        { status: 404 }
      )
    }

    professors[professorIndex] = { ...professors[professorIndex], ...updates }
    return HttpResponse.json(professors[professorIndex])
  }),

  // 주간 일정 조회
  http.get('/api/professors/schedule', () => {
    const currentProfessor = professors[0]
    return HttpResponse.json(currentProfessor.weeklySchedule)
  }),

  // 공지사항 조회
  http.get('/api/professors/notices', () => {
    const currentProfessor = professors[0]
    return HttpResponse.json(currentProfessor.notices)
  }),

  // 할 일 목록 조회
  http.get('/api/professors/todos', () => {
    const currentProfessor = professors[0]
    return HttpResponse.json(currentProfessor.todos)
  }),

  // 대시보드 통계 조회
  http.get('/api/professors/dashboard/stats', () => {
    const currentProfessor = professors[0]
    return HttpResponse.json(currentProfessor.stats)
  }),

  // 대시보드 주간 일정 조회
  http.get('/api/professors/dashboard/schedule', async () => {
    const schedule = await professorAPI.getWeeklySchedule()
    return HttpResponse.json(schedule)
  }),

  // 대시보드 공지사항 조회
  http.get('/api/professors/dashboard/notices', async () => {
    const notices = await professorAPI.getNotices()
    return HttpResponse.json(notices)
  }),

  // 대시보드 할 일 목록 조회
  http.get('/api/professors/dashboard/todos', async () => {
    const todos = await professorAPI.getTodos()
    return HttpResponse.json(todos)
  })
]