import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <Header />
      
      {/* 메인 콘텐츠 영역 */}
      <div className="flex">
        {/* 사이드바 */}
        <Sidebar />
        
        {/* 메인 콘텐츠 */}
        <div className="flex-1 ml-64 mt-16">
          <main className="min-h-[calc(100vh-4rem)]">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;