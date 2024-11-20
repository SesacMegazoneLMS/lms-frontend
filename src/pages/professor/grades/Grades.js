import React, { useState } from 'react';
import GradeInput from './components/GradeInput';
import GradeStats from './components/GradeStats';
import GradeVisibility from './components/GradeVisibility';
import GradeAppeals from './components/GradeAppeals';

const Grades = () => {
  const [activeTab, setActiveTab] = useState('input');

  const tabs = [
    { id: 'input', name: '성적 입력/수정' },
    { id: 'stats', name: '성적 산출/통계' },
    { id: 'visibility', name: '성적공개 설정' },
    { id: 'appeals', name: '성적 이의 신청' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'input':
        return <GradeInput />;
      case 'stats':
        return <GradeStats />;
      case 'visibility':
        return <GradeVisibility />;
      case 'appeals':
        return <GradeAppeals />;
      default:
        return <GradeInput />;
    }
  };

  return (
    <div className="p-6">
      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Grades;
