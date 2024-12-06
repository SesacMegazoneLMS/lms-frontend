import React, { useState, useEffect } from 'react';
import SearchFilters from './SearchFilters';
import CourseList from './CourseList';
import { courseAPI } from '../../../../api/services';

const CourseSearch = ({ onAddToCart, enrolledCourses, cartItems, courses, studentId, currentEnrollments, refreshInterests }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    grade: '',
    category: '',
    search: ''
  });

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchFilters onFilterChange={handleFilterChange} />
      {/*위 SerchFilters는 검색 부분*/}
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <CourseList 
          courses={courses}
          studentId={studentId}
          currentEnrollments={currentEnrollments}
          onAddToCart={onAddToCart}
          enrolledCourses={enrolledCourses}
          cartItems={cartItems}
          refreshInterests={refreshInterests}
        />
      )}
    </div>
  );
};

export default CourseSearch;