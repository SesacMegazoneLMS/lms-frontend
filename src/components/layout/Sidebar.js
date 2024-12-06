import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  BellIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  BuildingLibraryIcon,
  UserCircleIcon,
  InboxIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  PencilSquareIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // 현재 경로가 활성화되어 있는지 확인하는 함수
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // 역할별 메뉴 아이템 설정
  const menuItems = {
    student: [
      {
        title: "수업 관리",
        items: [
          {
            path: "/student/dashboard",
            icon: <HomeIcon className="w-5 h-5" />,
            label: "대시보드",
          },
          {
            path: "/student/enrollment",
            icon: <PencilSquareIcon className="w-5 h-5" />,
            label: "수강신청",
          },
          {
            path: "/student/timetable",
            icon: <CalendarIcon className="w-5 h-5" />,
            label: "시간표",
          },
          {
            path: "/student/courses",
            icon: <BookOpenIcon className="w-5 h-5" />,
            label: "수강 과목",
          },
          {
            path: "/student/attendance",
            icon: <ClockIcon className="w-5 h-5" />,
            label: "출석 현황",
            badge: "85%",
          },
        ],
      },
      {
        title: "학습 활동",
        items: [
          {
            path: "/student/assignments",
            icon: <DocumentTextIcon className="w-5 h-5" />,
            label: "과제",
            badge: 2,
          },
          {
            path: "/student/grades",
            icon: <ChartBarIcon className="w-5 h-5" />,
            label: "성적 조회",
          },
          {
            path: "/student/messages",
            icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
            label: "메시지",
            badge: "NEW",
          },
          {
            path: "/student/library",
            icon: <BuildingLibraryIcon className="w-5 h-5" />,
            label: "도서관",
          },
        ],
      },
      {
        title: "개인 설정",
        items: [
          {
            path: "/student/profile",
            icon: <UserCircleIcon className="w-5 h-5" />,
            label: "프로필",
          },
          {
            path: "/student/notifications",
            icon: <BellIcon className="w-5 h-5" />,
            label: "알림",
            badge: 3,
          },
          {
            path: "/student/inbox",
            icon: <InboxIcon className="w-5 h-5" />,
            label: "쪽지함",
          },
        ],
      },
    ],
    professor: [
      {
        title: "강의 관리",
        items: [
          {
            path: "/professor/dashboard",
            icon: <HomeIcon className="w-5 h-5" />,
            label: "대시보드",
          },
          {
            path: "/professor/courses",
            icon: <AcademicCapIcon className="w-5 h-5" />,
            label: "강의 관리",
          },
          {
            path: "/professor/assignments",
            icon: <DocumentTextIcon className="w-5 h-5" />,
            label: "과제 관리",
          },
          {
            path: "/professor/students",
            icon: <UsersIcon className="w-5 h-5" />,
            label: "학생 관리",
          },
        ],
      },
      {
        title: "학사 업무",
        items: [
          {
            path: "/professor/schedule",
            icon: <CalendarIcon className="w-5 h-5" />,
            label: "수업 일정",
          },
          {
            path: "/professor/grades",
            icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
            label: "성적 관리",
          },
          {
            path: "/professor/documents",
            icon: <DocumentDuplicateIcon className="w-5 h-5" />,
            label: "문서 관리",
          },
          {
            path: "/professor/groups",
            icon: <UserGroupIcon className="w-5 h-5" />,
            label: "그룹 관리",
          },
        ],
      },
      {
        title: "설정",
        items: [
          {
            path: "/professor/settings",
            icon: <Cog6ToothIcon className="w-5 h-5" />,
            label: "환경설정",
          },
          {
            path: "/professor/notifications",
            icon: <BellIcon className="w-5 h-5" />,
            label: "알림",
            badge: 5,
          },
        ],
      },
    ],
    admin: [
      {
        title: "시스템 관리",
        items: [
          {
            path: "/admin/dashboard",
            icon: <HomeIcon className="w-5 h-5" />,
            label: "대시보드",
          },
          {
            path: "/admin/users",
            icon: <UsersIcon className="w-5 h-5" />,
            label: "사용자 관리",
          },
          {
            path: "/admin/departments",
            icon: <UsersIcon className="w-5 h-5" />,
            label: "학과 관리",
          },
          {
            path: "/admin/courses",
            icon: <UsersIcon className="w-5 h-5" />,
            label: "강의 관리",
          },
          {
            path: "/admin/system",
            icon: <WrenchScrewdriverIcon className="w-5 h-5" />,
            label: "시스템 관리",
          },
          {
            path: "/admin/boards",
            icon: <TagIcon className="w-5 h-5" />,
            label: "게시판 관리",
          },
        ],
      },
      {
        title: "모니터링",
        items: [
          {
            path: "/admin/analytics",
            icon: <ChartBarIcon className="w-5 h-5" />,
            label: "통계 분석",
          },
          {
            path: "/admin/logs",
            icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
            label: "시스템 로그",
          },
          {
            path: "/admin/notifications",
            icon: <BellIcon className="w-5 h-5" />,
            label: "알림 관리",
          },
        ],
      },
      {
        title: "리소스 관리",
        items: [
          {
            path: "/admin/documents",
            icon: <DocumentDuplicateIcon className="w-5 h-5" />,
            label: "문서 관리",
          },
          {
            path: "/admin/messages",
            icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
            label: "메시지 관리",
          },
          {
            path: "/admin/settings",
            icon: <Cog6ToothIcon className="w-5 h-5" />,
            label: "환경설정",
          },
        ],
      },
    ],
  };

  const currentMenuItems = menuItems[user?.role] || [];

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-gray-800 text-white overflow-y-auto">
      {/* 사용자 정보 */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            src="/assets/profile-placeholder.png"
            alt="프로필"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-white">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.department}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* 메뉴 목록 */}
      <nav className="p-4">
        {currentMenuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase">
              {section.title}
            </h3>
            {section.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white mb-1 ${
                  isActive(item.path) ? "bg-gray-700 text-white" : ""
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm flex-grow">{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.badge === "NEW"
                        ? "bg-green-500 text-white"
                        : typeof item.badge === "number"
                        ? "bg-red-500 text-white"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
