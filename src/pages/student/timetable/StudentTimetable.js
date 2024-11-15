import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../../api/services';

const StudentTimetable = () => {
  const [courses, setCourses] = useState([]);
  const days = ['월', '화', '수', '목', '금'];
  const times = Array.from({ length: 9 }, (_, i) => i + 1);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const studentId = localStorage.getItem('userId');
        const response = await studentAPI.getStudentCourses(studentId);
        setCourses(response.data);
      } catch (error) {
        console.error('강의 목록을 불러오는데 실패했습니다:', error);
      }
    };
    fetchCourses();
  }, []);

  const getTimetableCell = (day, time) => {
    const course = courses.find(c => 
      c.schedule.day === day && 
      c.schedule.time === time
    );

    if (course) {
      return (
        <div className="bg-blue-100 p-2 h-full">
          <p className="font-semibold">{course.name}</p>
          <p className="text-sm">{course.professor}</p>
          <p className="text-xs">{course.room}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">시간표</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 w-20">교시</th>
              {days.map(day => (
                <th key={day} className="border p-2 w-40">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time}>
                <td className="border p-2 text-center">{time}</td>
                {days.map(day => (
                  <td key={`${day}-${time}`} className="border p-2 h-24">
                    {getTimetableCell(day, time)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTimetable;