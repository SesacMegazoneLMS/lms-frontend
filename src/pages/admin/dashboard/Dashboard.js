// Configure Display Languageimport React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../api/services';

// 활동 타입별 색상과 아이콘 정의
const activityConfig = {
  'enrollment': {
    color: 'blue',
    icon: '📝',
    label: '수강신청'
  },
  'grade': {
    color: 'green',
    icon: '📊',
    label: '성적등록'
  },
  'notice': {
    color: 'yellow',
    icon: '📢',
    label: '공지사항'
  }
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalProfessors: 0,
    totalCourses: 0,
    activeEnrollments: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('대시보드 데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">관리자 대시보드</h1>

      {/* 통계 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="총 학생 수"
          value={stats.totalStudents}
          icon="👨‍🎓"
          color="blue"
        />
        <StatCard
          title="총 교수 수"
          value={stats.totalProfessors}
          icon="👨‍🏫"
          color="green"
        />
        <StatCard
          title="총 강의 수"
          value={stats.totalCourses}
          icon="📚"
          color="yellow"
        />
        <StatCard
          title="활성 수강신청"
          value={stats.activeEnrollments}
          icon="✅"
          color="indigo"
        />
      </div>

      {/* 최근 활동 섹션 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 활동</h2>
        <div className="flow-root">
          <ul className="-mb-8">
            {stats.recentActivities.map((activity) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-${activityConfig[activity.type].color}-100`}>
                        {activityConfig[activity.type].icon}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white shadow rounded-lg p-6 border-l-4 border-${color}-500`}>
    <div className="flex items-center">
      <div className={`flex-shrink-0 rounded-full p-3 bg-${color}-100`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="ml-5">
        <h2 className="text-sm font-medium text-gray-500 truncate">{title}</h2>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;