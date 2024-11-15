import React from 'react';
import { Link } from 'react-router-dom';

const CourseList = () => {
  const courses = [
    {
      id: 1,
      name: '웹 프로그래밍',
      professor: '김교수',
      schedule: '월,수 10:30-12:00',
      room: '공학관 401호',
      progress: 85,
      attendance: 95
    },
    // ... 더 많은 강의 데이터
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">수강 과목 목록</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <Link 
            key={course.id}
            to={`/student/courses/${course.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
              <p className="text-gray-600 mb-1">{course.professor}</p>
              <p className="text-sm text-gray-500 mb-4">{course.schedule} | {course.room}</p>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>진도율</span>
                    <span className="text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 rounded-full h-2" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>출석률</span>
                    <span className="text-green-600">{course.attendance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 rounded-full h-2" 
                      style={{ width: `${course.attendance}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseList;