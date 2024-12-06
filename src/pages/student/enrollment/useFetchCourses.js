import { useState, useEffect } from 'react';
import { enrollmentAPI } from '../../../api/services';

// 2024/11/16 gnuke
//courses 정보에 변화가 있을 때마다 최신화 돼서 UI에 반영되도록 할 UseEffect
// 관리 훅
const useFetchCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await enrollmentAPI.getAllCourses(); // API 호출로 모든 강의 데이터 가져오기
                console.log(res)
                setCourses(res); // 상태 업데이트
            } catch (err) {
                setError('강의 목록을 가져오는 중 오류가 발생했습니다.');
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses(); // 강의 목록을 가져오기 위한 함수 호출
    }, []); // 빈 배열을 의존성으로 설정하여 컴포넌트가 마운트될 때만 호출

    return { courses, loading, error }; // 필요한 상태 반환
};

export default useFetchCourses;
