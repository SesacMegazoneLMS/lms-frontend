import React, {useEffect, useState} from 'react';
import CourseSearch from './components/CourseSearch';
import CartList from './components/CartList';
import EnrollmentHistory from './components/EnrollmentHistory';
import TimeTablePreview from './components/TimeTablePreview';
import EnrollmentStatus from './components/EnrollmentStatus';
// 2024/11/16 import by gnuke ------------------------------------------------
import useWebSocket from './useWebSocket'; // kafka 통신을 위한 커스텀 훅 import
import useFetchInitialData from './useFetchInitialData'; // 학생 상태 조회 등을 관리할 훅 import
import useFetchCourses from "./useFetchCourses"; //courses 정보에 변화가 있을 때마다 최신화 돼서 UI에 반영되도록 할 UseEffect 관리 훅 import
import useEnrollmentService from "./useEnrollmentService"; // EnrollmentService에 관한 함수들을 관리할 훅 import

const CourseEnrollment = () => {
  // 2024/11/16 Gnuke
  // data fetching이 되면 enrolledCourses에 등록된 강의 목록이 저장됨
  const { loading: loadingInitial, error: errorInitial } = useFetchInitialData();
  const { loading: loadingCourses, error: errorCourses } = useFetchCourses();
  const {
    handleAddToCart,
    getAllCourses,
    getInterestList
  } = useEnrollmentService(); // 훅 사용

  const [activeTab, setActiveTab] = useState('search');
  const [courses, setCourses] = useState([]);
  const [interests, setInterests] = useState([]);

  const studentId = 'eeeeeeee-1111-1111-1111-111111111111';

  const currentEnrollments = useWebSocket(studentId, courses);

  // 장바구니 목록 가져오기
  const refreshInterests = async () => {
    try {
      const result = await getInterestList(studentId);
      const resultArray = Object.values(result);
      setInterests(resultArray);
    } catch (error) {
      console.error("장바구니 목록을 가져오는 중 오류 발생:", error);
    }
  };

  // 모든 강의의 상태를 새로 가져오는 함수
  useEffect(() => {
    const getAllCoursesInComponent = async () => {
      try{
        const result = await getAllCourses();
        setCourses(result);
      }catch (error){
        console.error("강의 정보를 가져오는 중 오류 발생: ", error);
      }
    };

    getAllCoursesInComponent();
  }, []);


  // 장바구니 개수 가져오기
  useEffect(() => {
    refreshInterests();
  }, [studentId]);


  // 로딩 및 오류 처리
  if (loadingInitial || loadingCourses) {
    return <div className="text-center py-10">로딩 중...</div>;
  }

  if (errorInitial || errorCourses) {
    return <div className="text-center py-10 text-red-600">{errorInitial || errorCourses}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* 수강신청 현황 */}
      {/*<EnrollmentStatus enrolledCourses={enrolledCourses} />*/}
      {/*<div>enrollmentStatus</div>*/}

      {/* 탭 메뉴 */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('search')}
              className={`${activeTab === 'search'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium`}
            >
              강의 검색
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`${activeTab === 'cart'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium`}
            >
              장바구니 ({Array.isArray(interests) ? interests.length : 0})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`${activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium`}
            >
              신청 내역
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              className={`${activeTab === 'timetable'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium`}
            >
              시간표
            </button>
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-6">
          {activeTab === 'search' && (
            <CourseSearch
              onAddToCart={handleAddToCart}
              courses={courses}
              studentId={studentId}
              currentEnrollments={currentEnrollments}
              interest
              refreshInterests={refreshInterests}
            />
            // 강의 검색 컴포넌트
          )}
          {activeTab === 'cart' && (
            <CartList
                studentId={studentId}
                refreshInterests={refreshInterests}
            />
            // 장바구니 컴포넌트
          )}
          {activeTab === 'history' && (
            <EnrollmentHistory
              studentId={studentId}
            />
            //신청 내역 컴포넌트
          )}
          {activeTab === 'timetable' && (
            <TimeTablePreview
              studentId={studentId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEnrollment;