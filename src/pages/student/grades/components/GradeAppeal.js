import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const GradeAppeal = () => {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const [grade, setGrade] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const response = await axios.get(`/grades/${gradeId}`);
        if (response.data) {
          setGrade({
            studentNumber: response.data.studentNumber,
            studentName: response.data.studentName,
            courseName: response.data.courseName,
            assignScore: response.data.assignmentScore,
            midtermScore: response.data.midtermScore,
            finalScore: response.data.finalScore,
            totalScore: response.data.totalScore
          });
        }
      } catch (err) {
        console.error('Error fetching grade:', err);
        setError('성적 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (gradeId) {
      fetchGrade();
    }
  }, [gradeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/grade-appeals', {
        gradeId: gradeId,
        content: content,
        requestedAssignScore: grade.assignmentScore,
        requestedMidtermScore: grade.midtermScore,
        requestedFinalScore: grade.finalScore
      });
      alert('이의신청이 제출되었습니다.');
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Error submitting appeal:', error);
      alert('이의신청 제출에 실패했습니다.');
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!grade) return <div>성적 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">성적 이의신청</h2>

          {/* 학생 정보 */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">학생 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">학번</p>
                <p className="font-medium">{grade.studentNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">이름</p>
                <p className="font-medium">{grade.studentName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">과목</p>
                <p className="font-medium">{grade.courseName}</p>
              </div>
            </div>
          </div>

          {/* 현재 성적 */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">현재 성적</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">과제</p>
                <p className="font-medium">{grade.assignScore}점</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">중간고사</p>
                <p className="font-medium">{grade.midtermScore}점</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">기말고사</p>
                <p className="font-medium">{grade.finalScore}점</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">총점</p>
                <p className="font-medium">{grade.totalScore}점</p>
              </div>
            </div>
          </div>

          {/* 이의신청 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이의신청 내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                이의신청 제출
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GradeAppeal;