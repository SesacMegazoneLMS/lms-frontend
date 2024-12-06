import React, { useState, useEffect } from 'react';
import { enrollmentAPI, courseAPI } from '../../../../api/services';
import useEnrollmentService from "../useEnrollmentService";

const EnrollmentHistory = ({ studentId }) => {
  const [selectedSemester, setSelectedSemester] = useState('2024-1');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  const { getEnrollment, getTimeTableData } = useEnrollmentService();

  // 내가 신청한 강의의 상태를 새로 가져오는 함수
  useEffect(() => {
    const getEnrollmentInComponent = async () => {
      try{
        const result = await getEnrollment(studentId);
        //console.log("Enrollment에서부터 보내줄 result : " + JSON.stringify(result));
        setEnrollments(result);
      }catch(error){
        console.error("신청 강의 정보를 가져오는 중 오류 발생 : ", error);
      }
    };
    getEnrollmentInComponent();
  }, [studentId]);

  const cancelEnrollment = async (studentId, enrollmentId) => {
    try {
      console.log("aaa : " + enrollmentId)
      await enrollmentAPI.deleteCourse(enrollmentId);
      const updatedEnrollments = await getEnrollment(studentId);
      setEnrollments(updatedEnrollments);
      await getTimeTableData(studentId);
    } catch (err) {
      console.error("수강신청 취소 중 오류 발생:", err);
      setError(err);
    }
  }

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

  const totalCredits = enrollments.reduce((sum, enrollment) => sum + enrollment.credit, 0);

  // if (loading) {
  //   return <div className="text-center py-8">로딩 중...</div>;
  // }

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
            총 {enrollments.length}과목 / {totalCredits}학점
          </div>
        </div>
      </div>

      {/* 수강신청 내역 */}
      {enrollments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          수강신청 내역이 없습니다.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                과목코드
              </th>
              <th scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                과목명
              </th>
              <th scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                담당교수
              </th>
              <th scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                요일
              </th>
              <th scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                강의시간
              </th>
              {/*<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">*/}
              {/*  신청일시*/}
              {/*</th>*/}
              <th scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                학점
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {enrollments.map((enrollment) => (
                <tr key={enrollment.enrollmentId}>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-900">
                      {enrollment.courseCode}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {enrollment.courseName}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {enrollment.professorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {enrollment.day || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {enrollment.startTime ? enrollment.startTime.split(':').slice(0, 2).join(':') : ''} - {enrollment.endTime ? enrollment.endTime.split(':').slice(0, 2).join(':') : ''}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                    {enrollment.credit}
                    </td>
                    {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">*/}
                    {/*  {getStatusBadge(enrollment.status)}*/}
                    {/*</td>*/}
                    {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">*/}
                    {/*  {enrollment.enrolledAt}*/}
                    {/*</td>*/}
                    <td className="px-6 py-4 text-center flex justify-center items-center">
                      <button
                        className="bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm py-1 px-2"
                        onClick={() => cancelEnrollment(studentId, enrollment.enrollmentId)}
                      >
                      신청취소
                      </button>
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