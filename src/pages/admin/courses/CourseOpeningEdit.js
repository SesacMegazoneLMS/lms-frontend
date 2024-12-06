import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseOpeningEdit = () => {
  const { openingId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
  const [professors, setProfessors] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

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

    const fetchOpeningData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/course-openings/${openingId}`);
        setFormData(response.data);
      } catch (error) {
        setErrorMessage('강의 개설 정보를 불러오는데 실패했습니다.');
        setShowErrorModal(true);
      }
    };

    fetchProfessors();
    fetchOpeningData();
  }, [openingId]);

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

  const handleCourseTimeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      courseTimes: prev.courseTimes.map((time, i) =>
        i === index ? { ...time, [field]: value } : time
      )
    }));
  };

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

  const removeCourseTime = (index) => {
    setFormData(prev => ({
      ...prev,
      courseTimes: prev.courseTimes.filter((_, i) => i !== index)
    }));
  };

  // 에러 모달 컴포넌트
  const ErrorModal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-red-600">수정 오류</h3>
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 기존 검증 로직 유지 (교수 선택 확인)
      if (!formData.professor.professorId) {
        setErrorMessage('교수를 선택해주세요.');
        setShowErrorModal(true);
        return;
      }

      // 모든 강의 개설 목록 조회
      const openingsResponse = await axios.get(`http://localhost:8081/course-openings/course/${formData.courseId}`);
      const existingOpenings = openingsResponse.data;

      // 같은 연도, 같은 학기의 강의만 필터링 (현재 수정 중인 강의는 제외)
      const sameTermOpenings = existingOpenings.filter(opening =>
        opening.openingId !== openingId &&
        opening.year === parseInt(formData.year) &&
        opening.semester === formData.semester
      );

      // 시간 중복 체크
      for (const newTime of formData.courseTimes) {
        for (const opening of sameTermOpenings) {
          for (const existingTime of opening.courseTimes || []) {
            if (existingTime.dayOfWeek === newTime.dayOfWeek) {
              const newStart = newTime.startTime;
              const newEnd = newTime.endTime;
              const existingStart = existingTime.startTime;
              const existingEnd = existingTime.endTime;

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

                // 같은 강의실 중복 체크
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

      // 검증을 통과한 경우, 새로운 통합 업데이트 요청
      const completeUpdateData = {
        courseOpening: {
          courseId: formData.courseId,
          professor: {
            professorId: formData.professor.professorId
          },
          semester: formData.semester,
          year: parseInt(formData.year),
          maxStudents: parseInt(formData.maxStudents),
          currentStudents: formData.currentStudents,
          status: formData.status
        },
        courseTimes: formData.courseTimes.map(time => ({
          timeId: time.courseTimeId || null,
          dayOfWeek: time.dayOfWeek,
          startTime: time.startTime,
          endTime: time.endTime,
          classroom: time.classroom || "미정"
        }))
      };

      // 하나의 요청으로 모든 데이터 업데이트
      await axios.put(
        `http://localhost:8081/course-times/course-openings/${openingId}/complete-update`,
        completeUpdateData
      );

      // 성공 시 페이지 이동
      navigate(`/admin/courses/${formData.courseId}/openings`);
    } catch (error) {
      console.error('Error details:', error.response?.data);
      setErrorMessage(error.response?.data?.message || '강의 개설 수정 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    }
  };


  return (

    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">강의 개설 수정</h2>
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
            onClick={() => navigate(`/admin/courses/${formData.courseId}/openings`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            수정 완료
          </button>
        </div>
      </form>
      {/* 에러 모달 */}
      {
        showErrorModal && (
          <ErrorModal
            message={errorMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )
      }
    </div>
  );
};
export default CourseOpeningEdit;