import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { courseAPI, professorAPI } from '../../../api/services';

const Grades = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [gradeData, setGradeData] = useState({
    midterm: {},
    final: {},
    assignments: {},
    attendance: {},
    total: {}
  });

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      const coursesData = await courseAPI.getProfessorCourses();
      setCourses(coursesData);
      if (coursesData.length > 0) {
        setSelectedCourse(coursesData[0].id);
      }
    } catch (err) {
      setError('강의 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudentGrades = useCallback(async (courseId) => {
    if (!courseId) return;
    try {
      setLoading(true);
      const studentsData = await professorAPI.getCourseStudents(courseId);
      const gradesData = await professorAPI.getCourseGrades(courseId); /////////////
      setStudents(studentsData);
      setGradeData(gradesData);
    } catch (err) {
      setError('성적 데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching grades:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  useEffect(() => {
    if (selectedCourse) {
      fetchStudentGrades(selectedCourse); /////////
    }
  }, [selectedCourse, fetchStudentGrades]);

  const handleGradeChange = (studentId, type, value) => {
    setGradeData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [studentId]: value
      }
    }));
  };

  const handleSaveGrades = async () => {
    try {
      await professorAPI.updateGrades(selectedCourse, gradeData);
      alert('성적이 저장되었습니다.');
    } catch (err) {
      alert('성적 저장에 실패했습니다.');
      console.error('Error saving grades:', err);
    }
  };

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="space-y-6 p-6">
      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('input')}
            className={`${activeTab === 'input'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            성적 입력/수정
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`${activeTab === 'statistics'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            성적 산출/통계
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`${activeTab === 'settings'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            성적 공개 설정
          </button>
          <button
            onClick={() => setActiveTab('appeals')}
            className={`${activeTab === 'appeals'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            성적 이의 신청
          </button>
        </nav>
      </div>

      {/* 강의 선택 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label htmlFor="course-select" className="block text-sm font-medium text-gray-700">
            강의 선택
          </label>
          <select
            id="course-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))
            ) : (
              <option value="">강의가 없습니다</option>
            )}
          </select>
        </div>
      </div>

      {/* 성적 입력 테이블 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학번
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                중간고사 (30%)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기말고사 (30%)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                과제 (30%)
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                출석 (10%)
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                총점
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학점
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students && students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gradeData.midterm[student.id] || ''}
                      onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gradeData.final[student.id] || ''}
                      onChange={(e) => handleGradeChange(student.id, 'final', e.target.value)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gradeData.assignments[student.id] || ''}
                      onChange={(e) => handleGradeChange(student.id, 'assignments', e.target.value)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gradeData.attendance[student.id] || ''}
                      onChange={(e) => handleGradeChange(student.id, 'attendance', e.target.value)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {gradeData.total[student.id] || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {gradeData.total[student.id] ? 'A+' : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  등록된 학생이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveGrades}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          성적 저장
        </button>
      </div>
    </div>
  );
};

export default Grades;
