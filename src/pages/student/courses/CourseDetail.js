import React from 'react';
import { useParams } from 'react-router-dom';

const CourseDetail = () => {
  const { id } = useParams();

  // 실제로는 API에서 데이터를 가져와야 합니다
  const course = {
    id: id,
    name: '웹 프로그래밍',
    professor: '김교수',
    schedule: '월,수 10:30-12:00',
    room: '공학관 401호',
    description: '웹 프로그래밍의 기초부터 심화까지 다루는 과목입니다.',
    announcements: [
      { id: 1, title: '중간고사 안내', date: '2024.03.15' },
      { id: 2, title: '과제 제출 기한 연장', date: '2024.03.14' }
    ],
    assignments: [
      { id: 1, title: 'React 컴포넌트 구현', dueDate: '2024.03.20', status: '미제출' },
      { id: 2, title: 'API 연동 과제', dueDate: '2024.03.25', status: '제출완료' }
    ],
    materials: [
      { id: 1, title: '1주차 강의자료', type: 'PDF' },
      { id: 2, title: '2주차 강의자료', type: 'PDF' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* 강의 기본 정보 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.name}</h1>
        <div className="text-gray-600">
          <p>담당교수: {course.professor}</p>
          <p>강의시간: {course.schedule}</p>
          <p>강의실: {course.room}</p>
        </div>
        <p className="mt-4 text-gray-700">{course.description}</p>
      </div>

      {/* 공지사항 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">공지사항</h2>
        <div className="space-y-3">
          {course.announcements.map(announcement => (
            <div key={announcement.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
              <span>{announcement.title}</span>
              <span className="text-sm text-gray-500">{announcement.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 과제 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">과제</h2>
        <div className="space-y-3">
          {course.assignments.map(assignment => (
            <div key={assignment.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
              <div>
                <span className="font-medium">{assignment.title}</span>
                <p className="text-sm text-gray-500">마감일: {assignment.dueDate}</p>
              </div>
              <span className={`text-sm ${
                assignment.status === '미제출' ? 'text-red-500' : 'text-green-500'
              }`}>
                {assignment.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 강의자료 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">강의자료</h2>
        <div className="space-y-3">
          {course.materials.map(material => (
            <div key={material.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded cursor-pointer">
              <span>{material.title}</span>
              <span className="text-sm text-gray-500">{material.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;