import React from 'react';
import CourseItem from './CourseItem';

const CourseList = ({ courses, onAddToCart, enrolledCourses, cartItems }) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        검색 결과가 없습니다.
      </div>
    );
  }

  // 수강중인 강의와 장바구니에 담긴 강의 ID 목록
  const enrolledCourseIds = enrolledCourses.map(course => course.id);
  const cartItemIds = cartItems.map(course => course.id);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              과목코드
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              과목명
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              담당교수
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              학점
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              수강인원
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              강의시간
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              수강신청
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {courses.map(course => (
            <CourseItem 
              key={course.id} 
              course={course} 
              onAddToCart={onAddToCart}
              isEnrolled={enrolledCourseIds.includes(course.id)}
              isInCart={cartItemIds.includes(course.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList;