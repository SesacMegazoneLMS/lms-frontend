export const courses = [
    {
      id: '1',
      code: 'CSE101',
      name: '웹 프로그래밍',
      professor: '김교수',
      credits: 3,
      department: '컴퓨터공학과',
      grade: 2,
      category: '전공필수',
      semester: '2024-1',
      capacity: 40,
      enrolled: 35,
      schedule: [
        { day: '월', startTime: '10:30', endTime: '12:00', room: '공학관 401호' },
        { day: '수', startTime: '10:30', endTime: '12:00', room: '공학관 401호' }
      ],
      description: '웹 프로그래밍의 기초부터 심화까지 학습'
    },
    {
      id: '2',
      code: 'CSE202',
      name: '데이터베이스',
      professor: '이교수',
      credits: 3,
      department: '컴퓨터공학과',
      grade: 2,
      category: '전공필수',
      semester: '2024-1',
      capacity: 35,
      enrolled: 30,
      schedule: [
        { day: '화', startTime: '13:30', endTime: '15:00', room: '공학관 405호' },
        { day: '목', startTime: '13:30', endTime: '15:00', room: '공학관 405호' }
      ],
      description: '데이터베이스 설계 및 구현'
    },
    // ... 더 많은 강의 데이터 추가 가능
  ];
  
  export const departments = [
    { id: '1', name: '컴퓨터공학과' },
    { id: '2', name: '소프트웨어학과' },
    { id: '3', name: '정보통신공학과' },
    { id: '4', name: '전자공학과' }
  ];
  
  export const categories = [
    { id: '1', name: '전공필수' },
    { id: '2', name: '전공선택' },
    { id: '3', name: '교양필수' },
    { id: '4', name: '교양선택' }
  ];
  
  export const grades = [
    { id: '1', name: '1학년' },
    { id: '2', name: '2학년' },
    { id: '3', name: '3학년' },
    { id: '4', name: '4학년' }
  ];