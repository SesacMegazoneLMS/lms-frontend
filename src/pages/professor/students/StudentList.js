import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courseAPI, studentAPI } from '../../../api/services';

const StudentList = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  });

  useEffect(() => {
    fetchCourseAndStudents();
  }, [courseId]);

  const fetchCourseAndStudents = async () => {
    try {
      setLoading(true);
      const [courseData, studentsData] = await Promise.all([
        courseAPI.getCourse(courseId),
        studentAPI.getCourseStudents(courseId)
      ]);
      
      setCourse(courseData);
      setStudents(studentsData);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching course and students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAttendanceUpdate = async (studentId, date, status) => {
    try {
      await studentAPI.updateAttendance(courseId, studentId, date, status);
      // 출석 상태 업데이트 후 학생 목록 새로고침
      const updatedStudents = await studentAPI.getCourseStudents(courseId);
      setStudents(updatedStudents);
    } catch (err) {
      alert('출석 상태 업데이트에 실패했습니다.');
      console.error('Error updating attendance:', err);
    }
  };

  const handleGradeUpdate = async (studentId, grade) => {
    try {
      await studentAPI.updateGrade(courseId, studentId, grade);
      // 성적 업데이트 후 학생 목록 새로고침
      const updatedStudents = await studentAPI.getCourseStudents(courseId);
      setStudents(updatedStudents);
    } catch (err) {
      alert('성적 업데이트에 실패했습니다.');
      console.error('Error updating grade:', err);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         student.studentId.includes(filters.search);
    const matchesStatus = filters.status === 'all' || student.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!course) return <div className="text-center py-10">강의를 찾을 수 없습니다.</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{course.name} - 수강생 관리</h1>
        <p className="text-gray-600">총 수강인원: {students.length}명</p>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              검색
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="이름 또는 학번으로 검색"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="active">수강중</option>
              <option value="dropped">수강포기</option>
            </select>
          </div>
        </div>
      </div>

      {/* 학생 목록 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학생 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                출석률
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                과제 제출
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                중간고사
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기말고사
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                최종성적
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.studentId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.attendance}%</div>
                  <button
                    onClick={() => handleAttendanceUpdate(student.id, new Date(), 'present')}
                    className="text-xs text-blue-600 hover:text-blue-900"
                  >
                    출석 관리
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.assignmentSubmitted}/{student.totalAssignments}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={student.midtermGrade || ''}
                    onChange={(e) => handleGradeUpdate(student.id, { midterm: e.target.value })}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={student.finalGrade || ''}
                    onChange={(e) => handleGradeUpdate(student.id, { final: e.target.value })}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {student.finalScore || '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;