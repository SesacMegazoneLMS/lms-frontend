import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    password: '',
    confirmPassword: '',
    name: '',
    department: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentId) newErrors.studentId = '학번을 입력해주세요';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    if (!formData.name) newErrors.name = '이름을 입력해주세요';
    if (!formData.department) newErrors.department = '학과를 선택해주세요';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      // 실제로는 여기서 API 호출을 통해 회원가입을 처리합니다
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#004EA2] to-[#003875] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-[#004EA2] text-2xl md:text-3xl font-bold mb-2">
            새싹 LMS 회원가입
          </h1>
          <p className="text-gray-600">
            새싹대학교 학습관리시스템 회원가입을 환영합니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 학번 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                학번
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004EA2]"
                placeholder="학번을 입력하세요"
              />
              {errors.studentId && (
                <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>
              )}
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004EA2]"
                placeholder="이름을 입력하세요"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004EA2]"
                placeholder="비밀번호를 입력하세요"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004EA2]"
                placeholder="비밀번호를 다시 입력하세요"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 학과 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                학과
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004EA2]"
              >
                <option value="">학과를 선택하세요</option>
                <option value="컴퓨터공학과">컴퓨터공학과</option>
                <option value="소프트웨어학과">소프트웨어학과</option>
                <option value="정보통신공학과">정보통신공학과</option>
                {/* 더 많은 학과 옵션 */}
              </select>
              {errors.department && (
                <p className="text-red-500 text-xs mt-1">{errors.department}</p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004EA2]"
                placeholder="이메일을 입력하세요"
              />
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full bg-[#004EA2] hover:bg-[#003875] text-white font-semibold py-3.5 px-4 rounded-lg mt-6 transition-colors"
          >
            회원가입
          </button>

          {/* 로그인 페이지 링크 */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">이미 계정이 있으신가요? </span>
            <Link 
              to="/auth/login"
              className="text-sm text-[#004EA2] hover:text-[#003875] font-medium"
            >
              로그인하기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;