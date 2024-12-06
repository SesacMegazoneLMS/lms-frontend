import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SyllabusModal from './SyllabusModal';

const CourseOpenings = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedOpening, setSelectedOpening] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // 페이징 관련 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [originalOrder, setOriginalOrder] = useState([]); // 원래 순서를 저장할 상태 추가

  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [selectedOpeningForSyllabus, setSelectedOpeningForSyllabus] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 모달 모드 추가

  useEffect(() => {
    fetchCourseAndOpenings();
  }, [courseId]);

  const fetchCourseAndOpenings = useCallback(async () => {
    try {
      setLoading(true);
      const courseResponse = await axios.get(`http://localhost:8081/courses/${courseId}`);
      setCourse(courseResponse.data);

      const openingsResponse = await axios.get(`http://localhost:8081/course-openings/course/${courseId}`);
      // 최초 로드 시에만 원래 순서 저장
      if (originalOrder.length === 0) {
        setOriginalOrder(openingsResponse.data.map(opening => opening.openingId));
      }
      setOpenings(openingsResponse.data);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId, originalOrder.length]);

  // 필터링된 강의 목록을 반환하는 함수
  const getFilteredOpenings = useCallback(() => {
    let filtered = [...openings];

    // 원래 순서대로 정렬
    filtered.sort((a, b) => {
      return originalOrder.indexOf(a.openingId) - originalOrder.indexOf(b.openingId);
    });

    // 필터링 적용
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(opening => opening.status === statusFilter);
    }

    return filtered;
  }, [openings, statusFilter, originalOrder]);

  // 페이징 처리된 데이터 가져오기
  const getCurrentItems = useCallback(() => {
    const filteredItems = getFilteredOpenings();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [getFilteredOpenings, currentPage, itemsPerPage]);

  // 총 페이지 수 계산
  const pageCount = Math.ceil(getFilteredOpenings().length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusChange = async (openingId, newStatus) => {
    if (newStatus === 'CANCELLED' || newStatus === 'CLOSED') {
      setSelectedOpening(openingId);
      setSelectedStatus(newStatus);
      setShowConfirmModal(true);
      return;
    }

    try {
      const opening = openings.find(o => o.openingId === openingId);
      if (!opening) return;

      const updateData = {
        openingId: openingId,
        courseId: opening.course?.courseId || opening.courseId,
        professor: {
          professorId: opening.professor?.professorId || opening.professorId
        },
        semester: opening.semester,
        year: opening.year,
        maxStudents: opening.maxStudents,
        currentStudents: opening.currentStudents || 0,
        status: newStatus
      };

      await axios.put(`http://localhost:8081/course-openings/${openingId}`, updateData);
      await fetchCourseAndOpenings();
    } catch (err) {
      console.error('Error details:', err.response?.data);
      setError('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const getDayOfWeekText = (day) => {
    const days = {
      MON: '월', TUE: '화', WED: '수', THU: '목',
      FRI: '금', SAT: '토', SUN: '일'
    };
    return days[day] || day;
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: '개설예정',
      OPENED: '개설',
      CANCELLED: '폐강',
      CLOSED: '종료'
    };
    return statusMap[status] || status;
  };

  const handleDelete = async (openingId) => {
    try {
      await axios.delete(`http://localhost:8081/course-openings/${openingId}`);
      await fetchCourseAndOpenings();
    } catch (err) {
      console.error('Error deleting course opening:', err);
      setError('강의 개설 삭제 중 오류가 발생했습니다.');
    }
  };

  // 페이지네이션 컴포넌트
  const Pagination = ({ currentPage, pageCount, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= pageCount; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-4 space-x-2">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 rounded ${currentPage === number
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  // 강의계획서 조회 함수
  const handleViewSyllabus = async (openingId) => {
    try {
      const response = await axios.get(`http://localhost:8081/syllabi/course-openings/${openingId}`);
      setSelectedSyllabus(response.data);
      setSelectedOpeningForSyllabus(openingId);
      setModalMode('view');
      setShowSyllabusModal(true);
    } catch (error) {
      console.error('Error fetching syllabus:', error);
      setError('강의계획서를 불러오는데 실패했습니다.');
    }
  };

  // 강의계획서 저장 함수
  const handleSaveSyllabus = async (syllabusData) => {
    try {
      if (modalMode === 'edit') {
        await axios.put(`http://localhost:8081/syllabi/${syllabusData.syllabusId}`, syllabusData);
      } else {
        await axios.post(`http://localhost:8081/syllabi/course-openings/${selectedOpeningForSyllabus}`, syllabusData);
      }
      await fetchCourseAndOpenings(); // 목록 새로고침
      setShowSyllabusModal(false);
    } catch (error) {
      throw error;
    }
  };

  // 강의계획서 삭제 함수 수정
  const handleDeleteSyllabus = async () => {
    try {
      // URL을 syllabusId를 사용하도록 수정
      await axios.delete(`http://localhost:8081/syllabi/${selectedSyllabus.syllabusId}`);
      await fetchCourseAndOpenings(); // 목록 새로고침
      setShowSyllabusModal(false);
      setSelectedSyllabus(null);
      setModalMode('view');
    } catch (error) {
      console.error('Error deleting syllabus:', error);
      setError('강의계획서 삭제에 실패했습니다.');
    }
  };

  // 강의계획서 등록 처리 함수
  const handleCreateSyllabus = async (syllabusData) => {
    // 모든 필드가 비어있는지 확인
    if (!syllabusData.learningObjectives.trim() ||
      !syllabusData.weeklyPlan.trim() ||
      !syllabusData.evaluationMethod.trim() ||
      !syllabusData.textbooks.trim()) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      await axios.post(`http://localhost:8081/syllabi/course-openings/${selectedOpeningForSyllabus}`, syllabusData);
      await fetchCourseAndOpenings();
      setShowSyllabusModal(false);
      setSelectedSyllabus(null);
      setModalMode('view');
    } catch (error) {
      console.error('Error creating syllabus:', error);
      setError('강의계획서 등록에 실패했습니다.');
    }
  };

  // 강의계획서 버튼 클릭 핸들러 수정
  const handleSyllabusClick = (opening) => {
    setSelectedOpeningForSyllabus(opening.openingId);
    if (opening.syllabus) {
      // 조회 모드
      setSelectedSyllabus(opening.syllabus);
      setModalMode('view');
    } else {
      // 등록 모드
      setSelectedSyllabus({
        learningObjectives: '',
        weeklyPlan: '',
        evaluationMethod: '',
        textbooks: ''
      });
      setModalMode('create');
    }
    setShowSyllabusModal(true);
  };

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!course) return <div className="text-center py-10">강의 정보가 없습니다.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold text-gray-900">강의 개설 관리</h1>

        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="ALL">전체 상태</option>
            <option value="PENDING">개설예정</option>
            <option value="OPENED">개설</option>
            <option value="CANCELLED">폐강</option>
            <option value="CLOSED">종료</option>
          </select>

          <button
            onClick={() => navigate(`/admin/courses/${courseId}/openings/create`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            새 강의 개설
          </button>
        </div>
      </div>

      {course && (
        <p className="text-sm text-gray-600 mb-6">
          {course.courseName} ({course.courseCode})
        </p>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                개설 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학기
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                담당교수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                강의시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                강의계획서
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수강인원
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getCurrentItems().map((opening) => (
              <tr key={opening.openingId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {opening.openingId.substring(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {opening.year}년 {opening.semester}학기
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {opening.professor?.name || '-'}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {opening.courseTimes?.map((time, index) => (
                    <div key={index} className="mb-1">
                      {getDayOfWeekText(time.dayOfWeek)}요일 {formatTime(time.startTime)}-{formatTime(time.endTime)}
                      {time.classroom && (
                        <span className="ml-2 text-gray-500">
                          ({time.classroom})
                        </span>
                      )}
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleSyllabusClick(opening)}
                    className={opening.syllabus ?
                      "text-blue-600 hover:text-blue-900" :
                      "text-green-600 hover:text-green-900"}
                  >
                    {opening.syllabus ? '조회' : '등록'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {opening.currentStudents}/{opening.maxStudents}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <select
                    value={opening.status}
                    onChange={(e) => handleStatusChange(opening.openingId, e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="PENDING">개설예정</option>
                    <option value="OPENED">개설</option>
                    <option value="CANCELLED">폐강</option>
                    <option value="CLOSED">종료</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => navigate(`/admin/courses/${courseId}/openings/${opening.openingId}/edit`)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('이 강의 개설을 삭제하시겠습니까?')) {
                        handleDelete(opening.openingId);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {getFilteredOpenings().length === 0 && (
          <div className="text-center py-10 text-gray-500">
            {statusFilter === 'ALL'
              ? '개설된 강의가 없습니다.'
              : `${getStatusText(statusFilter)} 상태인 강의가 없습니다.`}
          </div>
        )}

        {/* 페이지네이션 */}
        {getFilteredOpenings().length > 0 && (
          <div className="px-6 py-8 border-t">
            <nav className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
              >
                이전
              </button>

              {[...Array(pageCount)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded-md ${currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pageCount}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
              >
                다음
              </button>
            </nav>
          </div>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">상태 변경 확인</h3>
            <p>정말 이 강의를 {selectedStatus === 'CANCELLED' ? '폐강' : '종료'} 처리하시겠습니까?</p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm text-gray-700 border rounded-md"
              >
                취소
              </button>
              <button
                onClick={async () => {
                  try {
                    const opening = openings.find(o => o.openingId === selectedOpening);
                    if (!opening) return;

                    const updateData = {
                      openingId: selectedOpening,
                      courseId: opening.course?.courseId || opening.courseId,
                      professor: {
                        professorId: opening.professor?.professorId || opening.professorId
                      },
                      semester: opening.semester,
                      year: opening.year,
                      maxStudents: opening.maxStudents,
                      currentStudents: opening.currentStudents || 0,
                      status: selectedStatus
                    };

                    await axios.put(`http://localhost:8081/course-openings/${selectedOpening}`, updateData);
                    await fetchCourseAndOpenings();
                    setShowConfirmModal(false);
                  } catch (err) {
                    console.error('Error details:', err.response?.data);
                    setError('상태 변경 중 오류가 발생했습니다.');
                  }
                }}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모달 수정 */}
      {showSyllabusModal && (
        <SyllabusModal
          syllabus={selectedSyllabus}
          mode={modalMode}
          onClose={() => {
            if (modalMode === 'create' || modalMode === 'edit') {
              const hasChanges = Object.values(selectedSyllabus).some(value => value.trim() !== '');
              if (hasChanges) {
                if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
                  setShowSyllabusModal(false);
                  setSelectedSyllabus(null);
                  setModalMode('view');
                }
              } else {
                setShowSyllabusModal(false);
                setSelectedSyllabus(null);
                setModalMode('view');
              }
            } else {
              setShowSyllabusModal(false);
              setSelectedSyllabus(null);
              setModalMode('view');
            }
          }}
          onSave={modalMode === 'create' ? handleCreateSyllabus :
            modalMode === 'edit' ? handleSaveSyllabus :
              () => setModalMode('edit')}
          onDelete={handleDeleteSyllabus}
        />
      )}
    </div>
  );
};

export default CourseOpenings;