import React from 'react';
import { scheduleDetails } from '../../../../api/mock/data/scheduleDetails'; // 상세 시간표 데이터
import { enrollmentAPI } from '../../../../api/services/enrollmentAPI';
import useEnrollmentService from "../useEnrollmentService";

const CourseItem = ({ course, studentId, currentEnrollments, refreshInterests }) => {
    const { getTimeTableData } = useEnrollmentService();

    const enrollCourse = async (studentId, course) => {
        await enrollmentAPI.enrollCourse(studentId, course);

        await getTimeTableData(studentId);
    };

    const addInterest = async (studentId, course) => {
        try {
            const openingId = course.openingId;
            await enrollmentAPI.addInterest(studentId, openingId);
            await refreshInterests();
        } catch (error) {
            console.error("관심과목 담기 실패 : " + error);
        }
    };

    // // scheduleDetails에서 해당 courseId에 대한 시간표 가져오기
    // const formatSchedule = (courseId) => {
    //     const schedule = scheduleDetails[courseId];
    //     if (!Array.isArray(schedule)) {
    //         console.error('Schedule is not an array:', schedule);
    //         return '일정 없음'; // 기본값 반환
    //     }
    //     return schedule.map(s => `${s.day} ${s.startTime}-${s.endTime} (${s.room})`).join(', ');
    // };

    return (
        <tr key={course.openingId}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                {course.courseCode}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {course.courseName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {course.professorName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {course.credit}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
            <span className={course.currentStudents >= course.maxStudents ? 'text-red-600' : ''}>
                {
                    currentEnrollments[course.openingId] !== undefined
                        ? `${currentEnrollments[course.openingId]}/${course.maxStudents}`
                        : `${course.currentStudents}/${course.maxStudents}`
                }
            </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {course.day || ''}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {course.startTime ? course.startTime.split(':').slice(0, 2).join(':') : ''} - {course.endTime ? course.endTime.split(':').slice(0, 2).join(':') : ''}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
            <button onClick={() => enrollCourse(studentId, course)} className="bg-blue-600 text-white rounded-md hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                text-sm py-1 px-2">
                    신청
                </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <button onClick={() => addInterest(studentId, course)} className="bg-blue-600 text-white rounded-md hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                text-sm py-1 px-2">
                    담기
                </button>
            </td>
        </tr>
    );
};

export default CourseItem;
