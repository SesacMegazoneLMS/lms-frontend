import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../../../api/services';

const CourseCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    credits: 3,
    capacity: 30,
    category: 'MAJOR_REQUIRED', // 전공필수
    semester: '2024-1',
    schedule: [
      { day: '', startTime: '', endTime: '', room: '' }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { day: '', startTime: '', endTime: '', room: '' }]
    }));
  };

  const removeSchedule = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.code || !formData.name) {
      setError('과목 코드와 이름은 필수 입력사항입니다.');
      return false;
    }
    
    // 강의 시간 유효성 검사
    const validSchedule = formData.schedule.every(schedule => 
      schedule.day && schedule.startTime && schedule.endTime && schedule.room
    );
    
    if (!validSchedule) {
      setError('모든 강의 시간 정보를 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      await courseAPI.createCourse(formData);
      alert('강의가 성공적으로 생성되었습니다.');
      navigate('/professor/courses');
    } catch (err) {
      setError('강의 생성에 실패했습니다.');
      console.error('Error creating course:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">새 강의 개설</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                과목 코드
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                과목명
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                과목 설명
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                학점
              </label>
              <input
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                min="1"
                max="6"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                수강 정원
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                과목 구분
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="MAJOR_REQUIRED">전공필수</option>
                <option value="MAJOR_ELECTIVE">전공선택</option>
                <option value="GENERAL_REQUIRED">교양필수</option>
                <option value="GENERAL_ELECTIVE">교양선택</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                학기
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="2024-1">2024년 1학기</option>
                <option value="2024-2">2024년 2학기</option>
              </select>
            </div>
          </div>

          {/* 강의 시간 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900">강의 시간</h3>
              <button
                type="button"
                onClick={addSchedule}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
              >
                + 시간 추가
              </button>
            </div>

            {formData.schedule.map((schedule, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 mb-4">
                <div>
                  <select
                    value={schedule.day}
                    onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">요일</option>
                    <option value="MON">월</option>
                    <option value="TUE">화</option>
                    <option value="WED">수</option>
                    <option value="THU">목</option>
                    <option value="FRI">금</option>
                  </select>
                </div>
                <div>
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="강의실"
                    value={schedule.room}
                    onChange={(e) => handleScheduleChange(index, 'room', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  {formData.schedule.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSchedule(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/professor/courses')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              {loading ? '처리중...' : '강의 개설'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseCreate;