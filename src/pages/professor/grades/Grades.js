import React, { useState } from 'react';

const Grades = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const courses = [
    {
      courseId: 'CSE101',
      courseName: '웹 프로그래밍',
      professor: '김교수',
      semester: '1',
      year: 2024
    },
    {
      courseId: 'CSE102',
      courseName: '데이터베이스',
      professor: '이교수',
      semester: '2',
      year: 2024
    },
    {
      courseId: 'CSE103',
      courseName: '알고리즘',
      professor: '박교수',
      semester: '1',
      year: 2023
    },
    {
      courseId: 'CSE104',
      courseName: '운영체제',
      professor: '최교수',
      semester: '2',
      year: 2023
    }
  ];

  const grades = [
    {
      gradeId: 'G2024001',
      studentNumber: 2024001,
      studentName: '홍길동',
      assignmentScore: 85,
      midtermScore: 90,
      finalScore: 88,
      attendanceScore: 95,
      totalScore: 358
    },
    {
      gradeId: 'G2024002',
      studentNumber: 2024002,
      studentName: '김철수',
      assignmentScore: 92,
      midtermScore: 88,
      finalScore: 95,
      attendanceScore: 100,
      totalScore: 375
    },
    {
      gradeId: 'G2024003',
      studentNumber: 2024003,
      studentName: '이영희',
      assignmentScore: 88,
      midtermScore: 85,
      finalScore: 92,
      attendanceScore: 90,
      totalScore: 355
    }
  ];

  const handleGradeUpdate = () => {
    alert('성적이 수정되었습니다.');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">성적 입력/수정</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">년도:</label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedCourseId('');
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">학기:</label>
            <select
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setSelectedCourseId('');
              }}
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
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">강의 선택</option>
              {courses
                .filter(course =>
                  course.year === parseInt(selectedYear) &&
                  course.semester === selectedSemester
                )
                .map(course => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </option>
                ))
              }
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grade.assignmentScore}
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grade.midtermScore}
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grade.finalScore}
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grade.attendanceScore}
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.totalScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleGradeUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                성적확정
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grades;