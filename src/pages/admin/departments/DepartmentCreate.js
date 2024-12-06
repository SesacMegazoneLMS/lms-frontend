import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DepartmentCreate = () => {
  const navigate = useNavigate();
  const [departmentData, setDepartmentData] = useState({
    departmentName: ''
  });
  const [error, setError] = useState(null);
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartmentData({
      ...departmentData,
      [name]: value,
    });
    setIsDuplicateChecked(false);
    setIsAvailable(false);
  };

  const checkDepartmentName = async () => {
    if (!departmentData.departmentName.trim()) {
      setError('학과명을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8081/departments/check/${departmentData.departmentName}`);
      const { exists } = response.data;

      if (exists) {
        setError('이미 존재하는 학과명입니다.');
        setIsAvailable(false);
      } else {
        setError(null);
        setIsAvailable(true);
        alert('사용 가능한 학과명입니다.');
      }
      setIsDuplicateChecked(true);
    } catch (err) {
      setError('학과명 중복 확인 중 오류가 발생했습니다.');
      console.error('Error checking department name:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDuplicateChecked) {
      setError('학과명 중복 확인이 필요합니다.');
      return;
    }
    if (!isAvailable) {
      setError('사용할 수 없는 학과명입니다.');
      return;
    }

    try {
      await axios.post('http://localhost:8081/departments', departmentData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('학과가 성공적으로 등록되었습니다.');
      navigate('/admin/departments');
    } catch (err) {
      setError('학과 등록에 실패했습니다.');
      console.error('Error creating department:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">새 학과 등록</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            학과명
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="departmentName"
              value={departmentData.departmentName}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={checkDepartmentName}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              중복 확인
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/departments')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            disabled={!isDuplicateChecked || !isAvailable}
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
}

export default DepartmentCreate;