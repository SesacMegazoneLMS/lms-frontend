import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BellIcon, 
  EnvelopeIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* 좌측: 로고 */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={require("../../assets/sesac-logo.png")} 
              alt="새싹 로고" 
              className="h-8" 
            />
            <span className="text-xl font-bold text-[#004EA2]">새싹대학교 LMS</span>
          </Link>

          {/* 학기 선택 */}
          <select className="text-sm border-gray-300 rounded-md focus:ring-[#004EA2] focus:border-[#004EA2]">
            <option>2024년 1학기</option>
            <option>2023년 2학기</option>
          </select>
        </div>

        {/* 우측: 기능 버튼들 */}
        <div className="flex items-center space-x-4">
          {/* 검색 */}
          <div className="relative">
            <input
              type="text"
              placeholder="강의 검색"
              className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-[#004EA2] focus:border-[#004EA2]"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          {/* 알림 */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* 메시지 */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
            <EnvelopeIcon className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* 프로필 드롭다운 */}
          <div className="relative">
            <button className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2">
              <img 
                src="/assets/profile-placeholder.png" 
                alt="프로필" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">홍길동</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;