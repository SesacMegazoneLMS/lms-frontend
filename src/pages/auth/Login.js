import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      // 역할에 따른 리다이렉트
      switch (user.role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'professor':
          navigate('/professor/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          setError('유효하지 않은 사용자 역할입니다.');
      }
    } catch (error) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#004EA2] to-[#003875] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl p-8 md:p-10">
        {/* 로고 영역 */}
        <div className="text-center mb-8">
          <img 
            src={require("../../assets/sesac-logo.png")}
            alt="새싹 로고" 
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-[#004EA2] text-2xl md:text-3xl font-bold mb-2">
            새싹 LMS
          </h1>
          <p className="text-gray-600 text-base">
            학습관리시스템
          </p>
        </div>

        {/* 테스트 계정 안내 */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            테스트 계정: student@test.com, professor@test.com, admin@test.com
          </p>
          <p className="text-sm text-gray-600">
            비밀번호: password123
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 입력 */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              required
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004EA2] focus:border-[#004EA2] transition-colors text-gray-900"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004EA2] focus:border-[#004EA2] transition-colors text-gray-900"
            />
          </div>

          {/* 로그인 옵션 */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 border-gray-300 rounded text-[#004EA2] focus:ring-[#004EA2]"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                로그인 상태 유지
              </label>
            </div>
            <Link 
              to="/forgot-password"
              className="text-sm text-[#004EA2] hover:text-[#003875] font-medium transition-colors"
            >
              아이디/비밀번호 찾기
            </Link>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full bg-[#004EA2] hover:bg-[#003875] text-white font-semibold py-3.5 px-4 rounded-lg mt-6 transition-colors"
          >
            로그인
          </button>

          {/* 회원가입 링크 */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">계정이 없으신가요? </span>
            <Link 
              to="/auth/register"
              className="text-sm text-[#004EA2] hover:text-[#003875] font-medium transition-colors"
            >
              회원가입
            </Link>
          </div>
        </form>

        {/* 문의사항 */}
        <div className="text-center text-sm text-gray-500 mt-8">
          문의사항: 02-123-4567 (평일 09:00~18:00)
        </div>
      </div>
    </div>
  );
};

export default Login;