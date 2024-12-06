import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CourseEdit = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [courseData, setCourseData] = useState({
    courseCode: '',
    courseName: '',
    departmentId: '',
    credits: '',
    description: '',
    category: 'MAJOR_REQUIRED',
    semester: '2024-1'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [departmentsResponse, courseResponse] = await Promise.all([
          axios.get('http://localhost:8081/departments'),
          axios.get(`http://localhost:8081/courses/${courseId}`)
        ]);
        setDepartments(departmentsResponse.data);
        setCourseData(courseResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: name === 'credits' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/courses/${courseId}`, courseData);
      alert('강의가 성공적으로 수정되었습니다.');
      navigate('/admin/courses');
    } catch (err) {
      setError('강의 수정에 실패했습니다.');
      console.error('Error updating course:', err);
    }
  };

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">강의 수정</h1>

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
              <option value={1}>1학점</option>
              <option value={2}>2학점</option>
              <option value={3}>3학점</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              강의 설명
            </label>
            <textarea
              name="description"
              value={courseData.description}
              onChange={handleChange}
              maxLength={50}
              rows={2}
              placeholder="간단한 강의 설명을 입력하세요 (최대 50자)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              {courseData.description.length}/50자
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/courses')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEdit;