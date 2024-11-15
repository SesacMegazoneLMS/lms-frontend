import { setupWorker } from 'msw/browser';
import { adminHandlers } from './handlers/adminHandlers';
import { courseHandlers } from './handlers/courseHandlers';
import { enrollmentHandlers } from './handlers/enrollmentHandlers';
import { professorHandlers } from './handlers/professorHandlers';
import { studentHandlers } from './handlers/studentHandlers';
import { systemHandlers } from './handlers/systemHandlers';
import { userHandlers } from './handlers/userHandlers';

// 모든 핸들러를 하나의 배열로 결합
export const handlers = [
  ...adminHandlers,
  ...courseHandlers,
  ...enrollmentHandlers,
  ...professorHandlers,
  ...studentHandlers,
  ...systemHandlers,
  ...userHandlers
  // ...existingHandlers,
];

// MSW 워커 설정
export const worker = setupWorker(...handlers);

// 개발 환경에서만 MSW 시작
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass', // 처리되지 않은 요청은 그대로 통과
    serviceWorker: {
      options: {
        scope: '/'
      },
      url: '/mockServiceWorker.js',
    },
  }).catch(console.error);
}
