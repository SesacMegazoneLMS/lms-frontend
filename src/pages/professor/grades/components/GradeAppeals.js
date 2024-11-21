import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GradeAppeals = () => {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppeals();
  }, []);

  const fetchAppeals = async () => {
    try {
      const response = await axios.get('/grade-appeals');
      console.log('Received appeals data:', response.data);
      setAppeals(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appeals:', err);
      setError('이의신청 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const handleAppealProcess = async (appealId, approved) => {
    try {
      await axios.put(`/grade-appeals/${appealId}/${approved ? 'approve' : 'reject'}`);
      alert(approved ? '이의신청이 승인되었습니다.' : '이의신청이 거절되었습니다.');
      fetchAppeals();
    } catch (error) {
      console.error('Error processing appeal:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!appeals || appeals.length === 0) return <div>이의신청 내역이 없습니다.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">성적 이의신청 관리</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청일시</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학생정보</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">과목</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이의신청 내용</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">점수</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">처리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appeals.map((appeal) => (
              <tr key={appeal.appealId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(appeal.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{appeal.studentNumber}</div>
                  <div className="text-sm text-gray-900">{appeal.studentName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {appeal.courseName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {appeal.content}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>과제: {appeal.requestedAssignScore !== undefined ? appeal.requestedAssignScore : '-'}</div>
                  <div>중간: {appeal.requestedMidtermScore !== undefined ? appeal.requestedMidtermScore : '-'}</div>
                  <div>기말: {appeal.requestedFinalScore !== undefined ? appeal.requestedFinalScore : '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${appeal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      appeal.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'}`}>
                    {appeal.status === 'PENDING' ? '대기중' :
                      appeal.status === 'APPROVED' ? '승인됨' : '거절됨'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {appeal.status === 'PENDING' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleAppealProcess(appeal.appealId, true)}
                        className="text-green-600 hover:text-green-900"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleAppealProcess(appeal.appealId, false)}
                        className="text-red-600 hover:text-red-900"
                      >
                        거절
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeAppeals;
