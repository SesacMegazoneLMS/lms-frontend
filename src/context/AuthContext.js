import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'PROF001',
    name: '김교수', 
    role: 'professor',
    department: '컴퓨터공학과'
  });

  const login = async (email, password) => {
    try {
      let userData;
      
      if (email.includes('student')) {
        userData = {
          id: 'STU001',
          name: '김학생',
          role: 'student', 
          department: '컴퓨터공학과',
          year: 3,
          semester: '2024-1'
        };
      } else if (email.includes('professor')) {
        userData = {
          id: 'PROF001',
          name: '김교수',
          role: 'professor',
          department: '컴퓨터공학과'
        };
      } else if (email.includes('admin')) {
        userData = {
          id: 'ADMIN001',
          name: '관리자',
          role: 'admin'
        };
      } else {
        throw new Error('유효하지 않은 이메일 형식입니다.');
      }

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('로그인 에러:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value = {
    user,
    setUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다');
  }
  return context;
};