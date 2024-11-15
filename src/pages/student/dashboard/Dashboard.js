import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* 환영 메시지 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          안녕하세요, {user?.name}님!
        </h1>
        <p className="text-gray-600">
          {user?.department} {user?.year}학년 | {user?.semester}
        </p>
      </div>

      {/* 수강 중인 강의 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">수강 중인 강의</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium">웹 프로그래밍</h3>
            <p className="text-sm text-gray-500">김교수 | 월,수 10:30-12:00</p>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-blue-600">출석률 95%</span>
              <span className="text-green-600">진도율 85%</span>
            </div>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium">데이터베이스</h3>
            <p className="text-sm text-gray-500">이교수 | 화,목 13:30-15:00</p>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-blue-600">출석률 100%</span>
              <span className="text-green-600">진도율 90%</span>
            </div>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium">알고리즘</h3>
            <p className="text-sm text-gray-500">박교수 | 화,금 15:30-17:00</p>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-blue-600">출석률 88%</span>
              <span className="text-green-600">진도율 75%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 주간 일정 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">이번 주 일정</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <span className="text-sm font-medium">월요일</span>
              <p className="text-gray-600">웹 프로그래밍 중간고사</p>
            </div>
            <span className="text-sm text-gray-500">10:30 - 12:00</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <span className="text-sm font-medium">수요일</span>
              <p className="text-gray-600">데이터베이스 팀 프로젝트 발표</p>
            </div>
            <span className="text-sm text-gray-500">13:30 - 15:00</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <span className="text-sm font-medium">금요일</span>
              <p className="text-gray-600">알고리즘 과제 제출</p>
            </div>
            <span className="text-sm text-gray-500">23:59까지</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 공지사항 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">공지사항</h2>
          <ul className="space-y-3">
            <li className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className="text-blue-600">[중요]</span>
                <span>중간고사 일정 안내</span>
              </div>
              <span className="text-sm text-gray-500">2024.03.15</span>
            </li>
            <li className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className="text-green-600">[학사]</span>
                <span>수강신청 정정기간 안내</span>
              </div>
              <span className="text-sm text-gray-500">2024.03.14</span>
            </li>
            <li className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className="text-purple-600">[장학]</span>
                <span>2024-1학기 장학금 신청</span>
              </div>
              <span className="text-sm text-gray-500">2024.03.13</span>
            </li>
            <li className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className="text-orange-600">[행사]</span>
                <span>학술제 참가 신청 안내</span>
              </div>
              <span className="text-sm text-gray-500">2024.03.12</span>
            </li>
          </ul>
        </div>

        {/* 할 일 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">예정된 할 일</h2>
          <ul className="space-y-3">
            <li className="flex justify-between items-center p-3 bg-red-50 rounded">
              <div>
                <span className="font-medium">웹 프로그래밍 과제 제출</span>
                <p className="text-sm text-gray-600">React 컴포넌트 구현</p>
              </div>
              <span className="text-sm text-red-500">D-2</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-yellow-50 rounded">
              <div>
                <span className="font-medium">데이터베이스 중간고사</span>
                <p className="text-sm text-gray-600">1-7장 범위</p>
              </div>
              <span className="text-sm text-yellow-600">D-5</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <div>
                <span className="font-medium">알고리즘 팀 프로젝트</span>
                <p className="text-sm text-gray-600">정렬 알고리즘 구현</p>
              </div>
              <span className="text-sm text-blue-600">D-7</span>
            </li>
            <li className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
              <div>
                <span className="font-medium">학생증 재발급 신청</span>
                <p className="text-sm text-gray-600">학사지원과 방문</p>
              </div>
              <span className="text-sm text-gray-500">D-14</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 학습 현황 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">이번 학기 학습 현황</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700">총 수강 과목</h3>
            <p className="text-2xl font-bold text-blue-900 mt-2">6 과목</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm font-medium text-green-700">평균 출석률</h3>
            <p className="text-2xl font-bold text-green-900 mt-2">94.5%</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-sm font-medium text-purple-700">제출 과제</h3>
            <p className="text-2xl font-bold text-purple-900 mt-2">12/15</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-700">예정된 시험</h3>
            <p className="text-2xl font-bold text-yellow-900 mt-2">3건</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard