import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AssignmentSubmit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState('');

  // 실제로는 API에서 과제 정보를 가져와야 합니다
  const assignment = {
    id: id,
    title: 'React 컴포넌트 구현',
    course: '웹 프로그래밍',
    dueDate: '2024.03.20',
    description: 'React를 사용하여 재사용 가능한 컴포넌트를 구현하고, 해당 컴포넌트의 특징과 활용 방안에 대해 설명하시오.',
    maxFileSize: '10MB',
    allowedFileTypes: '.pdf, .zip, .doc, .docx'
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 제출 로직 구현
    console.log('Files:', files);
    console.log('Content:', content);
    alert('과제가 제출되었습니다.');
    navigate('/student/assignments');
  };

  return (
    <div className="space-y-6">
      {/* 과제 정보 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
        <div className="text-gray-600 mb-4">
          <p>과목: {assignment.course}</p>
          <p>마감일: {assignment.dueDate}</p>
        </div>
        <div className="prose max-w-none">
          <p>{assignment.description}</p>
        </div>
      </div>

      {/* 제출 폼 */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* 파일 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            파일 첨부
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>파일 선택</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">또는 드래그 앤 드롭</p>
              </div>
              <p className="text-xs text-gray-500">
                {assignment.allowedFileTypes} (최대 {assignment.maxFileSize})
              </p>
            </div>
          </div>
          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((file, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 내용 작성 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            내용
          </label>
          <textarea
            id="content"
            rows={6}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder="과제 내용을 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/student/assignments')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            제출하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentSubmit;