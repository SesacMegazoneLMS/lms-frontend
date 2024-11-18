import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { gradeAPI } from '../../../api/services/gradeAPI';
import courseAPI from '../../../api/services/courseAPI';

const Grades = () => {
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [grades, setGrades] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

 // 성적 조회 함수
 const fetchGrades = useCallback(async () => {
  if (!selectedCourse) return;
  
  try {
    setLoading(true);
    const response = await gradeAPI.getGradesByCourse(
      selectedCourse,
      selectedSemester,
      selectedYear
    );
    setGrades(response);
  } catch (error) {
    setError('성적 정보를 불러오는데 실패했습니다.');
  } finally {
    setLoading(false);
  }
}, [selectedCourse, selectedSemester, selectedYear]);

  // 성적 수정 핸들러
  const handleGradeChange = (studentId, field, value) => {
    setGrades(prevGrades => 
      prevGrades.map(grade => 
        grade.studentId === studentId 
          ? { ...grade, [field]: Number(value) }
          : grade
      )
    );
  };

  // 성적 확정 핸들러
  const handleGradeSubmit = async () => {
    try {
      setLoading(true);
      await gradeAPI.updateGrades(grades);
      setIsEditing(false);
      alert('성적이 성공적으로 확정되었습니다.');
    } catch (error) {
      setError('성적 확정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };



  // 강의 목록 조회
  const fetchCourses = useCallback(async () => {
    if (!selectedSemester || !selectedYear || !user?.id) return;

    try {
      setLoading(true);
      const response = await courseAPI.getProfessorCourses(
        user.id,
        selectedYear,
        selectedSemester
      );
      setCourses(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('강의 목록 조회 실패:', error);
      setError('강의 목록을 불러오는데 실패했습니다.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSemester, selectedYear, user?.id]);

  // 강의 목록 조회 useEffect
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  

  // 강의 선택시 성적 조회
  useEffect(() => {
    if (selectedCourse) {
      fetchGrades();
    }
  }, [selectedCourse, fetchGrades]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">성적 관리</h1>
      
      <div className="mb-6 flex space-x-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="rounded-md border-gray-300"
        >
          <option value="">년도 선택</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="rounded-md border-gray-300"
        >
          <option value="">학기 선택</option>
          <option value="1">1학기</option>
          <option value="2">2학기</option>
        </select>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="rounded-md border-gray-300"
        >
          <option value="">강의 선택</option>
          {courses.map(course => (
            <option key={course.id} value={course.code}>
              {course.name} ({course.code})
            </option>
          ))}
        </select>
      </div>

      {loading && <div>로딩 중...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {selectedCourse && (
        <div className="mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학번</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">과제점수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">중간고사</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기말고사</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총점</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades.map(grade => (
                <tr key={grade.studentId}>
                  <td className="px-6 py-4 whitespace-nowrap">{grade.studentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{grade.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={grade.assignment}
                      onChange={(e) => handleGradeChange(grade.studentId, 'assignment', e.target.value)}
                      className="w-20 border rounded px-2 py-1"
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={grade.midterm}
                      onChange={(e) => handleGradeChange(grade.studentId, 'midterm', e.target.value)}
                      className="w-20 border rounded px-2 py-1"
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={grade.final}
                      onChange={(e) => handleGradeChange(grade.studentId, 'final', e.target.value)}
                      className="w-20 border rounded px-2 py-1"
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(grade.assignment + grade.midterm + grade.final) / 3}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditing ? '수정 취소' : '성적 수정'}
            </button>
            {isEditing && (
              <button
                onClick={handleGradeSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                성적 확정
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};



export default Grades;