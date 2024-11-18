import { http } from 'msw';
import { setupServer } from 'msw/node';
import { adminHandlers } from './handlers/adminHandlers';
import { courseHandlers } from './handlers/courseHandlers';
import { enrollmentHandlers } from './handlers/enrollmentHandlers';
import { professorHandlers } from './handlers/professorHandlers';
import { studentHandlers } from './handlers/studentHandlers';
import { systemHandlers } from './handlers/systemHandlers';
import { userHandlers } from './handlers/userHandlers';
import { gradeHandlers } from './handlers/gradeHandlers';

// 모든 핸들러를 하나의 배열로 결합
const handlers = [
  ...adminHandlers,
  ...courseHandlers,
  ...enrollmentHandlers,
  ...professorHandlers,
  ...studentHandlers,
  ...systemHandlers,
  ...userHandlers,
  ...gradeHandlers,
];

// MSW 서버 설정
export const server = setupServer(...handlers);

// 테스트 환경을 위한 리스너 설정
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});