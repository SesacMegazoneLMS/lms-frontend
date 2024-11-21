
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Navigate 추가
// Auth Pages
import Login from './pages/auth/Login'; // Login 컴포넌트 임포트
import Register from './pages/auth/Register'; // Register 컴포넌트 임포트
// Student Pages
import StudentDashboard from './pages/student/dashboard/Dashboard'; // StudentDashboard 컴포넌트 임포트
import CourseEnrollment from './pages/student/enrollment/CourseEnrollment'; // CourseEnrollment 컴포넌트 임포트
import StudentTimetable from './pages/student/timetable/StudentTimetable'; // StudentTimetable 컴포넌트 임포트
import StudentCourseList from './pages/student/courses/CourseList'; // StudentCourseList 컴포넌트 임포트
import StudentCourseDetail from './pages/student/courses/CourseDetail'; // StudentCourseDetail 컴포넌트 임포트
import StudentAssignmentList from './pages/student/assignments/AssignmentList'; // StudentAssignmentList 컴포넌트 임포트
import StudentAssignmentSubmit from './pages/student/assignments/AssignmentSubmit'; // StudentAssignmentSubmit 컴포넌트 임포트
import StudentGradeList from './pages/student/grades/StudentGradeList'; // StudentGradeList 컴포넌트 임포트
// Professor Pages
import ProfessorDashboard from './pages/professor/dashboard/Dashboard'; // ProfessorDashboard 컴포넌트 임포트
import ProfessorCourseManagement from './pages/professor/courses/CourseManagement'; // ProfessorCourseManagement 컴포넌트 임포트
import ProfessorCourseCreate from './pages/professor/courses/CourseCreate'; // ProfessorCourseCreate 컴포넌트 임포트
import ProfessorAssignmentManagement from './pages/professor/assignments/AssignmentManagement'; // ProfessorAssignmentManagement 컴포넌트 임포트
import ProfessorGradeAssignment from './pages/professor/assignments/GradeAssignment'; // ProfessorGradeAssignment 컴포넌트 임포트
import ProfessorStudentList from './pages/professor/students/StudentList'; // ProfessorStudentList 컴포넌트 임포트
import ProfessorGrades from './pages/professor/grades/Grades'; // 추가
// Admin Pages
import AdminDashboard from './pages/admin/dashboard/Dashboard'; // AdminDashboard 컴포넌트 임포트
import AdminUserManagement from './pages/admin/users/UserManagement'; // AdminUserManagement 컴포넌트 임포트
import AdminUserCreate from './pages/admin/users/UserCreate'; // AdminUserCreate 컴포넌트 임포트
import AdminCourseManagement from './pages/admin/courses/CourseManagement'; // AdminCourseManagement 컴포넌트 임포트
import AdminSettings from './pages/admin/system/Settings'; // AdminSettings 컴포넌트 임포트
import AdminLogs from './pages/admin/system/Logs'; // AdminLogs 컴포넌트 임포트

import Layout from './components/layout/Layout'; // Layout 컴포넌트 임포트
// RoleBasedRoute 컴포넌트가 없으므로 주석 처리
// import RoleBasedRoute from './components/RoleBasedRoute'; // RoleBasedRoute 컴포넌트 임포트

import GradeAppeal from './pages/student/grades/components/GradeAppeal';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth">
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={<Layout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="enrollment" element={<CourseEnrollment />} />
        <Route path="timetable" element={<StudentTimetable />} />
        <Route path="courses" element={<StudentCourseList />} />
        <Route path="courses/:id" element={<StudentCourseDetail />} />
        <Route path="assignments" element={<StudentAssignmentList />} />
        <Route path="assignments/submit/:id" element={<StudentAssignmentSubmit />} />
        <Route path="grades" element={<StudentGradeList />} />
        <Route path="grade-appeal/:gradeId" element={<GradeAppeal />} />
      </Route>

      {/* Professor Routes */}
      <Route path="/professor" element={<Layout />}>
        <Route path="dashboard" element={<ProfessorDashboard />} />
        <Route path="grades" element={<ProfessorGrades />} />
        <Route path="courses" element={<ProfessorCourseManagement />} />
        <Route path="courses/create" element={<ProfessorCourseCreate />} />
        <Route path="assignments" element={<ProfessorAssignmentManagement />} />
        <Route path="assignments/grade/:id" element={<ProfessorGradeAssignment />} />
        <Route path="students" element={<ProfessorStudentList />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<Layout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUserManagement />} />
        <Route path="users/create" element={<AdminUserCreate />} />
        <Route path="courses" element={<AdminCourseManagement />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="logs" element={<AdminLogs />} />
      </Route>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default App;
