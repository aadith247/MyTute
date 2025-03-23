// export const API_BASE_URL = 'http://localhost:3000';

// export const api = {
//   // Teacher endpoints
//   teacherSignup: `${API_BASE_URL}/teacher/signup`,
//   teacherSignin: `${API_BASE_URL}/teacher/signin`,
//   teacherVerifyOtp: `${API_BASE_URL}/teacher/verify-otp`,
//   createCourse: `${API_BASE_URL}/teacher/course`,
//   createTest: `${API_BASE_URL}/teacher/test`,
//   getTeacherTests: `${API_BASE_URL}/teacher/course`,

//   // Student endpoints
//   studentSignup: `${API_BASE_URL}/student/signup`,
//   studentSignin: `${API_BASE_URL}/student/signin`,
//   studentVerifyOtp: `${API_BASE_URL}/student/verify-otp`,
//   enrollCourse: `${API_BASE_URL}/student/enroll`,
//   getEnrolledCourses: `${API_BASE_URL}/student/courses`,
//   getTest: `${API_BASE_URL}/student/test`,
//   submitTest: `${API_BASE_URL}/student/test`,
//   getStudentTests: `${API_BASE_URL}/student/course`
// };

export const API_BASE_URL = 'http://localhost:3000';

export const api = {
  // Teacher endpoints
  teacherSignup: `${API_BASE_URL}/teacher/signup`,
  teacherSignin: `${API_BASE_URL}/teacher/signin`,
  teacherVerifyOtp: `${API_BASE_URL}/teacher/verify-otp`,
  createCourse: `${API_BASE_URL}/teacher/course`,
  createTest: `${API_BASE_URL}/teacher/test`,
  getTeacherTests: `${API_BASE_URL}/teacher/courses`,

  // Student endpoints
  studentSignup: `${API_BASE_URL}/student/signup`,
  studentSignin: `${API_BASE_URL}/student/signin`,
  studentVerifyOtp: `${API_BASE_URL}/student/verify-otp`,
  enrollCourse: `${API_BASE_URL}/student/enroll`,
  getEnrolledCourses: `${API_BASE_URL}/student/courses`,
  getTest: `${API_BASE_URL}/student/test`,
  submitTest: `${API_BASE_URL}/student/test`,
  getStudentTests: `${API_BASE_URL}/student/course`
};