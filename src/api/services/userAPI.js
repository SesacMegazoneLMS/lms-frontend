export const userAPI = {
  // 사용자 목록 조회
  getUsers: async () => {
    const response = await fetch('/api/users')
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },

  // 로그인
  login: async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    if (!response.ok) throw new Error('Failed to login')
    return response.json()
  },

  // 로그아웃  
  logout: async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Failed to logout')
    return response.json()
  },

  // 사용자 정보 조회
  getUserInfo: async (id) => {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) throw new Error('Failed to fetch user info')
    return response.json()
  },

  // 사용자 생성
  createUser: async (userData) => {
    const response = await fetch('/api/users', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    if (!response.ok) throw new Error('Failed to create user')
    return response.json()
  },

  // 사용자 정보 수정
  updateUser: async (id, updates) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) throw new Error('Failed to update user')
    return response.json()
  },

  // 비밀번호 변경
  changePassword: async (id, passwordData) => {
    const response = await fetch(`/api/users/${id}/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordData)
    })
    if (!response.ok) throw new Error('Failed to change password')
    return response.json()
  },

  // 비밀번호 초기화 요청
  requestPasswordReset: async (email) => {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    if (!response.ok) throw new Error('Failed to request password reset')
    return response.json()
  },

  // 프로필 이미지 업로드
  uploadProfileImage: async (id, imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await fetch(`/api/users/${id}/profile-image`, {
      method: 'POST',
      body: formData
    })
    if (!response.ok) throw new Error('Failed to upload profile image')
    return response.json()
  }
}