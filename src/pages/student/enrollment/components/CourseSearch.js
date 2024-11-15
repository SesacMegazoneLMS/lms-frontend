import React, { useState, useEffect } from 'react';
import SearchFilters from './SearchFilters';
import CourseList from './CourseList';
import { courseAPI } from '../../../../api/services';

const CourseSearch = ({ onAddToCart, enrolledCourses, cartItems }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    grade: '',
    category: '',
    search: ''
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await courseAPI.getCourses(filters);
        setCourses(data);
      } catch (err) {
        setError('강의 목록을 불러오는데 실패했습니다.');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters]);

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
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <CourseList 
          courses={courses} 
          onAddToCart={onAddToCart}
          enrolledCourses={enrolledCourses}
          cartItems={cartItems}
        />
      )}
    </div>
  );
};

export default CourseSearch;