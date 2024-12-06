import { useState, useEffect } from 'react';
import { enrollmentAPI, courseAPI } from '../../../api/services';
import { enrollments } from '../../../api/mock/data/enrollments'; // 초기값으로 사용할 수 있는 더미 데이터

// 2024/11/16 gnuke 학생 상태 조회 등을 관리할 훅
const useFetchInitialData = () => {
    const [enrolledCourses, setEnrolledCourses] = useState(enrollments); // 초기값 설정
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                // 학생 상태 조회 API 호출
                const studentStatus = await enrollmentAPI.getStatus();
                const history = await enrollmentAPI.getHistory(studentStatus.user.semester, studentStatus.user.id);

                // 수강 내역을 기반으로 등록된 강의 정보 가져오기
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

    return { enrolledCourses, loading, error };
};

export default useFetchInitialData;
