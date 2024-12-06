import React, { useEffect, useMemo, useState } from 'react';
import useEnrollmentService from "../useEnrollmentService";

const TimeTablePreview = ({ studentId }) => {
  const { getTimeTableData, getEnrollment } = useEnrollmentService();
  const [timeTableData, setTimeTableData] = useState(null);
  const [enrolledData, setEnrolledData] = useState([]);

  // 요일과 시간 설정
  const days = ['월', '화', '수', '목', '금'];
  const timeSlots = Array.from({ length: 9 }, (_, i) => `${i + 1}교시`);

  const timeTableDatas = async () => {
    try {
      const result = await getTimeTableData(studentId);
      setTimeTableData(result);
    } catch (error) {
      console.error("시간표 목록을 가져오는 중 오류 발생 : ", error);
    }
  };

  const enrolledDatas = async () => {
    try{
      const enrollmentData = await getEnrollment(studentId);
      setEnrolledData(enrollmentData);
    }catch(error){
      console.error("강의 데이터를 불러오는 중 오류 발생 : ", error);
    }
  }

  useEffect(() => {
    timeTableDatas();
    enrolledDatas();
  }, [studentId]);

  // 고유한 과목 목록 추출 및 색상 할당
  const courseColors = useMemo(() => {
    if (!timeTableData) return {};

    const uniqueCourses = new Set();
    timeTableData.forEach(row => {
      row.forEach(cell => {
        if (cell && cell.courseCode) {
          uniqueCourses.add(cell.courseCode);
        }
      });
    });

    const colors = [
      'bg-blue-100 border-blue-200 text-blue-800',
      'bg-green-100 border-green-200 text-green-800',
      'bg-purple-100 border-purple-200 text-purple-800',
      'bg-yellow-100 border-yellow-200 text-yellow-800',
      'bg-pink-100 border-pink-200 text-pink-800',
    ];

    return Array.from(uniqueCourses).reduce((acc, courseCode, index) => ({
      ...acc,
      [courseCode]: colors[index % colors.length]
    }), {});
  }, [timeTableData]);

  if (!timeTableData) {
    return <div>Loading...</div>;
  }

  return (
      <div className="space-y-6">
        {/* 시간표 헤더 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">수강신청 시간표</h3>
          <p className="text-sm text-gray-500 mt-1">
            총 {enrolledData.length}과목 / {enrolledData.reduce((sum, course) => sum + course.credit, 0)}학점
          </p>
        </div>

        {/* 시간표 */}
        <div className="bg-white rounded-lg shadow overflow-auto">
          <div className="min-w-[800px]">
            {/* 요일 헤더 */}
            <div className="grid grid-cols-6 border-b">
              <div className="w-20"></div>
              {days.map(day => (
                  <div key={day} className="px-2 py-3 text-center font-medium text-gray-900 border-l">
                    {day}
                  </div>
              ))}
            </div>

            {/* 시간표 본문 */}
            <div className="grid grid-cols-6">
              {timeSlots.map((time, timeIndex) => (
                  <div key={`row-${timeIndex}`} className="contents">
                    {/* 시간 라벨 */}
                    <div className="h-16 text-xs text-gray-500 text-right pr-2 py-1 border-t">
                      {time}
                    </div>
                    {/* 요일별 칸 */}
                    {days.map((day, dayIndex) => {
                      const cell = timeTableData[timeIndex]?.[dayIndex]; // 시간, 요일 기준 데이터 추출
                      return (
                          <div
                              key={`${timeIndex}-${dayIndex}`}
                              className={`h-16 border-l border-t p-1 ${
                                  cell ? courseColors[cell.courseCode] : ''
                              }`}
                          >
                            {cell && (
                                <>
                                  <div className="text-xs font-medium truncate">
                                    {cell.courseName}
                                  </div>
                                  <div className="text-xs truncate">{cell.courseCode}</div>
                                </>
                            )}
                          </div>
                      );
                    })}
                  </div>
              ))}
            </div>

          </div>
        </div>

        {/*/!* 범례 *!/*/}
        {/*<div className="bg-white p-4 rounded-lg shadow">*/}
        {/*  <h4 className="text-sm font-medium text-gray-900 mb-2">강의 구분</h4>*/}
        {/*  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">*/}
        {/*    {Object.entries({*/}
        {/*      '전공필수': 'bg-blue-100 border-blue-200 text-blue-800',*/}
        {/*      '전공선택': 'bg-green-100 border-green-200 text-green-800',*/}
        {/*      '교양필수': 'bg-purple-100 border-purple-200 text-purple-800',*/}
        {/*      '교양선택': 'bg-yellow-100 border-yellow-200 text-yellow-800'*/}
        {/*    }).map(([type, colorClass]) => (*/}
        {/*      <div key={type} className="flex items-center space-x-2">*/}
        {/*        <div className={`w-4 h-4 rounded ${colorClass}`}></div>*/}
        {/*        <span className="text-sm text-gray-600">{type}</span>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* 주의사항 */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">시간표 확인 사항</h4>
          <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
            <li>시간표 중복 여부를 반드시 확인해주세요.</li>
            <li>강의실 이동 시간을 고려하여 수강신청해주세요.</li>
            <li>점심 시간을 확보하는 것을 권장합니다.</li>
          </ul>
        </div>
      </div>
  );
};

export default TimeTablePreview;
