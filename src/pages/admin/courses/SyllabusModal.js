import React, { useState } from 'react';
import axios from 'axios';

const SyllabusModal = ({ syllabus, onClose, onSave, onDelete, mode = 'view' }) => {
  const [editData, setEditData] = useState(syllabus);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length <= 100) {
      setEditData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const renderContent = (label, content, name) => {
    const placeholders = {
      learningObjectives: '이 강의의 학습 목표를 100자 이내로 입력하세요.',
      weeklyPlan: '주차별 강의 계획을 100자 이내로 입력하세요.',
      evaluationMethod: '시험, 과제 등 평가 방법을 100자 이내로 입력하세요.',
      textbooks: '주교재 및 참고 문헌을 100자 이내로 입력하세요.'
    };

    if (mode === 'view') {
      return (
        <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap min-h-[100px] max-h-[150px] overflow-y-auto">
          {content || '(내용 없음)'}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <textarea
          name={name}
          value={editData[name]}
          onChange={handleChange}
          className="w-full p-2 border rounded-md resize-none"
          rows={4}
          placeholder={placeholders[name]}
          maxLength={100}
        />
        <div className="text-right text-sm text-gray-500">
          {editData[name]?.length || 0}/100자
        </div>
      </div>
    );
  };

  const handleDelete = () => {
    if (window.confirm('강의계획서를 삭제하시겠습니까?')) {
      onDelete();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 모든 필드가 비어있는지 확인
    if (!editData.learningObjectives.trim() ||
      !editData.weeklyPlan.trim() ||
      !editData.evaluationMethod.trim() ||
      !editData.textbooks.trim()) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    onSave(editData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            강의계획서 {mode === 'edit' ? '수정' : '조회'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">학습목표</h3>
            {renderContent('학습목표', editData.learningObjectives, 'learningObjectives')}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">주차별 강의 계획</h3>
            {renderContent('주차별 강의 계획', editData.weeklyPlan, 'weeklyPlan')}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">평가 방법</h3>
            {renderContent('평가 방법', editData.evaluationMethod, 'evaluationMethod')}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">교재 및 참고문헌</h3>
            {renderContent('교재 및 참고문헌', editData.textbooks, 'textbooks')}
          </div>

          {error && (
            <div className="text-red-600 text-sm mt-2">{error}</div>
          )}

          {mode === 'edit' && (
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                저장하기
              </button>
            </div>
          )}

          {mode === 'view' && (
            <div className="flex justify-end pt-4 border-t space-x-2">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                삭제하기
              </button>
              <button
                type="button"
                onClick={() => onSave()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                수정하기
              </button>
            </div>
          )}

          {mode === 'create' && (
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                등록하기
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SyllabusModal;