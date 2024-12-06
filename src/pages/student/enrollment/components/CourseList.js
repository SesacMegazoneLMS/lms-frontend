import React from 'react';
import CourseItem from './CourseItem';

const CourseList = ({ courses, onAddToCart, enrolledCourses, cartItems, studentId, currentEnrollments, refreshInterests }) => {

  // Object
  const coursesArray = Object.values(courses);

  if (coursesArray.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        검색 결과가 없습니다.
      </div>
    );
  }

  // 수강중인 강의와 장바구니에 담긴 강의 ID 목록
  // const enrolledCourseIds = enrolledCourses.map(course => course.id);
  // const cartItemIds = cartItems.map(course => course.id);

  return (
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
          <tr>
            <th scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              과목코드
            </th>
            <th scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              과목명
            </th>
            <th scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              담당교수
            </th>
            <th scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              학점
            </th>
            <th scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              수강인원
            </th>
            <th scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              요일
            </th>
            <th scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              강의시간
            </th>
            <th scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              수강신청
            </th>
            <th scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              장바구니
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {coursesArray.map(course => (
              <CourseItem
                  key={course.openingId}
                  course={course}
                  studentId={studentId}
                  currentEnrollments={currentEnrollments}
                  onAddToCart={onAddToCart}
                  refreshInterests={refreshInterests}
              />
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default CourseList;