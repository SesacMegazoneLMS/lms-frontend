import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ExamSubmit = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [exam, setExam] = useState({ questions: [] });

  useEffect(() => {
    axios.get(`http://localhost:8081/exams/${examId}`).then((response) => {
      if (response.status === 200) {
        if (response.data === null) {
          setExam({});
        } else {
          setExam(response.data);
        }
      } else {
        setExam({});
      }
    });
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentId = "eeeeeeee-1111-1111-1111-111111111111"; // 임시 학생 ID

    const formattedAnswers = Object.entries(answers).map(
      ([number, selectedAnswer]) => ({
        problemId: exam.questions[number - 1].problemId,
        number: parseInt(number),
        selectedAnswer: getAnswerEnum(selectedAnswer),
      })
    );

    const submissionData = {
      examId: examId,
      studentId: studentId,
      answers: formattedAnswers,
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/exams/submit",
        JSON.stringify(submissionData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("시험이 제출되었습니다.");
      navigate("/student/courses/");
    } catch (error) {
      console.log(submissionData);
      alert("제출 실패");
    }
  };

  const getAnswerEnum = (selectedAnswer) => {
    const answerMap = {
      1: "FIRST",
      2: "SECOND",
      3: "THIRD",
      4: "FOURTH",
      5: "FIFTH",
    };
    return answerMap[selectedAnswer] || "NOT_SELECTED";
  };

  return (
    <div className="space-y-6">
      {/* 시험 정보 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{exam.title}</h1>
        <div className="text-gray-600 mb-4">
          <p>과목: {exam.courseName}</p>
          <p>시험 시간: {exam.duration}분</p>
          <p>시작 시간: {new Date(exam.startTime).toLocaleString()}</p>
          <p>종료 시간: {new Date(exam.endTime).toLocaleString()}</p>
          <p>총 문항: {exam.totalQuestions}문항</p>
        </div>
      </div>

      {/* 문제 및 답안 선택 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {exam.questions.map((question, index) => (
          <div key={question.number} className="bg-white p-6 rounded-lg shadow">
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {index + 1}. {question.question}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {question.difficulty || 1}점
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center">
                  <input
                    type="radio"
                    id={`question-${question.number}-option-${optionIndex}`}
                    name={`question-${question.number}`}
                    value={optionIndex + 1}
                    onChange={(e) =>
                      handleAnswerChange(question.number, e.target.value)
                    }
                    checked={
                      answers[question.number] === String(optionIndex + 1)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor={`question-${question.number}-option-${optionIndex}`}
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    {optionIndex + 1}. {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/student/exams")}
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

export default ExamSubmit;
