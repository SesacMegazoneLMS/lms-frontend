import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { courseAPI, professorAPI } from '../../../api/services';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    weeklySchedule: [],
    notices: [],
    todos: [],
    stats: {
      totalCourses: 0,
      totalStudents: 0,
      pendingAssignments: 0,
      upcomingExams: 0
    }
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [coursesData, scheduleData, noticesData, todosData, statsData] = await Promise.all([
        courseAPI.getProfessorCourses(), // API 호출
        professorAPI.getWeeklySchedule(),
        professorAPI.getNotices(),
        professorAPI.getTodos(),
        professorAPI.getDashboardStats()
      ]);

      console.log('Fetched data:', { // 디버깅용
        coursesData,
        scheduleData,
        noticesData,
        todosData,
        statsData
      });

      setDashboardData({
        courses: coursesData || [],
        weeklySchedule: scheduleData || [],
        notices: noticesData || [],
        todos: todosData || [],
        stats: statsData || {
          totalCourses: 0,
          totalStudents: 0,
          pendingAssignments: 0,
          upcomingExams: 0
        }
      });
    } catch (err) {
      setError('대시보드 데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      {/* 환영 메시지 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          안녕하세요, {user?.name} 교수님!
        </h1>
        <p className="text-gray-600">
          {user?.department}
        </p>
      </div>

      {/* 담당 강의 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">담당 강의</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.courses.map(course => (
            <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium">{course.name}</h3>
              <p className="text-sm text-gray-500">
                {course.schedule} | 수강인원 {course.enrolled}명
              </p>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-blue-600">진행률 {course.progress}%</span>
                <span className="text-green-600">평균 출석률 {course.attendance}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 주간 일정 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">이번 주 일정</h2>
        <div className="space-y-3">
          {dashboardData.weeklySchedule.map((schedule, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium">{schedule.day}</span>
                <p className="text-gray-600">{schedule.title}</p>
              </div>
              <span className="text-sm text-gray-500">{schedule.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 공지사항 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">공지사항</h2>
          <ul className="space-y-3">
            {dashboardData.notices.map((notice, index) => (
              <li key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <span className={`text-${notice.category}-600`}>[{notice.type}]</span>
                  <span>{notice.title}</span>
                </div>
                <span className="text-sm text-gray-500">{notice.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 할 일 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">예정된 할 일</h2>
          <ul className="space-y-3">
            {dashboardData.todos.map((todo, index) => (
              <li key={index} className={`flex justify-between items-center p-3 bg-${todo.priority}-50 rounded`}>
                <div>
                  <span className="font-medium">{todo.title}</span>
                  <p className="text-sm text-gray-600">{todo.description}</p>
                </div>
                <span className={`text-sm text-${todo.priority}-500`}>D-{todo.daysLeft}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 강의 현황 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">이번 학기 강의 현황</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700">담당 강의</h3>
            <p className="text-2xl font-bold text-blue-900 mt-2">{dashboardData.stats.totalCourses} 과목</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm font-medium text-green-700">총 수강인원</h3>
            <p className="text-2xl font-bold text-green-900 mt-2">{dashboardData.stats.totalStudents} 명</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-sm font-medium text-purple-700">과제 평가</h3>
            <p className="text-2xl font-bold text-purple-900 mt-2">{dashboardData.stats.pendingAssignments}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-700">예정된 시험</h3>
            <p className="text-2xl font-bold text-yellow-900 mt-2">{dashboardData.stats.upcomingExams} 건</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;