export const systemAPI = {
  // 시스템 설정 조회
  getSettings: async () => {
    const response = await fetch('/api/system/settings')
    if (!response.ok) throw new Error('Failed to fetch system settings')
    return response.json()
  },

  // 시스템 설정 업데이트 
  updateSettings: async (settings) => {
    const response = await fetch('/api/system/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
    if (!response.ok) throw new Error('Failed to update system settings')
    return response.json()
  },

  // 시스템 로그 조회
  getLogs: async () => {
    const response = await fetch('/api/system/logs')
    if (!response.ok) throw new Error('Failed to fetch system logs')
    return response.json()
  },

  // 시스템 상태 확인
  getHealthStatus: async () => {
    const response = await fetch('/api/system/health')
    if (!response.ok) throw new Error('Failed to fetch system health status')
    return response.json()
  },

  // 시스템 백업 요청
  requestBackup: async () => {
    const response = await fetch('/api/system/backup', {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Failed to request system backup')
    return response.json()
  },

  // 메인터넌스 모드 설정
  setMaintenanceMode: async (enabled, message = '') => {
    const response = await fetch('/api/system/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled, message })
    })
    if (!response.ok) throw new Error('Failed to set maintenance mode')
    return response.json()
  },

  // 시스템 공지사항 관리
  getSystemNotices: async () => {
    const response = await fetch('/api/system/notices')
    if (!response.ok) throw new Error('Failed to fetch system notices')
    return response.json()
  },

  createSystemNotice: async (noticeData) => {
    const response = await fetch('/api/system/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noticeData)
    })
    if (!response.ok) throw new Error('Failed to create system notice')
    return response.json()
  }
}

export default systemAPI