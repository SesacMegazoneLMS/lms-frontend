import React, { useState, useEffect } from 'react';
import { courseAPI } from '../../../../api/services';

const SearchFilters = ({ onFilterChange }) => {
  const [metadata, setMetadata] = useState({
    departments: [],
    categories: [],
    grades: []
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await courseAPI.getMetadata();
        setMetadata(data);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* 학과 필터 */}
      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
          학과
        </label>
        <select
          id="department"
          name="department"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          onChange={(e) => onFilterChange('department', e.target.value)}
        >
          <option value="">전체</option>
          {metadata.departments.map(dept => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* 학년 필터 */}
      <div>
        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
          학년
        </label>
        <select
          id="grade"
          name="grade"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          onChange={(e) => onFilterChange('grade', e.target.value)}
        >
          <option value="">전체</option>
          {metadata.grades.map(grade => (
            <option key={grade.id} value={grade.id}>
              {grade.name}
            </option>
          ))}
        </select>
      </div>

      {/* 이수구분 필터 */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          이수구분
        </label>
        <select
          id="category"
          name="category"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="">전체</option>
          {metadata.categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* 검색어 입력 */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          검색어
        </label>
        <input
          type="text"
          id="search"
          name="search"
          placeholder="과목명, 교수명, 과목코드"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchFilters;