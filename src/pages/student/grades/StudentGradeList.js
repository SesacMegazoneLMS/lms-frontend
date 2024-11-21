import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentGradeList = () => {
  const [grades, setGrades] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [semester, setSemester] = useState('1');
  const [year, setYear] = useState('2024');
  const navigate = useNavigate();

  const courses = [
    {
      courseId: '11111111-aaaa-1111-1111-111111111111',
      courseName: '컴퓨터프로그래밍기초',
    },
    {
      courseId: '22222222-aaaa-2222-2222-222222222222',
      courseName: '자료구조',
    },
  ];

  useEffect(() => {
    const fetchGrades = async () => {
      if (selectedCourseId) {
        try {
          const response = await axios.get('/grades/course', {
            params: {
              semester: semester,
              year: parseInt(year),
              courseId: selectedCourseId,
              professorId: 'ffffffff-1111-1111-1111-111111111111',
            },
          });
          setGrades(response.data);
        } catch (error) {
          console.error('Error fetching grades:', error);
          alert('성적 정보를 불러오는데 실패했습니다.');
        }
      }
    };

    fetchGrades();
  }, [selectedCourseId, semester, year]);

  const handleCourseSelect = (e) => {
    setSelectedCourseId(e.target.value);
  };

  const handleAppealClick = (gradeId) => {
    navigate(`/student/grade-appeal/${gradeId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">학생 성적 조회</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">년도:</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">학기:</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="1">1학기</option>
              <option value="2">2학기</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">강의:</label>
            <select
              value={selectedCourseId}
              onChange={handleCourseSelect}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">강의 선택</option>
              {courses.map(course => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedCourseId && (
          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학번</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">과제점수</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">중간고사</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기말고사</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">출석점수</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총점</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grades.map((grade) => (
                    <tr key={grade.gradeId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.studentNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{grade.assignmentScore}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{grade.midtermScore}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{grade.finalScore}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{grade.attendanceScore}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.totalScore}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleAppealClick(grade.gradeId)}
                          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          이의신청
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentGradeList;