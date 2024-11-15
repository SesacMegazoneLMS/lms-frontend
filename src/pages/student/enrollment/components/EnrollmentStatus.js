import React, { useState, useEffect } from 'react';
import { enrollmentAPI } from '../../../../api/services';

const EnrollmentStatus = ({ enrolledCourses }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await enrollmentAPI.getStatus();
        setStatus(data);
      } catch (err) {
        setError('수강신청 현황을 불러오는데 실패했습니다.');
        console.error('Error fetching status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) {
    return <div className="text-center py-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  if (!status || !status.limits) return null; // limits가 없으면 null 반환

  const { user, limits } = status;

  // 현재 신청 현황 계산
  const currentStatus = {
    totalCredits: enrolledCourses.reduce((sum, course) => sum + course.credits, 0),
    majorCredits: enrolledCourses
      .filter(course => course.category.includes('전공'))
      .reduce((sum, course) => sum + course.credits, 0),
    generalCredits: enrolledCourses
      .filter(course => course.category.includes('교양'))
      .reduce((sum, course) => sum + course.credits, 0),
    totalCourses: enrolledCourses.length
  };

  // 진행률 계산
  const getProgressPercentage = (current, max) => {
    return Math.min((current / max) * 100, 100);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* 학생 정보 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-medium text-gray-900">수강신청 현황</h2>
            <p className="mt-1 text-sm text-gray-500">
              {user.department} {user.year}학년 {user.semester}학기
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">학번: {user.studentId}</p>
            <p className="text-sm text-gray-500">{user.name}</p>
          </div>
        </div>
      </div>

      {/* 수강신청 현황 */}
      <div className="p-6 space-y-6">
        {/* 전체 학점 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              전체 학점 ({currentStatus.totalCredits}/{limits.maxCredits}학점)
            </span>
            <span className="text-sm text-gray-500">
              {getProgressPercentage(currentStatus.totalCredits, limits.maxCredits).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 rounded-full h-2 transition-all duration-300"
              style={{
                width: `${getProgressPercentage(currentStatus.totalCredits, limits.maxCredits)}%`
              }}
            ></div>
          </div>
        </div>

        {/* 수강신청 요약 */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">신청 과목 수</p>
            <p className="text-2xl font-bold text-gray-900">{currentStatus.totalCourses}과목</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">잔여 가능 학점</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.max(limits.maxCredits - currentStatus.totalCredits, 0)}학점
            </p>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">수강신청 안내</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>최소 {limits.minCredits}학점 이상 신청해야 합니다.</li>
            <li>최대 {limits.maxCredits}학점까지 신청 가능합니다.</li>
            <li>전공 과목은 최대 {limits.maxMajorCredits}학점까지 신청 가능합니다.</li>
            <li>교양 과목은 최대 {limits.maxGeneralCredits}학점까지 신청 가능합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentStatus;