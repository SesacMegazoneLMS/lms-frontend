import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import useEnrollmentService from '../enrollment/useEnrollmentService';

const CourseList = () => {
  const {
    getEnrollment,
  } = useEnrollmentService();

  const studentId = 'eeeeeeee-1111-1111-1111-111111111111';
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const getEnrollmentInComponent = async () => {
      try{
        const result = await getEnrollment(studentId);
        console.log("수강 강의 목록 : " + JSON.stringify(result));
        setEnrollments(result);
      }catch(error){
        console.error("강의 정보를 가져오는 중 오류 발생 : ", error);
      }
    };
    getEnrollmentInComponent();
  }, [studentId]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">수강 과목 목록</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map(course => (
          <Link 
            key={course.enrollmentId}
            to={`/student/courses/${course.openingId}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{course.courseName}</h3>
              <p className="text-gray-600 mb-1">{course.professorName}</p>
              {/*<p className="text-sm text-gray-500 mb-4">{enrollments.schedule} | {course.room}</p>*/}
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{course.courseCode}</span>
                    <span>{course.credit} 학점</span>
                  </div>
                  <div className={"flex justify-end"}>
                    <div>{course.day}요일 {course.startTime.split(':').slice(0, 2).join(':')} - {course.endTime.split(':').slice(0, 2).join(':')}</div>
                  </div>
                </div>
                {/*<div>*/}
                {/*  <div className="flex justify-between text-sm mb-1">*/}
                {/*    <span>진도율</span>*/}
                {/*    <span className="text-blue-600">{course.progress}%</span>*/}
                {/*  </div>*/}
                {/*  <div className="w-full bg-gray-200 rounded-full h-2">*/}
                {/*    <div */}
                {/*      className="bg-blue-600 rounded-full h-2" */}
                {/*      style={{ width: `${course.progress}%` }}*/}
                {/*    ></div>*/}
                {/*  </div>*/}
                {/*</div>*/}
                
                {/*<div>*/}
                {/*  <div className="flex justify-between text-sm mb-1">*/}
                {/*    <span>출석률</span>*/}
                {/*    <span className="text-green-600">{course.attendance}%</span>*/}
                {/*  </div>*/}
                {/*  <div className="w-full bg-gray-200 rounded-full h-2">*/}
                {/*    <div */}
                {/*      className="bg-green-600 rounded-full h-2" */}
                {/*      style={{ width: `${course.attendance}%` }}*/}
                {/*    ></div>*/}
                {/*  </div>*/}
                {/*</div>*/}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseList;