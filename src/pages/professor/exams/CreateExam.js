import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CreateExam = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const difficultyMap = {
    1: "EASY",
    2: "BASIC",
    3: "NORMAL",
    4: "HARD",
  };

  const [examData, setExamData] = useState({
    openingId: courseId,
    type: "MIDTERM",
    startTime: "",
    endTime: "",
    problems: [
      {
        number: 1,
        question: "",
        score: 1,
        correctAnswer: "FIRST",
        choices: ["", "", "", ""],
      },
    ],
  });

  const handleProblemChange = (index, field, value) => {
    const newProblems = [...examData.problems];
    newProblems[index] = { ...newProblems[index], [field]: value };
    setExamData({ ...examData, problems: newProblems });
  };

  const handleChoiceChange = (problemIndex, choiceIndex, value) => {
    const newProblems = [...examData.problems];
    const newChoices = [...newProblems[problemIndex].choices];
    newChoices[choiceIndex] = value;
    newProblems[problemIndex] = {
      ...newProblems[problemIndex],
      choices: newChoices,
    };
    setExamData({ ...examData, problems: newProblems });
  };

  const addProblem = () => {
    setExamData({
      ...examData,
      problems: [
        ...examData.problems,
        {
          number: examData.problems.length + 1,
          question: "",
          score: 1,
          correctAnswer: "FIRST",
          choices: ["", "", "", ""],
        },
      ],
    });
  };

  const removeProblem = (index) => {
    const newProblems = examData.problems.filter((_, i) => i !== index);
    // 문제 번호 재정렬
    const reorderedProblems = newProblems.map((problem, i) => ({
      ...problem,
      number: i + 1,
    }));
    setExamData({ ...examData, problems: reorderedProblems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      ...examData,
      startTime: examData.startTime + ":00",
      endTime: examData.endTime + ":00",
      problems: examData.problems.map((problem) => ({
        ...problem,
        difficulty: difficultyMap[problem.score], // score를 difficulty로 변환
        score: undefined, // score 필드 제거
      })),
    };

    console.log(requestData);

    try {
      const response = await axios.post(
        `http://localhost:8081/exams`,
        JSON.stringify(requestData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("시험이 성공적으로 출제되었습니다.");
        navigate(-1);
      }
    } catch (error) {
      alert("시험 출제에 실패했습니다.");
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">시험 출제</h1>

          {/* 시험 기본 정보 */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시험 유형
              </label>
              <select
                value={examData.type}
                onChange={(e) =>
                  setExamData({ ...examData, type: e.target.value })
                }
                className="w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="MIDTERM">중간고사</option>
                <option value="FINAL">기말고사</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시작 시간
                </label>
                <input
                  type="datetime-local"
                  value={examData.startTime}
                  onChange={(e) =>
                    setExamData({ ...examData, startTime: e.target.value })
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  종료 시간
                </label>
                <input
                  type="datetime-local"
                  value={examData.endTime}
                  onChange={(e) =>
                    setExamData({ ...examData, endTime: e.target.value })
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* 문제 목록 */}
          <div className="space-y-6">
            {examData.problems.map((problem, problemIndex) => (
              <div key={problemIndex} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">문제 {problem.number}</h3>
                  <button
                    type="button"
                    onClick={() => removeProblem(problemIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    삭제
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      문제
                    </label>
                    <textarea
                      value={problem.question}
                      onChange={(e) =>
                        handleProblemChange(
                          problemIndex,
                          "question",
                          e.target.value
                        )
                      }
                      className="w-full border-gray-300 rounded-md shadow-sm"
                      rows="2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      배점
                    </label>
                    <select
                      value={problem.score}
                      onChange={(e) =>
                        handleProblemChange(
                          problemIndex,
                          "score",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full border-gray-300 rounded-md shadow-sm"
                    >
                      <option value={1}>1점</option>
                      <option value={2}>2점</option>
                      <option value={3}>3점</option>
                      <option value={4}>4점</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      보기
                    </label>
                    <div className="space-y-2">
                      {problem.choices.map((choice, choiceIndex) => (
                        <div
                          key={choiceIndex}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name={`correct-${problemIndex}`}
                            checked={
                              problem.correctAnswer ===
                              `${
                                ["FIRST", "SECOND", "THIRD", "FOURTH"][
                                  choiceIndex
                                ]
                              }`
                            }
                            onChange={() =>
                              handleProblemChange(
                                problemIndex,
                                "correctAnswer",
                                ["FIRST", "SECOND", "THIRD", "FOURTH"][
                                  choiceIndex
                                ]
                              )
                            }
                            className="h-4 w-4 text-blue-600"
                          />
                          <input
                            type="text"
                            value={choice}
                            onChange={(e) =>
                              handleChoiceChange(
                                problemIndex,
                                choiceIndex,
                                e.target.value
                              )
                            }
                            placeholder={`${choiceIndex + 1}번 보기`}
                            className="flex-1 border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 text-right">
              <span className="text-sm font-medium text-gray-700">
                총점:{" "}
                {examData.problems.reduce(
                  (sum, problem) => sum + problem.score,
                  0
                )}
                점
              </span>
            </div>
          </div>

          {/* 문제 추가 버튼 */}
          <button
            type="button"
            onClick={addProblem}
            className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            문제 추가
          </button>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            출제하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExam;
