import React, { useState, useEffect } from 'react';
import { assignmentAPI, courseAPI } from '../../../api/services';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchAssignments(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const data = await courseAPI.getProfessorCourses();
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourse(data[0].id);
      }
    } catch (err) {
      setError('강의 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching courses:', err);
    }
  };

  const fetchAssignments = async (courseId) => {
    try {
      setLoading(true);
      const data = await assignmentAPI.getAssignments(courseId);
      setAssignments(data);
    } catch (err) {
      setError('과제 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      const newAssignment = await assignmentAPI.createAssignment(selectedCourse, assignmentData);
      setAssignments([...assignments, newAssignment]);
    } catch (err) {
      alert('과제 생성에 실패했습니다.');
      console.error('Error creating assignment:', err);
    }
  };

  const handleUpdateAssignment = async (assignmentId, assignmentData) => {
    try {
      const updatedAssignment = await assignmentAPI.updateAssignment(assignmentId, assignmentData);
      setAssignments(assignments.map(assignment => 
        assignment.id === assignmentId ? updatedAssignment : assignment
      ));
    } catch (err) {
      alert('과제 수정에 실패했습니다.');
      console.error('Error updating assignment:', err);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('정말 이 과제를 삭제하시겠습니까?')) {
      try {
        await assignmentAPI.deleteAssignment(assignmentId);
        setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
      } catch (err) {
        alert('과제 삭제에 실패했습니다.');
        console.error('Error deleting assignment:', err);
      }
    }
  };

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">과제 관리</h1>

      {/* 강의 선택 */}
      <div className="mb-6">
        <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-2">
          강의 선택
        </label>
        <select
          id="course-select"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* 과제 목록 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {assignments.map((assignment) => (
            <li key={assignment.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {assignment.title}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      마감일: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {assignment.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <button
                      onClick={() => handleUpdateAssignment(assignment.id, { /* 수정할 데이터 */ })}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 새 과제 생성 버튼 */}
      <div className="mt-6">
        <button
          onClick={() => handleCreateAssignment({ /* 새 과제 데이터 */ })}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          새 과제 생성
        </button>
      </div>
    </div>
  );
};

export default AssignmentManagement;