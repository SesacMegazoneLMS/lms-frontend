import {useCallback, useState} from 'react';
import { enrollmentAPI } from '../../../api/services';

// 2024/11/16 gnuke
// EnrollmentService에 관한 함수들을 관리할 Hook
const UseEnrollmentService = (initialEnrolledCourses) => {
    const [cartItems, setCartItems] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState(initialEnrolledCourses);

    const getAllCourses = useCallback(async () => {
        try {
            const result = await enrollmentAPI.getAllCourses();
            return result;
        } catch(error) {
            console.log("강의 정보 가져오기 실패 : ", error);
            throw error;  // 에러 전파
        }
    }, []);

    const getEnrollment = async (studentId) => {
        try{
            const result = await enrollmentAPI.getStudentEnrollments(studentId);
            //console.log("API 학생 등록 정보 : " + result);
            return result;
        }catch(error){
            console.log("등록 강의 정보 가져오기 실패 : ", error);
            throw error;
        }
    };

    const getTimeTableData = async (studentId) => {
        try{
            const result = await enrollmentAPI.getStudentTimeTableData(studentId);
            return result;
        }catch(error){
            console.log("시간표 정보 가져오기 실패 : ", error);
            throw error;
        }
    }

    // 장바구니 목록
    const getInterestList = async (studentId) => {
        try{
            const result = await enrollmentAPI.getInterestList(studentId);
            return result.data;
        }catch(error){
            console.log("장바구니 목록 가져오기 실패 : ", error);
            throw error;
        }
    }

    // 수강신청 처리 함수
    const handleEnrollCourse = async (studentId, courses) => {
        try {
            // 수강가능 학점 체크
            const totalCredits = courses.reduce((acc, course) => acc + course.credits, 0);
            const currentCredits = enrolledCourses.reduce((acc, course) => acc + course.credits, 0);

            if (totalCredits + currentCredits > 18) {
                alert('수강 가능 학점을 초과했습니다.');
                return;
            }

            // API 호출로 수강신청 처리
            const results = await enrollmentAPI.enrollCourse(studentId, courses);

            // 결과 처리
            const successfulEnrollments = results.filter(result => result.status === 'success');
            const failedEnrollments = results.filter(result => result.status !== 'success');

            if (failedEnrollments.length > 0) { // 조건 : 등록에 실패한 강의가 있을 때
                const messages = failedEnrollments.map(result => result.message || "수강신청 실패").join('\n');
                alert(`일부 강의의 수강신청이 실패했습니다:\n${messages}`);
                setEnrolledCourses(prev => [...prev, ...successfulEnrollments]);
                setCartItems(prev => [...prev, ...failedEnrollments]); // 실패한 강의는 장바구니에 추가
            } else {
                alert('모든 강의 수강신청이 완료되었습니다.');
                setEnrolledCourses(prev => [...prev, ...courses]);
                setCartItems([]); // 장바구니 비우기
            }
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

    return {
        enrolledCourses,
        handleEnrollCourse,
        setEnrolledCourses, // 필요시 상태 업데이트를 위해 반환
        getAllCourses,
        getEnrollment,
        getInterestList,
        getTimeTableData
    };
};

export default UseEnrollmentService;