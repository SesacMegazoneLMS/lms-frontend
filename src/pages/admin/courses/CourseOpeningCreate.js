import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseOpeningCreate = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // 상태 관리
  const [professors, setProfessors] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    courseId: courseId,
    professor: {
      professorId: '',
      name: '',
      professorNumber: '',
      department: {
        departmentId: ''
      }
    },
    semester: '1',
    year: new Date().getFullYear(),
    maxStudents: 30,
    currentStudents: 0,
    status: 'PENDING',
    courseTimes: [
      {
        dayOfWeek: 'MON',
        startTime: '09:00',
        endTime: '10:30',
        classroom: ''
      }
    ]
  });

  // 교수 목록 가져오기
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await axios.get('http://localhost:8081/professors');
        setProfessors(response.data);
      } catch (error) {
        setErrorMessage('교수 목록을 불러오는데 실패했습니다.');
        setShowErrorModal(true);
      }
    };
    fetchProfessors();
  }, []);


  // 에러 모달 컴포넌트
  const ErrorModal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-red-600">등록 오류</h3>
        </div>
        <div className="mb-4">
          <p className="text-gray-700">{message}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );

  // 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    if (field === 'professor') {
      const selectedProfessor = professors.find(p => p.professorId === value);
      setFormData(prev => ({
        ...prev,
        professor: selectedProfessor || prev.professor
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // 강의 시간 변경 핸들러
  const handleCourseTimeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      courseTimes: prev.courseTimes.map((time, i) =>
        i === index ? { ...time, [field]: value } : time
      )
    }));
  };

  // 강의 시간 추가
  const addCourseTime = () => {
    setFormData(prev => ({
      ...prev,
      courseTimes: [
        ...prev.courseTimes,
        {
          dayOfWeek: 'MON',
          startTime: '09:00',
          endTime: '10:30',
          classroom: ''
        }
      ]
    }));
  };

  // 강의 시간 삭제
  const removeCourseTime = (index) => {
    setFormData(prev => ({
      ...prev,
      courseTimes: prev.courseTimes.filter((_, i) => i !== index)
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.professor.professorId) {
        setErrorMessage('교수를 선택해주세요.');
        setShowErrorModal(true);
        return;
      }

      // 모든 강의 개설 목록 조회
      const openingsResponse = await axios.get(`http://localhost:8081/course-openings/course/${courseId}`);
      const existingOpenings = openingsResponse.data;

      // 같은 연도, 같은 학기의 강의만 필터링
      const sameTermOpenings = existingOpenings.filter(opening =>
        opening.year === parseInt(formData.year) &&
        opening.semester === formData.semester
      );

      // 시간 중복 체크 (같은 학기일 때만)
      for (const newTime of formData.courseTimes) {
        for (const opening of sameTermOpenings) {
          for (const existingTime of opening.courseTimes || []) {
            // 같은 요일인 경우에만 시간 체크
            if (existingTime.dayOfWeek === newTime.dayOfWeek) {
              const newStart = newTime.startTime;
              const newEnd = newTime.endTime;
              const existingStart = existingTime.startTime;
              const existingEnd = existingTime.endTime;

              // 시간이 겹치고 같은 학기인 경우에만 추가 검사
              if (newStart < existingEnd && newEnd > existingStart) {
                // 같은 교수의 강의 시간 중복 체크
                if (opening.professor.professorId === formData.professor.professorId) {
                  setErrorMessage(
                    `${formData.year}년 ${formData.semester}학기에 ` +
                    `${newTime.dayOfWeek}요일 ${newTime.startTime}~${newTime.endTime}에 ` +
                    `해당 교수님은 이미 다른 강의가 있습니다.`
                  );
                  setShowErrorModal(true);
                  return;
                }

                // 같은 강의실 중복 체크 (같은 학기일 때만)
                if (existingTime.classroom === newTime.classroom && newTime.classroom) {
                  setErrorMessage(
                    `${formData.year}년 ${formData.semester}학기에 ` +
                    `${newTime.dayOfWeek}요일 ${newTime.startTime}~${newTime.endTime}에 ` +
                    `${newTime.classroom} 강의실은 이미 사용 중입니다.`
                  );
                  setShowErrorModal(true);
                  return;
                }
              }
            }
          }
        }
      }

      // 검증을 통과한 경우 강의 개설 진행
      const submitData = {
        courseId: courseId,
        professor: {
          professorId: formData.professor.professorId
        },
        semester: formData.semester,
        year: parseInt(formData.year),
        maxStudents: parseInt(formData.maxStudents),
        currentStudents: 0,
        status: formData.status
      };

      try {
        const response = await axios.post('http://localhost:8081/course-openings', submitData);

        if (response.status === 200 || response.status === 201) {
          const openingId = response.data.openingId;

          // 3. 강의 시간 등록도 try-catch로 감싸기
          try {
            for (const time of formData.courseTimes) {
              const courseTimeData = {
                openingId: openingId,
                dayOfWeek: time.dayOfWeek,
                startTime: time.startTime,
                endTime: time.endTime,
                classroom: time.classroom || "미정"
              };

              await axios.post(`http://localhost:8081/course-times/course-openings/${openingId}`, courseTimeData);
            }

            // 4. 모든 과정이 성공적으로 완료된 경우에만 페이지 이동
            navigate(`/admin/courses/${courseId}/openings`);
          } catch (timeError) {
            // 5. 강의 시간 등록 실패 시 생성된 강의 개설도 삭제
            await axios.delete(`http://localhost:8081/course-openings/${openingId}`);
            throw timeError;
          }
        }
      } catch (submitError) {
        setErrorMessage(submitError.response?.data?.message || '강의 개설 중 오류가 발생했습니다.');
        setShowErrorModal(true);
        return;
      }

    } catch (err) {
      console.error('Error details:', err.response?.data);
      setErrorMessage(err.response?.data?.message || '강의 개설 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">강의 개설</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* 교수 선택 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              담당 교수
            </label>
            <select
              value={formData.professor.professorId}
              onChange={(e) => handleInputChange('professor', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">교수 선택</option>
              {professors.map(professor => (
                <option key={professor.professorId} value={professor.professorId}>
                  {professor.name}
                </option>
              ))}
            </select>
          </div>

          {/* 강의 상태 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              강의 상태
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="PENDING">개설예정</option>
              <option value="OPENED">개설</option>
              <option value="CANCELLED">폐강</option>
              <option value="CLOSED">종료</option>
            </select>
          </div>
        </div>

        {/* 학기 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연도
            </label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              학기
            </label>
            <select
              value={formData.semester}
              onChange={(e) => handleInputChange('semester', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="1">1학기</option>
              <option value="2">2학기</option>
              <option value="계절">계절학기</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최대 수강인원
            </label>
            <input
              type="number"
              value={formData.maxStudents}
              onChange={(e) => handleInputChange('maxStudents', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 강의 시간 */}
        {/* 강의 시간 섹션 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">강의 시간</h3>
            <button
              type="button"
              onClick={addCourseTime}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              시간 추가
            </button>
          </div>

          <div className="space-y-4">
            {formData.courseTimes.map((time, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-lg">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">요일</label>
                  <select
                    value={time.dayOfWeek}
                    onChange={(e) => handleCourseTimeChange(index, 'dayOfWeek', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="MON">월요일</option>
                    <option value="TUE">화요일</option>
                    <option value="WED">수요일</option>
                    <option value="THU">목요일</option>
                    <option value="FRI">금요일</option>
                  </select>
                </div>

                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
                  <input
                    type="time"
                    value={time.startTime}
                    onChange={(e) => handleCourseTimeChange(index, 'startTime', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
                  <input
                    type="time"
                    value={time.endTime}
                    onChange={(e) => handleCourseTimeChange(index, 'endTime', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">강의실</label>
                  <input
                    type="text"
                    value={time.classroom}
                    onChange={(e) => handleCourseTimeChange(index, 'classroom', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="강의실"
                  />
                </div>

                {formData.courseTimes.length > 1 && (
                  <div className="flex items-end h-[70px]">
                    <button
                      type="button"
                      onClick={() => removeCourseTime(index)}
                      className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(`/admin/courses/${courseId}/openings`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            강의 개설
          </button>
        </div>

      </form >

      {/* 에러 모달 */}
      {
        showErrorModal && (
          <ErrorModal
            message={errorMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )
      }
    </div >
  );
};

export default CourseOpeningCreate;