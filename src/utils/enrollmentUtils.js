import { courseAPI, enrollmentAPI } from '../api/services';

export const checkPrerequisites = async (studentId, courseId) => {
  try {
    const result = await enrollmentAPI.checkPrerequisites(studentId, courseId);
    return result.satisfied;
  } catch (error) {
    console.error('Error checking prerequisites:', error);
    return false;
  }
};

export const checkTimeConflict = async (studentId, courseId) => {
  try {
    const result = await enrollmentAPI.checkTimeConflict(studentId, courseId);
    return result.hasConflict;
  } catch (error) {
    console.error('Error checking time conflict:', error);
    return true;
  }
};

export const checkCreditLimit = async (studentId, courseId) => {
  try {
    const result = await enrollmentAPI.checkCreditLimit(studentId, courseId);
    return result.withinLimit;
  } catch (error) {
    console.error('Error checking credit limit:', error);
    return false;
  }
};

export const enrollCourse = async (studentId, courseId) => {
  try {
    // 수강 가능 여부 확인
    const [prerequisitesSatisfied, noTimeConflict, withinCreditLimit] = await Promise.all([
      checkPrerequisites(studentId, courseId),
      checkTimeConflict(studentId, courseId),
      checkCreditLimit(studentId, courseId)
    ]);

    if (!prerequisitesSatisfied) {
      throw new Error('선수과목을 이수하지 않았습니다.');
    }

    if (noTimeConflict) {
      throw new Error('시간표가 중복됩니다.');
    }

    if (!withinCreditLimit) {
      throw new Error('최대 수강 가능 학점을 초과했습니다.');
    }

    // 수강신청 진행
    const result = await enrollmentAPI.enrollCourse(studentId, courseId);
    return result;
  } catch (error) {
    console.error('Error enrolling course:', error);
    throw error;
  }
};

export const dropCourse = async (studentId, courseId) => {
  try {
    const result = await enrollmentAPI.dropCourse(studentId, courseId);
    return result;
  } catch (error) {
    console.error('Error dropping course:', error);
    throw error;
  }
};

export const getEnrollmentStatus = async (courseId) => {
  try {
    const course = await courseAPI.getCourse(courseId);
    return {
      enrolled: course.enrolled,
      capacity: course.capacity,
      isAvailable: course.enrolled < course.capacity
    };
  } catch (error) {
    console.error('Error getting enrollment status:', error);
    throw error;
  }
};