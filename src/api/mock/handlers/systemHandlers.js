import { http, HttpResponse } from 'msw'
import { systemSettings, systemLogs } from '../data/system'

export const systemHandlers = [
  // 시스템 설정 조회
  http.get('/api/system/settings', async () => {
    return HttpResponse.json(systemSettings)
  }),

  // 시스템 설정 업데이트
  http.put('/api/system/settings', async ({ request }) => {
    const updates = await request.json()
    Object.assign(systemSettings, updates)
    
    systemLogs.push({
      id: systemLogs.length + 1,
      timestamp: new Date().toISOString(),
      level: 'INFO', 
      source: 'System Settings',
      message: '시스템 설정이 업데이트되었습니다.'
    })

    return HttpResponse.json(systemSettings)
  }),

  // 시스템 로그 조회
http.get('/api/system/logs', () => {
  return HttpResponse.json(systemLogs)
}),

  // 시스템 상태 확인
  http.get('/api/system/health', async () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'operational',
        cache: 'operational',
        email: 'operational'
      }
    })
  }),

  // 시스템 백업 요청
  http.post('/api/system/backup', async () => {
    const backupId = `backup_${Date.now()}`
    
    systemLogs.push({
      id: systemLogs.length + 1,
      timestamp: new Date().toISOString(),
      level: 'INFO',
      source: 'Backup Service', 
      message: `시스템 백업 시작: ${backupId}`
    })

    return HttpResponse.json({
      backupId,
      status: 'completed',
      timestamp: new Date().toISOString()
    })
  }),

  // 시스템 메인터넌스 모드 설정
  http.post('/api/system/maintenance', async ({ request }) => {
    const { enabled, message } = await request.json()
    
    systemSettings.system.maintenanceMode = enabled
    systemSettings.system.maintenanceMessage = message

    systemLogs.push({
      id: systemLogs.length + 1,
      timestamp: new Date().toISOString(),
      level: 'WARNING',
      source: 'System Maintenance',
      message: enabled ? '메인터넌스 모드 활성화' : '메인터넌스 모드 비활성화'
    })

    return HttpResponse.json({
      maintenanceMode: enabled,
      message
    })
  })
]