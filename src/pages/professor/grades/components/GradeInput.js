import React, { useState, useEffect } from 'react';
import axios from 'axios';

// axios 기본 설정 추가
axios.defaults.baseURL = 'http://localhost:8081';
// 또는 .env 파일에서 관리
// axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const Grades = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [selectedCourseId, setSelectedCourseId] = useState('11111111-aaaa-1111-1111-111111111111');
  const [professorId, setProfessorId] = useState('ffffffff-1111-1111-1111-111111111111');
  const [grades, setGrades] = useState([]);

  const courses = [
    {
      courseId: '11111111-aaaa-1111-1111-111111111111',
      courseName: '컴퓨터프로그래밍기초',
      professor: '김교수', // professor_id: 'ffffffff-1111-1111-1111-111111111111'
      professor_id: 'ffffffff-1111-1111-1111-111111111111',
      semester: '1',
      year: 2024
    },
    {
      courseId: '22222222-aaaa-2222-2222-222222222222',
      courseName: '자료구조',
      professor: '김교수', // professor_id: 'ffffffff-1111-1111-1111-111111111111'
      professor_id: 'ffffffff-1111-1111-1111-111111111111',
      semester: '1',
      year: 2024
    }
  ];

  useEffect(() => {
    const fetchGrades = async () => {
      if (selectedCourseId && professorId) { // professorId 체크 추가
        try {
          console.log('Fetching grades with params:', {
            semester: selectedSemester,
            year: selectedYear,
            courseId: selectedCourseId,
            professorId: professorId,
          });

          const response = await axios.get(`/grades/course`, {
            params: {
              semester: selectedSemester,
              year: parseInt(selectedYear),
              courseId: selectedCourseId,
              professorId: professorId,
            }
          });
          // 응답 데이터가 배열인지 확인
          console.log('Received grades data:', response.data);
          setGrades(Array.isArray(response.data) ? [...response.data] : []);
        } catch (error) {
          console.error('Error fetching grades:', error);
          alert('성적 정보를 불러오는데 실패했습니다.');
        }
      }
    };

    fetchGrades();
  }, [selectedCourseId, selectedSemester, selectedYear, professorId]);

  // 강의 선택 시 해당 교수 ID도 함께 설정
  const handleCourseSelect = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);

    // 선택된 강의의 교수 ID 설정
    const selectedCourse = courses.find(course => course.courseId === courseId);
    if (selectedCourse) {
      setProfessorId(selectedCourse.professor_id);
    }
  };

  const handleGradeUpdate = async () => {
    try {
      const updatedGrades = grades.map(grade => ({
        gradeId: grade.gradeId,
        assignScore: grade.assignmentScore,
        midtermScore: grade.midtermScore,
        finalScore: grade.finalScore,
        attendanceScore: grade.attendanceScore
      }));

      await axios.put('/grades/scores/batch', updatedGrades);
      alert('성적이 성공적으로 수정되었습니다.');

      const response = await axios.get(`/grades/course`, {
        params: {
          semester: selectedSemester,
          year: parseInt(selectedYear),
          courseId: selectedCourseId,
          professorId: professorId,
        }
      });
      // 응답 데이터가 배열인지 확인
      console.log('Received grades data:', response.data);
      setGrades(Array.isArray(response.data) ? [...response.data] : []);

    } catch (error) {
      console.error('Error updating grades:', error);
      alert('성적 수정에 실패했습니다.');
    }
  };

  // input 값 변경 핸들러 추가
  const handleInputChange = (gradeId, field, value) => {
    setGrades(prevGrades =>
      prevGrades.map(grade =>
        grade.gradeId === gradeId
          ? { ...grade, [field]: value }
          : grade
      )
    );
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
              onChange={handleCourseSelect}
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
                          value={grade.assignmentScore || ''}
                          onChange={(e) => handleInputChange(grade.gradeId, 'assignmentScore', e.target.value)}
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grade.midtermScore || ''}
                          onChange={(e) => handleInputChange(grade.gradeId, 'midtermScore', e.target.value)}
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grade.finalScore || ''}
                          onChange={(e) => handleInputChange(grade.gradeId, 'finalScore', e.target.value)}
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grade.attendanceScore || ''}
                          onChange={(e) => handleInputChange(grade.gradeId, 'attendanceScore', e.target.value)}
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