export const adminAPI = {
  getDashboardStats: async () => {
    const response = await fetch('/api/admin/dashboard/stats');
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  // 사용자 관리
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`/api/admin/users?${params}`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  createUser: async (userData) => {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  updateUser: async (id, updates) => {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  deleteUser: async (id) => {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },

  // 시스템 설정
  getSystemSettings: async () => {
    const response = await fetch('/api/admin/settings');
    if (!response.ok) throw new Error('Failed to fetch system settings');
    return response.json();
  },

  updateSystemSettings: async (settings) => {
    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!response.ok) throw new Error('Failed to update system settings');
    return response.json();
  },

  // 시스템 로그 
  getSystemLogs: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`/api/admin/logs?${params}`);
    if (!response.ok) throw new Error('Failed to fetch system logs');
    return response.json();
  }
};