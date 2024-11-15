import React, { useState, useEffect } from 'react';
import CourseSearch from './components/CourseSearch';
import CartList from './components/CartList';
import EnrollmentHistory from './components/EnrollmentHistory';
import TimeTablePreview from './components/TimeTablePreview';
import EnrollmentStatus from './components/EnrollmentStatus';
import { enrollmentAPI, courseAPI } from '../../../api/services';
import { enrollments } from '../../../api/mock/data/enrollments';

const CourseEnrollment = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [cartItems, setCartItems] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(enrollments); // 초기값으로 enrollments 사용
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const status = await enrollmentAPI.getStatus(); // 상태 가져오기
        console.log('Status:', status); // 상태 확인
        const history = await enrollmentAPI.getHistory(status.user.semester, status.user.id); // 학생 ID와 학기를 전달
        const enrolledCoursesData = await Promise.all(
          history.map(item => courseAPI.getCourse(item.courseId))
        );
        setEnrolledCourses(enrolledCoursesData);
      } catch (err) {
        setError('초기 데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 장바구니 추가
  const handleAddToCart = (course) => {
    if (cartItems.find(item => item.id === course.id)) {
      alert('이미 장바구니에 있는 강의입니다.');
      return;
    }

    // 시간표 중복 체크
    const hasConflict = checkTimeConflict(course);
    if (hasConflict) {
      alert('시간표가 중복되는 강의가 있습니다.');
      return;
    }

    setCartItems(prev => [...prev, course]);
  };

  // 장바구니에서 제거
  const handleRemoveFromCart = (courseId) => {
    setCartItems(prev => prev.filter(item => item.id !== courseId));
  };

  // 수강신청 처리
  const handleEnrollCourse = async (courses) => {
    try {
      // 수강가능 학점 체크
      const totalCredits = courses.reduce((acc, course) => acc + course.credits, 0);
      const currentCredits = enrolledCourses.reduce((acc, course) => acc + course.credits, 0);
      
      if (totalCredits + currentCredits > 18) {
        alert('수강 가능 학점을 초과했습니다.');
        return;
      }

      // 실제 수강신청 처리
      await enrollmentAPI.enrollCourse(courses); // API 호출로 수강신청 처리
      setEnrolledCourses(prev => [...prev, ...courses]);
      setCartItems([]); // 장바구니 비우기
      alert('수강신청이 완료되었습니다.');
    } catch (error) {
      console.error('Error during enrollment:', error);
      alert('수강신청 중 오류가 발생했습니다.');
    }
  };

  // 시간표 중복 체크 함수
  const checkTimeConflict = (newCourse) => {
    const existingSchedules = [...enrolledCourses, ...cartItems].flatMap(course => course.schedule);
    const newSchedules = newCourse.schedule;

    return existingSchedules.some(existing => 
      newSchedules.some(newSchedule => 
        existing.day === newSchedule.day && (
          (existing.startTime <= newSchedule.startTime && existing.endTime > newSchedule.startTime) ||
          (existing.startTime < newSchedule.endTime && existing.endTime >= newSchedule.startTime) ||
          (newSchedule.startTime <= existing.startTime && newSchedule.endTime > existing.startTime)
        )
      )
    );
  };

  if (loading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* 수강신청 현황 */}
      <EnrollmentStatus enrolledCourses={enrolledCourses} />

      {/* 탭 메뉴 */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('search')}
              className={`${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium`}
            >
              강의 검색
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`${
                activeTab === 'cart'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium`}
            >
              장바구니 ({cartItems.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium`}
            >
              신청 내역
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              className={`${
                activeTab === 'timetable'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium`}
            >
              시간표
            </button>
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-6">
          {activeTab === 'search' && (
            <CourseSearch 
              onAddToCart={handleAddToCart}
              enrolledCourses={enrolledCourses}
              cartItems={cartItems}
            />
          )}
          {activeTab === 'cart' && (
            <CartList 
              cartItems={cartItems} 
              onRemoveFromCart={handleRemoveFromCart}
              onEnrollCourse={handleEnrollCourse}
            />
          )}
          {activeTab === 'history' && (
            <EnrollmentHistory />
          )}
          {activeTab === 'timetable' && (
            <TimeTablePreview courses={[...enrolledCourses, ...cartItems]} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEnrollment;