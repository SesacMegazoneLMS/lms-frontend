import React, { useState, useEffect } from 'react';
import { courseAPI } from '../../../api/services';
import CourseEditModal from './CourseEditModal';
const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseAPI.getCourses();
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

  const handleEditCourse = async (courseData) => {
    try {
      await courseAPI.updateCourse(courseData.id, courseData);
      setCourses(courses.map(course => 
        course.id === courseData.id ? courseData : course
      ));
      setIsEditModalOpen(false);
      alert('강의가 수정되었습니다.');
    } catch (err) {
      alert('강의 수정에 실패했습니다.');
      console.error('Error updating course:', err);
    }
  };

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">강의 관리</h1>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          새 강의 등록
        </button>
      </div>

      {/* 강의 목록 테이블 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                과목코드
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                과목명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                담당교수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학점
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수강인원
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {course.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.professor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.credits}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.enrolled}/{course.capacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 강의 수정/등록 모달 */}
      {isEditModalOpen && (
        <CourseEditModal
          course={selectedCourse}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCourse(null);
          }}
          onSave={handleEditCourse}
        />
      )}
    </div>
  );
};

export default CourseManagement;