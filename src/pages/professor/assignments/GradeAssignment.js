import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { assignmentAPI, courseAPI } from '../../../api/services';

const GradeAssignment = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchAssignmentDetails();
  }, [assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      const [assignmentData, submissionsData] = await Promise.all([
        assignmentAPI.getAssignment(assignmentId),
        assignmentAPI.getSubmissions(assignmentId)
      ]);
      
      setAssignment(assignmentData);
      setSubmissions(submissionsData);
    } catch (err) {
      setError('과제 정보를 불러오는데 실패했습니다.');
      console.error('Error fetching assignment details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async (submissionId) => {
    try {
      const grade = parseFloat(gradeInput);
      if (isNaN(grade) || grade < 0 || grade > assignment.maxScore) {
        alert(`0부터 ${assignment.maxScore}점 사이의 점수를 입력해주세요.`);
        return;
      }

      await assignmentAPI.gradeSubmission(submissionId, {
        score: grade,
        feedback: feedback
      });

      // 제출물 목록 업데이트
      setSubmissions(submissions.map(sub => 
        sub.id === submissionId 
          ? { ...sub, score: grade, feedback: feedback, status: 'graded' }
          : sub
      ));

      setSelectedSubmission(null);
      setGradeInput('');
      setFeedback('');
      alert('채점이 완료되었습니다.');
    } catch (err) {
      alert('채점 저장에 실패했습니다.');
      console.error('Error grading submission:', err);
    }
  };

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!assignment) return <div className="text-center py-10">과제를 찾을 수 없습니다.</div>;

  return (
    <div className="p-6">
      {/* 과제 정보 헤더 */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{assignment.title} 채점</h1>
        <div className="text-sm text-gray-500">
          <p>마감일: {new Date(assignment.dueDate).toLocaleDateString()}</p>
          <p>총점: {assignment.maxScore}점</p>
        </div>
      </div>

      {/* 제출물 목록 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학생
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제출일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                점수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {submission.studentName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {submission.studentId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(submission.submittedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${submission.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {submission.status === 'graded' ? '채점완료' : '미채점'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {submission.score !== null ? `${submission.score}/${assignment.maxScore}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    채점하기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 채점 모달 */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {selectedSubmission.studentName} 학생 과제 채점
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  점수 (최대 {assignment.maxScore}점)
                </label>
                <input
                  type="number"
                  min="0"
                  max={assignment.maxScore}
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  피드백
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="4"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={() => handleGradeSubmission(selectedSubmission.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeAssignment;