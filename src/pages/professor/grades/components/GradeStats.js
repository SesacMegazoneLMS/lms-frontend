import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GradeVisibility from './GradeVisibility';

const GradeStats = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [gradeList, setGradeList] = useState([]);
  const [sortBy, setSortBy] = useState('totalScore');

  const courses = [
    {
      courseId: '11111111-aaaa-1111-1111-111111111111',
      courseName: '컴퓨터프로그래밍기초',
      openingId: 'bbbbbbbb-1111-aaaa-1111-111111111111',
      semester: '1',
      year: 2024
    },
    {
      courseId: '22222222-aaaa-2222-2222-222222222222',
      courseName: '자료구조',
      openingId: 'bbbbbbbb-2222-aaaa-2222-222222222222',
      semester: '1',
      year: 2024
    }
  ];

  useEffect(() => {
    if (selectedCourseId) {
      fetchGradeStatistics();
      fetchGradeList();
    }
  }, [selectedCourseId, sortBy]);

  const fetchGradeStatistics = async () => {
    try {
      const selectedCourse = courses.find(course => course.courseId === selectedCourseId);
      const response = await axios.get(`/grades/statistics/${selectedCourse.openingId}`);

      const modifiedStatistics = {
        ...response.data,
        totalStudents: 3
      };

      setStatistics(modifiedStatistics);
    } catch (error) {
      console.error('통계 데이터 조회 실패:', error);
    }
  };

  const fetchGradeList = async () => {
    try {
      const selectedCourse = courses.find(course => course.courseId === selectedCourseId);
      const response = await axios.get(`/grades/list/${selectedCourse.openingId}`, {
        params: { sortBy }
      });

      const gradesWithTotal = response.data.map(grade => ({
        ...grade,
        assignmentScore: grade.assignScore || grade.assignmentScore || 0,
        totalScore: calculateTotalScore({
          assignmentScore: grade.assignScore || grade.assignmentScore || 0,
          midtermScore: grade.midtermScore || 0,
          finalScore: grade.finalScore || 0,
          attendanceScore: grade.attendanceScore || 0
        })
      }));

      setGradeList(gradesWithTotal);
    } catch (error) {
      console.error('성적 목록 조회 실패:', error);
    }
  };

  const calculateTotalScore = (grade) => {
    return Math.round(
      grade.assignmentScore * 0.2 +
      grade.midtermScore * 0.4 +
      grade.finalScore * 0.4
      // grade.attendanceScore * 0.1
    );
  };

  const handleExcelDownload = () => {
    // 엑셀 다운로드 로직 구현
  };

  const handlePrint = () => {
    window.print();
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-blue-100';
      case 'B+':
      case 'B':
        return 'bg-green-100';
      case 'C+':
      case 'C':
        return 'bg-yellow-100';
      case 'D+':
      case 'D':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      {/* 필터 영역 */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">년도:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
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
            onChange={(e) => setSelectedSemester(e.target.value)}
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

      {statistics && (
        <>
          {/* 통계 요약 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">수강인원</h3>
              <p className="text-2xl font-bold">{statistics.totalStudents}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">평균 점수</h3>
              <p className="text-2xl font-bold">{statistics.averageScore}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">최고 점수</h3>
              <p className="text-2xl font-bold">{statistics.highestScore}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">최저 점수</h3>
              <p className="text-2xl font-bold">{statistics.lowestScore}</p>
            </div>
          </div>

          {/* 성적 목록 */}
          <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
            <h3 className="text-lg font-medium mb-4">성적 목록</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순위</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학번</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => setSortBy('assignmentScore')}>과제</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => setSortBy('midtermScore')}>중간</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => setSortBy('finalScore')}>기말</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">출석</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => setSortBy('totalScore')}>총점</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학점</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gradeList.map((grade, index) => (
                  <tr key={grade.gradeId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.studentNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.assignScore}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.midtermScore}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.finalScore}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.attendanceScore}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.totalScore}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`px-2 py-1 rounded ${getGradeColor(grade.letterGrade)}`}>
                        {grade.letterGrade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 엑셀 다운로드 및 인쇄 버튼 */}
          <div className="mt-6 flex justify-end">
            <button onClick={handleExcelDownload} className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              엑셀 다운로드
            </button>
            <button onClick={handlePrint} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              인쇄
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GradeStats;
