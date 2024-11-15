import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }
  
  // 인증된 사용자는 요청한 페이지로 이동
  return children;
};

export default ProtectedRoute;