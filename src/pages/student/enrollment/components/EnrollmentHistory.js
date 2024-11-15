import React, { useState, useEffect } from 'react';
import { enrollmentAPI, courseAPI } from '../../../../api/services';

const EnrollmentHistory = () => {
  const [selectedSemester, setSelectedSemester] = useState('2024-1');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const enrollments = await enrollmentAPI.getHistory(selectedSemester);
        
        // 각 수강신청 항목에 대한 강의 정보 가져오기
        const coursesPromises = enrollments.map(enrollment => 
          courseAPI.getCourse(enrollment.courseId)
        );
        
        const courses = await Promise.all(coursesPromises);
        
        // 수강신청 정보와 강의 정보 합치기
        const fullHistory = enrollments.map((enrollment, index) => ({
          ...enrollment,
          ...courses[index]
        }));
        
        setHistory(fullHistory);
      } catch (err) {
        setError('수강신청 내역을 불러오는데 실패했습니다.');
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedSemester]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            신청완료
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            대기중
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            취소됨
          </span>
        );
      default:
        return null;
    }
  };

  const formatSchedule = (schedule) => {
    return schedule.map(s => `${s.day} ${s.startTime}-${s.endTime} (${s.room})`).join(', ');
  };

  const totalCredits = history.reduce((sum, course) => sum + course.credits, 0);

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* 학기 선택 및 요약 정보 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="2024-1">2024년 1학기</option>
            <option value="2023-2">2023년 2학기</option>
            <option value="2023-1">2023년 1학기</option>
          </select>
          <div className="text-sm text-gray-600">
            총 {history.length}과목 / {totalCredits}학점
          </div>
        </div>
      </div>

      {/* 수강신청 내역 */}
      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          수강신청 내역이 없습니다.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  과목코드
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  과목명
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  담당교수
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  학점
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  강의시간
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  신청일시
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.professor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatSchedule(course.schedule)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusBadge(course.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.enrolledAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 안내사항 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-2">수강신청 내역 안내</h4>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
          <li>수강신청 변경기간: 2024.03.02 ~ 2024.03.08</li>
          <li>수강신청 취소는 변경기간 내에만 가능합니다.</li>
          <li>문의사항은 학사지원팀으로 연락주세요.</li>
        </ul>
      </div>
    </div>
  );
};

export default EnrollmentHistory;