import React, { useState, useEffect } from 'react';
import { systemAPI } from '../../../api/services';

const Settings = () => {
  const [settings, setSettings] = useState({
    system: {
      maintenanceMode: false,
      maintenanceMessage: '',
      allowNewRegistrations: true,
      maxLoginAttempts: 5
    },
    email: {
      smtpServer: '',
      smtpPort: '',
      smtpUsername: '',
      emailFromAddress: ''
    },
    enrollment: {
      enrollmentStartDate: '',
      enrollmentEndDate: '',
      maxCreditsPerSemester: 18,
      minCreditsPerSemester: 12
    },
    security: {
      passwordMinLength: 8,
      passwordRequireSpecialChar: true,
      sessionTimeout: 30,
      ipWhitelist: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await systemAPI.getSettings();
      setSettings(data);
    } catch (err) {
      setError('설정을 불러오는데 실패했습니다.');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaveStatus('saving');
      await systemAPI.updateSettings(settings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('error');
      console.error('Error saving settings:', err);
    }
  };

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">시스템 설정</h1>
        <div className="flex items-center space-x-2">
          {saveStatus === 'saving' && (
            <span className="text-blue-600">저장 중...</span>
          )}
          {saveStatus === 'success' && (
            <span className="text-green-600">저장 완료</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-600">저장 실패</span>
          )}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            설정 저장
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 시스템 설정 */}
        <SettingsSection title="시스템 설정">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingToggle
              label="유지보수 모드"
              value={settings.system.maintenanceMode}
              onChange={(value) => handleSettingChange('system', 'maintenanceMode', value)}
            />
            <SettingInput
              label="유지보수 메시지"
              value={settings.system.maintenanceMessage}
              onChange={(value) => handleSettingChange('system', 'maintenanceMessage', value)}
            />
            <SettingToggle
              label="새 회원가입 허용"
              value={settings.system.allowNewRegistrations}
              onChange={(value) => handleSettingChange('system', 'allowNewRegistrations', value)}
            />
            <SettingInput
              label="최대 로그인 시도 횟수"
              type="number"
              value={settings.system.maxLoginAttempts}
              onChange={(value) => handleSettingChange('system', 'maxLoginAttempts', value)}
            />
          </div>
        </SettingsSection>

        {/* 이메일 설정 */}
        <SettingsSection title="이메일 설정">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingInput
              label="SMTP 서버"
              value={settings.email.smtpServer}
              onChange={(value) => handleSettingChange('email', 'smtpServer', value)}
            />
            <SettingInput
              label="SMTP 포트"
              value={settings.email.smtpPort}
              onChange={(value) => handleSettingChange('email', 'smtpPort', value)}
            />
            <SettingInput
              label="SMTP 사용자명"
              value={settings.email.smtpUsername}
              onChange={(value) => handleSettingChange('email', 'smtpUsername', value)}
            />
            <SettingInput
              label="발신 이메일 주소"
              value={settings.email.emailFromAddress}
              onChange={(value) => handleSettingChange('email', 'emailFromAddress', value)}
            />
          </div>
        </SettingsSection>

        {/* 수강신청 설정 */}
        <SettingsSection title="수강신청 설정">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingInput
              label="수강신청 시작일"
              type="date"
              value={settings.enrollment.enrollmentStartDate}
              onChange={(value) => handleSettingChange('enrollment', 'enrollmentStartDate', value)}
            />
            <SettingInput
              label="수강신청 종료일"
              type="date"
              value={settings.enrollment.enrollmentEndDate}
              onChange={(value) => handleSettingChange('enrollment', 'enrollmentEndDate', value)}
            />
            <SettingInput
              label="최대 신청 학점"
              type="number"
              value={settings.enrollment.maxCreditsPerSemester}
              onChange={(value) => handleSettingChange('enrollment', 'maxCreditsPerSemester', value)}
            />
            <SettingInput
              label="최소 신청 학점"
              type="number"
              value={settings.enrollment.minCreditsPerSemester}
              onChange={(value) => handleSettingChange('enrollment', 'minCreditsPerSemester', value)}
            />
          </div>
        </SettingsSection>

        {/* 보안 설정 */}
        <SettingsSection title="보안 설정">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingInput
              label="최소 비밀번호 길이"
              type="number"
              value={settings.security.passwordMinLength}
              onChange={(value) => handleSettingChange('security', 'passwordMinLength', value)}
            />
            <SettingToggle
              label="특수문자 필수 여부"
              value={settings.security.passwordRequireSpecialChar}
              onChange={(value) => handleSettingChange('security', 'passwordRequireSpecialChar', value)}
            />
            <SettingInput
              label="세션 타임아웃 (분)"
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(value) => handleSettingChange('security', 'sessionTimeout', value)}
            />
            <SettingInput
              label="IP 화이트리스트"
              value={settings.security.ipWhitelist}
              placeholder="쉼표로 구분된 IP 주소"
              onChange={(value) => handleSettingChange('security', 'ipWhitelist', value)}
            />
          </div>
        </SettingsSection>
      </form>
    </div>
  );
};

// 설정 섹션 컴포넌트
const SettingsSection = ({ title, children }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
    {children}
  </div>
);

// 설정 입력 컴포넌트
const SettingInput = ({ label, type = 'text', value, onChange, placeholder = '' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
  </div>
);

// 설정 토글 컴포넌트
const SettingToggle = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      type="button"
      className={`${
        value ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      onClick={() => onChange(!value)}
    >
      <span
        className={`${
          value ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
);

export default Settings;