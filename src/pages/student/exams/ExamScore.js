import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ExamScore = () => {
  const { examId } = useParams();
  const [score, setScore] = useState({ examProblems: [] });

  const answerMap = {
    FIRST: "1번",
    SECOND: "2번",
    THIRD: "3번",
    FOURTH: "4번",
    FIFTH: "5번",
    NOT_SELECTED: "미선택",
  };

  useEffect(() => {
    // API 호출 대신 더미 데이터 사용
    // setScore(dummyScore);

    axios.get(`http://localhost:8081/scores/${examId}`).then((response) => {
      if (response.status === 200) {
        if (response.data === null) {
          setScore({ examProblems: [] });
        } else {
          const sortedData = {
            ...response.data,
            examProblems: [...response.data.examProblems].sort(
              (a, b) => a.number - b.number
            ),
          };
          setScore(sortedData);
        }
      } else {
        setScore({ examProblems: [] });
      }
    });

    // 실제 API 호출 코드 (주석 처리)
    /*
    const fetchScore = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/exams/${examId}/score`);
        setScore(response.data);
      } catch (error) {
        console.error('점수 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
    */
  }, []);

  // 난이도에 따른 배점 계산 함수
  const getDifficultyScore = (difficulty) => {
    switch (difficulty) {
      case "HARD":
        return 4;
      case "MEDIUM":
        return 3;
      case "EASY":
        return 2;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">시험 결과</h1>

        {/* 시험 기본 정보 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">시험 정보</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="mb-2">{score.title}</p>
            <p className="mb-2">
              시험 시간: {new Date(score?.startTime).toLocaleString()} ~{" "}
              {new Date(score?.endTime).toLocaleString()}
            </p>
            {/* <p>제출 시간: {new Date(score?.submitTime).toLocaleString()}</p> */}
          </div>
        </div>

        {/* 점수 정보 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">총점</h2>
          <div className="bg-blue-50 p-4 rounded">
            <div className="flex justify-between items-center">
              <span className="text-lg">획득 점수</span>
              <span className="text-2xl font-bold text-blue-600">
                {score?.type === "MIDTERM"
                  ? score?.midtermExamScore
                  : score?.finalExamScore}{" "}
                점
              </span>
            </div>
          </div>
        </div>

        {/* 문제별 채점 결과 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">문제별 결과</h2>
          <div className="space-y-4">
            {score?.examProblems?.map((problem) => (
              <div key={problem.problemId} className="border rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">문제 {problem.number}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      배점: {problem.difficulty}점
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        problem.correctness === "CORRECT"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {problem.correctness === "CORRECT" ? "정답" : "오답"}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{problem.question}</p>

                {/* 보기 목록 */}
                <div className="ml-4 mb-3 space-y-1">
                  {problem.choices.map((choice, index) => (
                    <div
                      key={index}
                      className={`text-sm ${
                        problem.correctAnswer ===
                        `${
                          ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH"][index]
                        }`
                          ? "text-blue-600 font-medium"
                          : problem.selectedAnswer ===
                            `${
                              ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH"][
                                index
                              ]
                            }`
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {index + 1}. {choice}
                      {problem.correctAnswer ===
                        `${
                          ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH"][index]
                        }` && " ✓"}
                      {problem.selectedAnswer ===
                        `${
                          ["FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH"][index]
                        }` &&
                        problem.correctness === "WRONG" &&
                        " ✗"}
                    </div>
                  ))}
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    선택한 답: {answerMap[problem.selectedAnswer] || "미선택"}
                  </p>
                  {problem.correctness === "WRONG" && (
                    <p className="text-red-600">
                      정답: {answerMap[problem.correctAnswer]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamScore;
