import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseCreate = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [courseData, setCourseData] = useState({
    courseCode: '',
    courseName: '',
    departmentId: '',
    credits: 'ONE',
    description: ''
  });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8081/departments');
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('학과 정보를 불러오는데 실패했습니다.');
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const submitData = {
        courseCode: courseData.courseCode,
        courseName: courseData.courseName,
        departmentId: courseData.departmentId,
        credits: courseData.credits,
        description: courseData.description
      };

      console.log('Submitting data:', submitData);

      const response = await axios.post('http://localhost:8081/courses', submitData);
      console.log('Server response:', response.data);

      alert('강의가 성공적으로 등록되었습니다.');
      navigate('/admin/courses');
    } catch (err) {
      console.error('Error creating course:', err);
      setError(err.response?.data?.message || '강의 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">새 강의 등록</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              강의코드
            </label>
            <input
              type="text"
              name="courseCode"
              value={courseData.courseCode}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              강의명
            </label>
            <input
              type="text"
              name="courseName"
              value={courseData.courseName}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              소속학과
            </label>
            <select
              name="departmentId"
              value={courseData.departmentId}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">학과 선택</option>
              {departments.map(dept => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              학점
            </label>
            <select
              name="credits"
              value={courseData.credits}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">학점 선택</option>
              <option value="ONE">1학점</option>
              <option value="TWO">2학점</option>
              <option value="THREE">3학점</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              강의 설명
            </label>
            <input
              type="text"
              name="description"
              value={courseData.description}
              onChange={handleChange}
              maxLength={20}
              placeholder="간단한 강의 설명을 입력하세요 (최대 20자)"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              {courseData.description.length}/20자
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/courses')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? '처리중...' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CourseCreate;