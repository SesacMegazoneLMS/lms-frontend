import { http, HttpResponse } from 'msw'
import { mockData } from '../data/admin'

export const adminHandlers = [
  // 대시보드 통계
  http.get('/api/admin/dashboard/stats', () => {
    return HttpResponse.json(mockData.dashboardStats)
  }),

  // 사용자 관리
  http.get('/api/admin/users', ({ request }) => {
    const url = new URL(request.url)
    const role = url.searchParams.get('role')
    const department = url.searchParams.get('department')
    
    let filteredUsers = [...mockData.users]
    
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role)
    }
    
    if (department) {
      filteredUsers = filteredUsers.filter(user => user.department === department)
    }
    
    return HttpResponse.json(filteredUsers)
  }),

  http.post('/api/admin/users', async ({ request }) => {
    const newUser = await request.json()
    const user = {
      id: mockData.users.length + 1,
      ...newUser,
      status: 'active',
      createdAt: new Date().toISOString()
    }
    mockData.users.push(user)
    return HttpResponse.json(user, { status: 201 })
  }),

  http.put('/api/admin/users/:id', async ({ request, params }) => {
    const updates = await request.json()
    const userIndex = mockData.users.findIndex(u => u.id === parseInt(params.id))
    
    if (userIndex === -1) {
      return HttpResponse.json(
        { message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    mockData.users[userIndex] = { 
      ...mockData.users[userIndex], 
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return HttpResponse.json(mockData.users[userIndex])
  }),

  http.delete('/api/admin/users/:id', ({ params }) => {
    const userIndex = mockData.users.findIndex(u => u.id === parseInt(params.id))
    
    if (userIndex === -1) {
      return HttpResponse.json(
        { message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    mockData.users.splice(userIndex, 1)
    return HttpResponse.json({ 
      success: true,
      message: '사용자가 삭제되었습니다.' 
    })
  }),

  // 최근 활동 로그 추가 (대시보드용)
  http.post('/api/admin/activities', async ({ request }) => {
    const activity = await request.json()
    const newActivity = {
      id: mockData.dashboardStats.recentActivities.length + 1,
      ...activity,
      timestamp: new Date().toISOString()
    }
    mockData.dashboardStats.recentActivities.unshift(newActivity)
    
    // 최근 활동은 최대 10개만 유지
    if (mockData.dashboardStats.recentActivities.length > 10) {
      mockData.dashboardStats.recentActivities.pop()
    }
    
    return HttpResponse.json(newActivity, { status: 201 })
  })
]