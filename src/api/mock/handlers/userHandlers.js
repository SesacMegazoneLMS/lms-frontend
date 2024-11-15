import { http, HttpResponse } from 'msw';
import { users } from '../data/users';
import { systemLogs } from '../data/system';

export const userHandlers = [
  // 로그인
  http.post('/api/auth/login', async ({ request }) => {
    const { username, password } = await request.json();
    const user = users.find(u => u.username === username);

    if (!user) {
      return new HttpResponse(
        JSON.stringify({ message: '사용자를 찾을 수 없습니다.' }), 
        { status: 401 }
      );
    }

    // 실제 환경에서는 비밀번호 검증이 필요합니다
    return HttpResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      },
      token: 'mock-jwt-token'
    }, { status: 200 });
  }),

  // 사용자 정보 조회
  http.get('/api/users/:id', async ({ params }) => {
    const { id } = params;
    const user = users.find(u => u.id === parseInt(id));

    if (!user) {
      return new HttpResponse(
        JSON.stringify({ message: '사용자를 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }

    return HttpResponse.json(user, { status: 200 });
  }),

 // 사용자 목록 조회
http.get('/api/users', () => {
  return HttpResponse.json(users)
}),

  // 사용자 생성
  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json();
    const user = {
      id: users.length + 1,
      ...newUser,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    users.push(user);
    
    systemLogs.push({
      id: systemLogs.length + 1,
      timestamp: new Date().toISOString(),
      level: 'INFO',
      source: 'User Management',
      message: `새로운 사용자 생성: ${user.username}`
    });

    return HttpResponse.json(user, { status: 201 });
  }),

  // 사용자 정보 수정
  http.put('/api/users/:id', async ({ request, params }) => {
    const { id } = params;
    const updates = await request.json();
    const userIndex = users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: '사용자를 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }

    users[userIndex] = { ...users[userIndex], ...updates };

    systemLogs.push({
      id: systemLogs.length + 1,
      timestamp: new Date().toISOString(),
      level: 'INFO',
      source: 'User Management',
      message: `사용자 정보 수정: ${users[userIndex].username}`
    });

    return HttpResponse.json(users[userIndex], { status: 200 });
  }),

  // 비밀번호 변경
  http.post('/api/users/:id/change-password', async ({ request, params }) => {
    const { id } = params;
    const { currentPassword, newPassword } = await request.json();
    const user = users.find(u => u.id === parseInt(id));

    if (!user) {
      return new HttpResponse(
        JSON.stringify({ message: '사용자를 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }

    // 실제 환경에서는 현재 비밀번호 검증이 필요합니다
    systemLogs.push({
      id: systemLogs.length + 1,
      timestamp: new Date().toISOString(),
      level: 'INFO',
      source: 'User Management',
      message: `비밀번호 변경: ${user.username}`
    });

    return HttpResponse.json(
      { message: '비밀번호가 성공적으로 변경되었습니다.' },
      { status: 200 }
    );
  })
];