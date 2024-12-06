import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AssignmentList = () => {
  // const assignments = [
  //   {
  //     id: 1,
  //     title: "React 컴포넌트 구현",
  //     course: "웹 프로그래밍",
  //     dueDate: "2024.03.20",
  //     status: "미제출",
  //     priority: "high",
  //   },
  //   {
  //     id: 2,
  //     title: "API 연동 과제",
  //     course: "웹 프로그래밍",
  //     dueDate: "2024.03.25",
  //     status: "제출완료",
  //     priority: "medium",
  //   },
  //   // ... 더 많은 과제 데이터
  // ];

  const [assignments, setAssignments] = useState([]);

  let studentId = "eeeeeeee-2222-2222-2222-222222222222";

  useEffect(() => {
    axios
      .get(`http://localhost:8081/assignments/${studentId}`)
      .then((response) => {
        if (response.status === 200) {
          if (response.data === null) {
            setAssignments([]);
          } else {
            setAssignments(response.data);
          }
        } else {
          setAssignments([]);
        }
      });
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-50 border-red-200";
      case "medium":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-green-50 border-green-200";
    }
  };

  const getStatusColor = (status) => {
    return status === "INCOMPLETE" ? "text-red-500" : "text-green-500";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">과제 목록</h1>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className={`border rounded-lg p-4 ${getPriorityColor(
              assignment.priority
            )}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{assignment.title}</h3>
                <p className="text-gray-600">{assignment.course}</p>
                <p className="text-sm text-gray-500">
                  마감일: {assignment.deadline}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`font-medium ${getStatusColor(assignment.status)}`}
                >
                  {assignment.status}
                </span>
                {assignment.status === "INCOMPLETE" && (
                  <Link
                    to={`/student/assignments/submit/${assignment.id}`}
                    className="block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    과제 제출
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;
