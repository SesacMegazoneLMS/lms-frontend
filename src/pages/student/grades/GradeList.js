import React, { useState } from 'react';
import GradeAppeal from './components/GradeAppeal';

const GradeList = () => {
  const [activeTab, setActiveTab] = useState('grades');
  const [selectedGradeId, setSelectedGradeId] = useState(null);

  // 실제로는 API에서 성적 데이터를 가져와야 합니다
  const grades = {
    currentSemester: '2024-1',
    totalCredits: 18,
    averageGrade: 4.1,
    courses: [
      {
        id: 1,
        name: '웹 프로그래밍',
        professor: '김교수',
        credits: 3,
        grade: 'A+',
        score: 98,
        details: [
          { item: '중간고사', weight: 30, score: 95 },
          { item: '기말고사', weight: 30, score: 98 },
          { item: '과제', weight: 30, score: 100 },
          { item: '출석', weight: 10, score: 100 }
        ]
      },
      {
        id: 2,
        name: '데이터베이스',
        professor: '이교수',
        credits: 3,
        grade: 'A',
        score: 94,
        details: [
          { item: '중간고사', weight: 30, score: 92 },
          { item: '기말고사', weight: 30, score: 95 },
          { item: '과제', weight: 30, score: 96 },
          { item: '출석', weight: 10, score: 90 }
        ]
      },
      {
        id: 3,
        name: '알고리즘',
        professor: '박교수',
        credits: 3,
        grade: 'A+',
        score: 96,
        details: [
          { item: '중간고사', weight: 35, score: 98 },
          { item: '기말고사', weight: 35, score: 95 },
          { item: '과제', weight: 20, score: 94 },
          { item: '출석', weight: 10, score: 100 }
        ]
      }
    ]
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'text-red-600';
      case 'A': return 'text-orange-600';
      case 'B+': return 'text-yellow-600';
      case 'B': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const renderContent = () => {
    if (activeTab === 'appeal' && selectedGradeId) {
      return <GradeAppeal gradeId={selectedGradeId} />;
    }

    return (
      <div className="space-y-6">
        {/* 학기 요약 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{grades.currentSemester} 학기 성적</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-700">총 이수 학점</h3>
              <p className="text-2xl font-bold text-blue-900 mt-1">{grades.totalCredits} 학점</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-green-700">평균 평점</h3>
              <p className="text-2xl font-bold text-green-900 mt-1">{grades.averageGrade}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-medium text-purple-700">수강 과목 수</h3>
              <p className="text-2xl font-bold text-purple-900 mt-1">{grades.courses.length} 과목</p>
            </div>
          </div>
        </div>

        {/* 과목별 성적 */}
        <div className="space-y-4">
          {grades.courses.map(course => (
            <div key={course.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{course.name}</h2>
                  <p className="text-gray-600">{course.professor} | {course.credits}학점</p>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${getGradeColor(course.grade)}`}>
                    {course.grade}
                  </span>
                  <p className="text-gray-600">{course.score}점</p>
                  <button
                    onClick={() => {
                      setSelectedGradeId(course.id);
                      setActiveTab('appeal');
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    이의신청
                  </button>
                </div>
              </div>

              {/* 상세 성적 */}
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">성적 상세</h3>
                <div className="space-y-2">
                  {course.details.map((detail, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-24 text-gray-600">{detail.item}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 rounded-full h-2"
                            style={{ width: `${detail.score}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="w-20 text-right text-gray-600">
                        {detail.score}점 ({detail.weight}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('grades')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'grades'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            성적 조회
          </button>
          {selectedGradeId && (
            <button
              onClick={() => setActiveTab('appeal')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'appeal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              성적 이의신청
            </button>
          )}
        </nav>
      </div>

      {/* 탭 컨텐츠 */}
      {renderContent()}
    </div>
  );
};

export default GradeList;