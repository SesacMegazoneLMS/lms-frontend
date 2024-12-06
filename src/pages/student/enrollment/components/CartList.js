import React, {useEffect, useState} from 'react';
import useEnrollmentService from "../useEnrollmentService";
import { enrollmentAPI } from "../../../../api/services/enrollmentAPI";


const CartList = ({ studentId, refreshInterests }) => {
  const [interests, setInterests] = useState([]);
  const {
    getInterestList
  } = useEnrollmentService();

  // 관심강의 목록의 최신상태 가져오기
  const getInterests = async () => {
    try{
      const result = await getInterestList(studentId);
      const resultArray = Object.values(result);

      setInterests(resultArray);
    }catch(error){
      console.error("장바구니 목록을 가져오는 중 오류 발생 : ", error);
    }
  };

  useEffect(() => {
    getInterests();
  }, [studentId]);

  const enrollCourseInCart = async (studentId, course) => {
    //console.log(interest)
    await enrollmentAPI.enrollCourse(studentId, course);

    //삭제 후 목록 새로 고침
    await getInterests();
  };

  const deleteCourseInCart = async (studentId, course) => {
    try {
      await enrollmentAPI.deleteInterest(studentId, course);
      // setInterestList() 대신 getInterests() 호출
      await getInterests();
      await refreshInterests();
    } catch (error) {
      console.error("관심강의 삭제 중 오류 발생:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const totalCredits = interests.reduce((sum, course) => sum + course.credits, 0);

  return (
      <div className="space-y-6">
        {/* 장바구니 요약 정보 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-blue-900">장바구니 현황</h3>
              <p className="text-sm text-blue-700">
                총 {interests.length}과목 / {totalCredits}학점
              </p>
            </div>
            {/*{interests.length > 0 && (*/}
            {/*    <button*/}
            {/*        onClick={() => enrollCourseInCart(interests, studentId)}*/}
            {/*        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700*/}
            {/*           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"*/}
            {/*    >*/}
            {/*      수강신청*/}
            {/*    </button>*/}
            {/*)}*/}
          </div>
        </div>

        {/* 장바구니 목록 */}
        {interests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              장바구니가 비어있습니다.
            </div>
        ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg">
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
                    요일
                  </th>
                  <th scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    강의시간
                  </th>
                  <th scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    강의실
                  </th>
                  <th scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    학점
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {interests.map((course) => (
                    <tr key={course.openingId}>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {course.courseCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {course.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {course.professorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {course.timeInfo && course.timeInfo.day ? course.timeInfo.day : '시간 정보 없음'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {course.timeInfo ? (
                            `${course.timeInfo.startTime} ~ ${course.timeInfo.endTime}`
                        ) : (
                            '시간 정보 없음'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {course.timeInfo?.classroom || '강의실 정보 없음'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {course.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-end gap-2">
                        <button
                            onClick={() => enrollCourseInCart(studentId, course)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          수강신청
                        </button>
                        <button
                            onClick={() => deleteCourseInCart(studentId, course)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        {/* 주의사항 */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">수강신청 주의사항</h4>
          <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
            <li>장바구니에 담긴 과목이 수강신청 완료를 의미하지 않습니다.</li>
            <li>수강신청 버튼을 클릭하여 최종 신청을 완료해주세요.</li>
            <li>수강인원이 초과된 경우 신청이 거부될 수 있습니다.</li>
            <li>시간표 중복 여부를 반드시 확인해주세요.</li>
          </ul>
        </div>
      </div>
  );
};

export default CartList;
