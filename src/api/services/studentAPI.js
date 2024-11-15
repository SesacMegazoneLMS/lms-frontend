export const studentAPI = {
  getStudentInfo: async () => {
    const response = await fetch('/api/student/info')
    if (!response.ok) throw new Error('Failed to fetch student info')
    return response.json()
  },

  // 학생 정보 조회
  getStudentDetails: async (id) => {
    const response = await fetch(`/api/student/${id}/details`)
    if (!response.ok) throw new Error('학생 정보 조회에 실패했습니다')
    return response.json()
  },

  // 학생 프로필 조회
  getStudentProfile: async (id) => {
    const response = await fetch(`/api/student/${id}/profile`)
    if (!response.ok) throw new Error('학생 프로필 조회에 실패했습니다') 
    return response.json()
  },

  // 학생 일정 조회
  getStudentSchedule: async (id) => {
    const response = await fetch(`/api/student/${id}/schedule`)
    if (!response.ok) throw new Error('학생 일정 조회에 실패했습니다')
    return response.json()
  },

  // 학생 알림 조회
  getStudentNotifications: async (id) => {
    const response = await fetch(`/api/student/${id}/notifications`)
    if (!response.ok) throw new Error('학생 알림 조회에 실패했습니다')
    return response.json()
  }
};