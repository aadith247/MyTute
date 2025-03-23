import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../api/config";

const LiveCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-purple-200 p-4 rounded-lg shadow-md w-[16%] text-center border border-purple-400">
      <p className="text-purple-700 font-semibold text-lg">
        {currentDate.toLocaleDateString("en-GB")}
      </p>
      <p className="text-purple-900 font-bold text-xl">
        {currentDate.toLocaleDateString("en-GB", { weekday: "long" })}
      </p>
    </div>
  );
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(api.getEnrolledCourses, {
        headers: { Authorization: token }
      });
      setCourses(response.data);

      // Fetch tests for each course
      const allTests = await Promise.all(
        response.data.map(course =>
          axios.get(`${api.getStudentTests}/${course._id}/tests`, {
            headers: { Authorization: token }
          })
        )
      );

      const flattenedTests = allTests.flatMap(response => response.data);
      setTests(flattenedTests);
    } catch (error) {
      toast.error("Failed to fetch courses");
    }
  };

  const handleTakeTest = (testId) => {
    navigate(`/student-test/${testId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="flex gap-4">
        <LiveCalendar />

        <div className="w-[84%] space-y-4">
          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-md border border-purple-400 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-4">
                  <h3 className="text-white text-xl font-bold">{course.courseName}</h3>
                  <p className="text-purple-100">{course.courseTitle}</p>
                </div>
                <div className="p-4">
                  <p className="text-gray-600">Teacher: {course.teacherId.Fullname}</p>
                  <p className="text-gray-600 mb-4">Code: {course.courseCode}</p>
                  <div className="space-y-2">
                    {tests
                      .filter(test => test.courseId === course._id)
                      .map(test => (
                        <div key={test._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>{test.title}</span>
                          {!test.submitted ? (
                            <button
                              onClick={() => handleTakeTest(test._id)}
                              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                            >
                              Take Test
                            </button>
                          ) : (
                            <span className="text-green-600">Score: {test.score}/{test.questions.length}</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Announcements Section */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-purple-400">
            <div className="bg-purple-700 text-white px-4 py-2 rounded-t-lg font-bold">
              Announcements
            </div>
            {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <div key={index} className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex justify-between items-center">
                  <p className="text-gray-800">{announcement.text}</p>
                  <span className="text-gray-500 text-sm">{announcement.dateTime}</span>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500">No announcements yet.</p>
            )}
          </div>

          {/* Tests Section */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-blue-400">
            <div className="bg-blue-700 text-white px-4 py-2 rounded-t-lg font-bold">
              Available Tests
            </div>
            {tests.length > 0 ? (
              tests.map((test) => (
                <div key={test._id} className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="text-gray-800 font-semibold">{test.title}</p>
                    <p className="text-gray-600">{test.description}</p>
                    <p className="text-gray-500 text-sm">Start Time: {new Date(test.startTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                  </div>
                  {!test.submitted ? (
                    <button
                      onClick={() => handleTakeTest(test._id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Take Test
                    </button>
                  ) : (
                    <div className="text-green-600 font-semibold">
                      Completed - Score: {test.score}/{test.questions.length}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500">No tests available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;




// import React, { useState, useEffect } from "react";

// const LiveCalendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentDate(new Date());
//     }, 1000 * 60);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="bg-purple-200 p-4 rounded-lg shadow-md w-[16%] text-center border border-purple-400">
//       <p className="text-purple-700 font-semibold text-lg">
//         {currentDate.toLocaleDateString("en-GB")}
//       </p>
//       <p className="text-purple-900 font-bold text-xl">
//         {currentDate.toLocaleDateString("en-GB", { weekday: "long" })}
//       </p>
//     </div>
//   );
// };

// const StudentDashboard = () => {   // aadithya take input of course name, course description, teacher name, announcements and assignments from backend
//   const [announcements, setAnnouncements] = useState([
//     { text: "Exam on Monday", dateTime: "15/03/2025 10:00 AM" },
//     { text: "New course material uploaded", dateTime: "14/03/2025 8:30 AM" },
//   ]);
   
//   const [assignments, setAssignments] = useState([
//     { text: "Assignment 1: Linked Lists", dateTime: "15/03/2025 5:00 PM" },
//     { text: "Assignment 2: Binary Trees", dateTime: "14/03/2025 6:00 PM" },
//   ]);

//   return (
//     <div className="bg-gray-100 min-h-screen flex p-4">
//       <LiveCalendar />

//       <div className="w-[84%] flex flex-col items-center">
//         {/* Class Header */}
//         <div className="bg-purple-700 text-white p-8 rounded-lg shadow-md w-full max-w-4xl flex justify-between items-center ml-4 py-10">
//           <div>
//             <h1 className="text-5xl font-bold">DSA</h1> {/* aadithya take input of coure name from backend*/}
//             <p className="text-xl">Data Structures with Applications</p> {/* aadithya take input of coure descripton from backend*/}
//           </div>
//           <p className="text-lg font-semibold">Ruchira Nitin Selote</p> {/* aadithya take input of teacher name from backend*/}
//         </div>

//         {/* Announcements Section */}
//         <div className="bg-white w-full max-w-4xl mt-4 p-4 rounded-lg shadow-md border border-purple-400">
//           <div className="bg-purple-700 text-white px-4 py-2 rounded-t-lg font-bold">
//             Announcements
//           </div>
//           {announcements.length > 0 ? (
//             announcements.map((announcement, index) => (
//               <div key={index} className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex justify-between items-center">
//                 <p className="text-gray-800">{announcement.text}</p>
//                 <span className="text-gray-500 text-sm">{announcement.dateTime}</span>
//               </div>
//             ))
//           ) : (
//             <p className="p-4 text-gray-500">No announcements yet.</p>
//           )}
//         </div>

//         {/* Assignments Section */}
//         <div className="bg-white w-full max-w-4xl mt-4 p-4 rounded-lg shadow-md border border-blue-400">
//           <div className="bg-blue-700 text-white px-4 py-2 rounded-t-lg font-bold">
//             Assignments
//           </div>
//           {assignments.length > 0 ? (
//             assignments.map((assignment, index) => (
//               <div key={index} className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex justify-between items-center">
//                 <p className="text-gray-800">{assignment.text}</p>
//                 <span className="text-gray-500 text-sm">{assignment.dateTime}</span>
//                 <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
//                   Take Test
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p className="p-4 text-gray-500">No assignments yet.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;
