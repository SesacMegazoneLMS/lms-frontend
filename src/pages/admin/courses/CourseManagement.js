import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState({}); // 학과 정보를 저장할 state
  const [selectedDepartment, setSelectedDepartment] = useState(''); // 선택된 학과
  const [departmentList, setDepartmentList] = useState([]); // 학과 목록 배열

  // 페이징과 필터링을 위한 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCredits, setSelectedCredits] = useState('');
  const itemsPerPage = 10;

  // 컴포넌트 마운트 시 학과 정보 조회
  useEffect(() => {
    fetchDepartments();
  }, []);

  // 학과 정보 변경시 강의 목록 조회
  useEffect(() => {
    fetchCourses();
  }, [selectedCredits]);

  // 학과 정보 조회 함수
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8081/departments');
      // 학과 정보를 ID를 키로 하는 객체로 변환
      const deptMap = response.data.reduce((acc, dept) => {
        acc[dept.departmentId] = dept.departmentName;
        return acc;
      }, {});
      setDepartments(deptMap);
      setDepartmentList(response.data); // 전체 학과 목록 저장
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  // 강의 목록 조회 함수
  const fetchCourses = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:8081/courses';
      if (selectedCredits) {
        url = `http://localhost:8081/courses/credit/${selectedCredits}`;
      }
      const response = await axios.get(url);
      setCourses(response.data);
    } catch (err) {
      setError('강의 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // 강의 삭제 함수
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('정말 이 강의를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:8081/courses/${courseId}`);
        fetchCourses();
        alert('강의가 삭제되었습니다.');
      } catch (err) {
        alert('강의 삭제에 실패했습니다.');
        console.error('Error deleting course:', err);
      }
    }
  };

  // 학과명 조회 함수
  const getDepartmentName = (departmentId) => {
    return departments[departmentId] || '-';
  };

  // credits enum을 숫자로 변환하는 함수
  const getCreditsValue = (creditsEnum) => {
    switch (creditsEnum) {
      case 'ONE': return 1;
      case 'TWO': return 2;
      case 'THREE': return 3;
      default: return '-';
    }
  };

  // 필터링된 강의 목록을 반환하는 함수
  const getFilteredCourses = () => {
    return courses.filter(course => {
      const matchesCredit = !selectedCredits || course.credits === selectedCredits;
      const matchesDepartment = !selectedDepartment || course.departmentId === selectedDepartment;
      return matchesCredit && matchesDepartment;
    });
  };

  // 페이지네이션 관련 계산
  const filteredCourses = getFilteredCourses();
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 학점 필터 변경 핸들러
  const handleCreditsChange = (e) => {
    setSelectedCredits(e.target.value);
    setCurrentPage(1);
  };

  // 학과 필터 변경 핸들러
  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1);
  };

  // UUID를 5글자로 줄이는 함수 추가
  const shortenUUID = (uuid) => {
    return uuid ? uuid.substring(0, 5) : '-';
  };


  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">강의 관리</h1>
        <div className="flex items-center space-x-4">
          {/* 학과 필터 셀렉트 박스 */}
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">전체 학과</option>
            {departmentList.map(dept => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.departmentName}
              </option>
            ))}
          </select>

          {/* 학점 필터 셀렉트 박스 */}
          <select
            value={selectedCredits}
            onChange={handleCreditsChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">전체 학점</option>
            <option value="ONE">1학점</option>
            <option value="TWO">2학점</option>
            <option value="THREE">3학점</option>
          </select>

          <button
            onClick={() => navigate('/admin/courses/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            새 강의 등록
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                강의ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                강의코드
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                강의명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학과
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학점
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                설명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((course) => (
              <tr key={course.courseId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {shortenUUID(course.courseId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {course.courseCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

                  <button
                    onClick={() => navigate(`/admin/courses/${course.courseId}/openings`)}
                    className="text-blue-600 hover:text-blue-900 hover:underline text-left"
                  >
                    {course.courseName}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getDepartmentName(course.departmentId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getCreditsValue(course.credits)}학점
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {course.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => navigate(`/admin/courses/${course.courseId}/edit`)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.courseId)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        {filteredCourses.length > 0 && (
          <div className="px-6 py-8 border-t">
            <nav className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
              >
                이전
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded-md ${currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
              >
                다음
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* 데이터가 없을 때 메시지 표시 */}
      {!loading && filteredCourses.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          {selectedDepartment || selectedCredits
            ? '검색 결과가 없습니다.'
            : '등록된 강의가 없습니다.'}
        </div>
      )}
    </div>
  );
};

export default CourseManagement;