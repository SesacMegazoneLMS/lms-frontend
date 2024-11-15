import React, { useMemo } from 'react';

const TimeTablePreview = ({ courses }) => {
  const days = ['월', '화', '수', '목', '금'];
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 9; i <= 18; i++) {
      slots.push(`${String(i).padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  // 시간을 인덱스로 변환
  const getTimeIndex = (time) => {
    const [hours] = time.split(':').map(Number);
    return hours - 9; // 1시간 단위로 인덱스 계산
  };

  // 강의 시간 위치 및 길이 계산
  const getClassPosition = (startTime, endTime) => {
    const startIndex = getTimeIndex(startTime);
    const endIndex = getTimeIndex(endTime);
    return {
      start: startIndex,
      duration: endIndex - startIndex
    };
  };

  // 강의별 색상 할당 (고유한 색상 생성)
  const courseColors = useMemo(() => {
    const colors = {
      '전공필수': 'bg-blue-100 border-blue-200 text-blue-800',
      '전공선택': 'bg-green-100 border-green-200 text-green-800',
      '교양필수': 'bg-purple-100 border-purple-200 text-purple-800',
      '교양선택': 'bg-yellow-100 border-yellow-200 text-yellow-800'
    };

    return courses.reduce((acc, course) => ({
      ...acc,
      [course.id]: colors[course.category] || 'bg-gray-100 border-gray-200 text-gray-800'
    }), {});
  }, [courses]);

  return (
    <div className="space-y-6">
      {/* 시간표 헤더 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">수강신청 시간표</h3>
        <p className="text-sm text-gray-500 mt-1">
          총 {courses.length}과목 / {courses.reduce((sum, course) => sum + course.credits, 0)}학점
        </p>
      </div>

      {/* 시간표 */}
      <div className="bg-white rounded-lg shadow overflow-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-6 border-b">
            <div className="w-20"></div>
            {days.map(day => (
              <div key={day} className="px-2 py-3 text-center font-medium text-gray-900 border-l">
                {day}
              </div>
            ))}
          </div>

          <div className="relative grid grid-cols-6">
            {/* 시간 라벨 */}
            <div className="divide-y">
              {timeSlots.map((time, index) => (
                <div key={index} className="h-8 text-xs text-gray-500 text-right pr-2 py-1">
                  {time}
                </div>
              ))}
            </div>

            {/* 요일별 칸 */}
            {days.map(day => (
              <div key={day} className="relative border-l">
                {timeSlots.map((_, index) => (
                  <div
                    key={index}
                    className="absolute w-full h-8 border-t border-gray-100"
                    style={{ top: `${index * 32}px` }}
                  ></div>
                ))}

                {courses
                  .filter(course => course.schedule.some(s => s.day === day))
                  .map(course => {
                    const schedule = course.schedule.find(s => s.day === day);
                    if (!schedule) return null;

                    const { start, duration } = getClassPosition(schedule.startTime, schedule.endTime);

                    return (
                      <div
                        key={`${course.id}-${day}`}
                        className={`absolute w-full px-1 border ${courseColors[course.id]} rounded-sm overflow-hidden`}
                        style={{
                          top: `${start * 32}px`,
                          height: `${duration * 32}px`,
                          left: '1px',
                          right: '1px'
                        }}
                      >
                        <div className="text-xs font-medium truncate">{course.name}</div>
                        <div className="text-xs truncate">{schedule.room}</div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-900 mb-2">강의 구분</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries({
            '전공필수': 'bg-blue-100 border-blue-200 text-blue-800',
            '전공선택': 'bg-green-100 border-green-200 text-green-800',
            '교양필수': 'bg-purple-100 border-purple-200 text-purple-800',
            '교양선택': 'bg-yellow-100 border-yellow-200 text-yellow-800'
          }).map(([type, colorClass]) => (
            <div key={type} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded ${colorClass}`}></div>
              <span className="text-sm text-gray-600">{type}</span>
            </div>
          ))}
        </div>
      </div>

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