import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SyllabusForm = () => {
  const { courseId, openingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.pathname.split('/').pop(); // 'create', 'edit', 'view' 중 하나

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syllabus, setSyllabus] = useState({
    learningObjectives: '',
    weeklyPlan: '',
    evaluationMethod: '',
    textbooks: ''
  });

  // 강의계획서 데이터 로드
  useEffect(() => {
    const loadSyllabus = async () => {
      if (mode === 'create') {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8081/syllabi/course-openings/${openingId}`);
        setSyllabus(response.data);
        setLoading(false);
      } catch (error) {
        setError('강의계획서를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    loadSyllabus();
  }, [openingId, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'edit') {
        await axios.put(`http://localhost:8081/syllabi/${syllabus.syllabusId}`, syllabus);
      } else if (mode === 'create') {
        await axios.post(`http://localhost:8081/syllabi/course-openings/${openingId}`, syllabus);
      }
      navigate(`/admin/courses/${courseId}/openings`);
    } catch (error) {
      setError('강의계획서 저장에 실패했습니다.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSyllabus(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          강의계획서 {mode === 'create' ? '등록' : mode === 'edit' ? '수정' : '조회'}
        </h2>
        <button
          onClick={() => navigate(`/admin/courses/${courseId}/openings`)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          목록으로
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            학습목표
          </label>
          <textarea
            name="learningObjectives"
            value={syllabus.learningObjectives}
            onChange={handleChange}
            disabled={mode === 'view'}
            className="w-full p-2 border rounded-md h-32"
            placeholder="학습목표를 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            주차별 강의 계획
          </label>
          <textarea
            name="weeklyPlan"
            value={syllabus.weeklyPlan}
            onChange={handleChange}
            disabled={mode === 'view'}
            className="w-full p-2 border rounded-md h-64"
            placeholder="주차별 강의 계획을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            평가 방법
          </label>
          <textarea
            name="evaluationMethod"
            value={syllabus.evaluationMethod}
            onChange={handleChange}
            disabled={mode === 'view'}
            className="w-full p-2 border rounded-md h-32"
            placeholder="평가 방법을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            교재 및 참고문헌
          </label>
          <textarea
            name="textbooks"
            value={syllabus.textbooks}
            onChange={handleChange}
            disabled={mode === 'view'}
            className="w-full p-2 border rounded-md h-32"
            placeholder="교재 및 참고문헌을 입력하세요"
          />
        </div>

        {mode !== 'view' && (
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/admin/courses/${courseId}/openings`)}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {mode === 'create' ? '등록' : '수정'}
            </button>
          </div>
        )}

        {mode === 'view' && (
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/admin/courses/${courseId}/openings/${openingId}/syllabus/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              수정하기
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SyllabusForm;