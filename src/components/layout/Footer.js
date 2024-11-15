import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SeSAC LMS</h3>
            <p className="text-gray-400">
              서울시 강남구 선릉로 433
              <br />
              역삼동 세스크 아카데미
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">바로가기</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white">소개</Link></li>
              <li><Link to="/notice" className="hover:text-white">공지사항</Link></li>
              <li><Link to="/faq" className="hover:text-white">자주 묻는 질문</Link></li>
              <li><Link to="/contact" className="hover:text-white">문의하기</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">연락처</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Tel: 02-1234-5678</li>
              <li>Fax: 02-1234-5679</li>
              <li>Email: info@sesac.ac.kr</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">소셜 미디어</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2024 SeSAC LMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;