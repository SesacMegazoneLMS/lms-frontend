import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import courseAPI from '../../../api/services/courseAPI';

const Grades = () => {
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="p-6">
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
          {Array.isArray(courses) && courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <div>로딩 중...</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Grades;