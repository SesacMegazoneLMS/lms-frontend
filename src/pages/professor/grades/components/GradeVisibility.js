import React, { useState } from 'react';
import axios from 'axios';

const GradeVisibility = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleItems, setVisibleItems] = useState({
    assignment: true,
    midterm: true,
    final: true,
    total: true,
    grade: true
  });

  const courses = [
    {
      courseId: '11111111-aaaa-1111-1111-111111111111',
      courseName: '컴퓨터프로그래밍기초',
      openingId: 'bbbbbbbb-1111-aaaa-1111-111111111111',
      semester: '1',
      year: 2024
    },
    {
      courseId: '22222222-aaaa-2222-2222-222222222222',
      courseName: '자료구조',
      openingId: 'bbbbbbbb-2222-aaaa-2222-222222222222',
      semester: '1',
      year: 2024
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourseId) {
      alert('강의를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCourse = courses.find(course => course.courseId === selectedCourseId);
      await axios.put('/grades/visibility', {
        openingId: selectedCourse.openingId,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        visibility: true,
        visibleItems: visibleItems
      });

      alert('성적 공개 기간이 설정되었습니다.');
    } catch (error) {
      console.error('성적 공개 설정 실패:', error);
      alert(`성적 공개 설정에 실패했습니다: ${error.response?.data || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">년도:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">학기:</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="1">1학기</option>
            <option value="2">2학기</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">강의:</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">강의 선택</option>
            {courses
              .filter(course =>
                course.year === parseInt(selectedYear) &&
                course.semester === selectedSemester
              )
              .map(course => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))
            }
          </select>
        </div>
      </div>

      {selectedCourseId && (
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">성적 공개 설정</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">공개 항목</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleItems.assignment}
                      onChange={(e) => setVisibleItems({ ...visibleItems, assignment: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">과제 점수</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleItems.midterm}
                      onChange={(e) => setVisibleItems({ ...visibleItems, midterm: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">중간고사 점수</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleItems.final}
                      onChange={(e) => setVisibleItems({ ...visibleItems, final: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">기말고사 점수</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleItems.total}
                      onChange={(e) => setVisibleItems({ ...visibleItems, total: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">총점</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleItems.grade}
                      onChange={(e) => setVisibleItems({ ...visibleItems, grade: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">등급(A, B, C)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  공개 시작일
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  공개 종료일
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? '설정 중...' : '설정 저장'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GradeVisibility;
