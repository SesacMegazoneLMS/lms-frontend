import { professors } from '../mock/data/professors'
import { http, HttpResponse } from 'msw'
/**
 * 교수 관련 API 서비스
 */
export const professorAPI = {
  /**
   * 현재 로그인한 교수 정보 조회
   */
  getProfessorInfo: async () => {
    try {
      const currentProfessor = professors[0]
      console.log('currentProfessor:', currentProfessor) // 디버깅용
      if (!currentProfessor) {
        throw new Error('교수 정보를 찾을 수 없습니다.')
      }
      return currentProfessor
    } catch (error) {
      console.error('Error in getProfessorInfo:', error)
      throw error
    }
  },

  /**
   * 특정 교수 정보 조회
   */
  getProfessor: async (id) => {
    try {
      const professor = professors.find(p => p.id === id)
      console.log('professor:', professor) // 디버깅용
      if (!professor) {
        throw new Error('교수를 찾을 수 없습니다.')
      }
      return { data: professor }
    } catch (error) {
      return { error: error.message }
    }
  },

  /**
   * 교수의 주간 일정 조회
   */
  getProfessorSchedule: async (id) => {
    try {
      const professor = professors.find(p => p.id === id)
      console.log('professor schedule:', professor?.weeklySchedule) // 디버깅용
      if (!professor) {
        throw new Error('교수를 찾을 수 없습니다.')
      }
      return { data: professor.weeklySchedule }
    } catch (error) {
      return { error: error.message }
    }
  },

  /**
   * 교수의 공지사항 조회
   */
  getProfessorNotices: async (id) => {
    try {
      const professor = professors.find(p => p.id === id)
      console.log('professor notices:', professor?.notices) // 디버깅용
      if (!professor) {
        throw new Error('교수를 찾을 수 없습니다.')
      }
      return { data: professor.notices }
    } catch (error) {
      return { error: error.message }
    }
  },

  /**
   * 교수 정보 수정
   */
  updateProfessor: async (id, updates) => {
    try {
      const professorIndex = professors.findIndex(p => p.id === id)
      console.log('professor updates:', updates) // 디버깅용
      if (professorIndex === -1) {
        throw new Error('교수를 찾을 수 없습니다.')
      }
      professors[professorIndex] = { ...professors[professorIndex], ...updates }
      return { data: professors[professorIndex] }
    } catch (error) {
      return { error: error.message }
    }
  },

  /**
   * 주간 일정 조회
   */
  getWeeklySchedule: async () => {
    try {
      const currentProfessor = professors[0]
      console.log('weeklySchedule:', currentProfessor.weeklySchedule) // 디버깅용
      return currentProfessor.weeklySchedule || []
    } catch (error) {
      console.error('Error getting weekly schedule:', error)
      return []
    }
  },

  /**
   * 공지사항 조회
   */
  getNotices: async () => {
    try {
      const currentProfessor = professors[0]
      console.log('notices:', currentProfessor.notices) // 디버깅용
      return currentProfessor.notices || []
    } catch (error) {
      console.error('Error getting notices:', error)
      return []
    }
  },

  /**
   * 할 일 목록 조회
   */
  getTodos: async () => {
    try {
      const currentProfessor = professors[0]
      console.log('todos:', currentProfessor.todos) // 디버깅용
      return currentProfessor.todos || []
    } catch (error) {
      console.error('Error getting todos:', error)
      return []
    }
  },

  /**
   * 대시보드 통계 조회
   */
  getDashboardStats: async () => {
    try {
      const currentProfessor = professors[0]
      console.log('stats:', currentProfessor.stats) // 디버깅용
      return currentProfessor.stats || {
        totalCourses: currentProfessor.courses.length,
        totalStudents: currentProfessor.courses.reduce((total, course) => total + course.enrolled, 0),
        pendingAssignments: 0,
        upcomingExams: 0
      }
    } catch (error) {
      console.error('Error getting dashboard stats:', error)
      return {
        totalCourses: 0,
        totalStudents: 0,
        pendingAssignments: 0,
        upcomingExams: 0
      }
    }
  }
}

/**
 * MSW 핸들러
 */
export const professorHandlers = [
  http.get('/api/professors/info', () => {
    const currentProfessor = professors[0]
    return HttpResponse.json(currentProfessor)
  }),

  http.get('/api/professors/:id', async ({ params }) => {
    try {
      const response = await professorAPI.getProfessor(params.id)
      if (response.error) {
        return HttpResponse.json(
          { message: response.error },
          { status: 404 }
        )
      }
      return HttpResponse.json(response.data)
    } catch (error) {
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
  }),

  http.get('/api/professors/:id/schedule', async ({ params }) => {
    try {
      const response = await professorAPI.getProfessorSchedule(params.id)
      if (response.error) {
        return HttpResponse.json(
          { message: response.error },
          { status: 404 }
        )
      }
      return HttpResponse.json(response.data)
    } catch (error) {
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
  }),

  http.get('/api/professors/:id/notices', async ({ params }) => {
    try {
      const response = await professorAPI.getProfessorNotices(params.id)
      if (response.error) {
        return HttpResponse.json(
          { message: response.error },
          { status: 404 }
        )
      }
      return HttpResponse.json(response.data)
    } catch (error) {
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
  }),

  http.put('/api/professors/:id', async ({ request, params }) => {
    try {
      const updates = await request.json()
      const response = await professorAPI.updateProfessor(params.id, updates)
      if (response.error) {
        return HttpResponse.json(
          { message: response.error },
          { status: 404 }
        )
      }
      return HttpResponse.json(response.data)
    } catch (error) {
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
  })
]