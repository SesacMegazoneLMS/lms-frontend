export const systemLogs = [
    {
      id: 1,
      timestamp: '2024-03-20T09:00:00Z',
      level: 'INFO',
      source: 'Enrollment Service',
      message: '수강신청 기간 시작'
    },
    // ... 더 많은 로그 데이터
  ];
  
  export const systemSettings = {
    system: {
      maintenanceMode: false,
      maintenanceMessage: '',
      allowNewRegistrations: true,
      maxLoginAttempts: 5
    },
    email: {
      smtpServer: 'smtp.university.ac.kr',
      smtpPort: '587',
      smtpUsername: 'noreply@university.ac.kr',
      emailFromAddress: 'noreply@university.ac.kr'
    },
    // ... 더 많은 설정
  };