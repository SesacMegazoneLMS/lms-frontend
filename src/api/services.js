// 각 API 서비스를 import
import { adminAPI } from './services/adminAPI'
import { studentAPI } from './services/studentAPI'
import { userAPI } from './services/userAPI'
import { courseAPI } from './services/courseAPI'
import { enrollmentAPI } from './services/enrollmentAPI'
import { assignmentAPI } from './services/assignmentAPI'
import { professorAPI } from './services/professorAPI'
import { systemAPI } from './services/systemAPI'

// 모든 API 서비스를 named export로 다시 export
export {
  adminAPI,
  studentAPI,
  userAPI,
  courseAPI,
  enrollmentAPI,
  assignmentAPI,
  professorAPI,
  systemAPI
}