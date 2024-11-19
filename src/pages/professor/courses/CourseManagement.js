import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../../../api/services';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('2024-1');

  useEffect(() => {
    fetchCourses();
  }, [selectedSemester]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseAPI.getProfessorCourses(selectedSemester);
      setCourses(data);
    } catch (err) {
      setError('강의 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('정말 이 강의를 삭제하시겠습니까?')) {
      try {
        await courseAPI.deleteCourse(courseId);
        setCourses(courses.filter(course => course.id !== courseId));
        alert('강의가 삭제되었습니다.');
      } catch (err) {
        alert('강의 삭제에 실패했습니다.');
        console.error('Error deleting course:', err);
      }
    }
  };

  const formatSchedule = (schedule) => {
    // schedule이 문자열인 경우 (예: "월,수 10:30-12:00")
    if (typeof schedule === 'string') {
      return schedule;
    }
    
    // schedule이 배열인 경우
    if (Array.isArray(schedule)) {
      const dayMap = {
        MON: '월',
        TUE: '화',
        WED: '수',
        THU: '목',
        FRI: '금'
      };
      
      return schedule.map(s => 
        `${dayMap[s.day]} ${s.startTime}-${s.endTime} (${s.room})`
      ).join(', ');
    }
    
    // schedule이 undefined이거나 다른 형식인 경우
    return '일정 없음';
  };

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">내 강의 관리</h1>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="2024-1">2024년 1학기</option>
            <option value="2024-2">2024년 2학기</option>
          </select>
        </div>
        <Link
          to="/professor/courses/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          새 강의 개설
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {courses.map((course) => (
            <li key={course.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-blue-600 truncate">
                        {course.name} ({course.code})
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {course.category === 'MAJOR_REQUIRED' ? '전공필수' :
                           course.category === 'MAJOR_ELECTIVE' ? '전공선택' :
                           course.category === 'GENERAL_REQUIRED' ? '교양필수' : '교양선택'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          수강인원: {course.enrolled}/{course.capacity}
                        </p>
                        <p className="text-sm text-gray-500">
                          학점: {course.credits}학점
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          강의시간: {formatSchedule(course.schedule)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-6 flex items-center space-x-4">
                    <Link
                      to={`/professor/courses/${course.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                    <Link
                      to={`/professor/courses/${course.id}/students`}
                      className="text-green-600 hover:text-green-900"
                    >
                      수강생 관리
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {courses.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          {selectedSemester}에 개설된 강의가 없습니다.
        </div>
      )}
    </div>
  );
};

export default CourseManagement;