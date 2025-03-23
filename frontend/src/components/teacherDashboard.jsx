import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [newAssignment, setNewAssignment] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [inputMode, setInputMode] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(api.getTeacherTests, {
        headers: { Authorization: token }
      });
      setCourses(response.data);
    } catch (error) {
      toast.error("Failed to fetch courses");
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString("en-GB") + " " + now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  const handleAnnouncementChange = (event) => setNewAnnouncement(event.target.value);
  const handleAssignmentChange = (event) => setNewAssignment(event.target.value);

  const handlePostAnnouncement = () => {
    if (newAnnouncement.trim() === "") return;
    setAnnouncements([{ text: newAnnouncement, dateTime: getCurrentDateTime() }, ...announcements]);
    setNewAnnouncement("");
    setInputMode(null);
  };

  const handlePostAssignment = () => {
    if (newAssignment.trim() === "") return;
    setAssignments([{ text: newAssignment, dateTime: getCurrentDateTime() }, ...assignments]);
    setNewAssignment("");
    setInputMode(null);
  };

  const handleCreateTest = () => {
    navigate("/create-form");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (inputMode === "announcement") handlePostAnnouncement();
      else if (inputMode === "assignment") handlePostAssignment();
    }
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
                  <p className="text-gray-600 mb-4">Code: {course.courseCode}</p>
                  <p className="text-gray-600 mb-4">Students: {course.students.length}</p>
                  <button
                    onClick={handleCreateTest}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Create Test
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
            <div className="flex gap-4 w-full">
              {inputMode === "announcement" && (
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    placeholder="Make a class announcement..."
                    value={newAnnouncement}
                    onChange={handleAnnouncementChange}
                    onKeyDown={handleKeyPress}
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                  />
                  {newAnnouncement.trim() !== "" && (
                    <button
                      className="bg-purple-700 text-white px-4 py-2 rounded-lg ml-3 hover:bg-purple-800"
                      onClick={handlePostAnnouncement}
                    >
                      Submit
                    </button>
                  )}
                </div>
              )}

              {inputMode === "assignment" && (
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    placeholder="Give an assignment..."
                    value={newAssignment}
                    onChange={handleAssignmentChange}
                    onKeyDown={handleKeyPress}
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                  />
                  {newAssignment.trim() !== "" && (
                    <button
                      className="bg-blue-700 text-white px-4 py-2 rounded-lg ml-3 hover:bg-blue-800"
                      onClick={handlePostAssignment}
                    >
                      Submit
                    </button>
                  )}
                </div>
              )}
            </div>

            {!inputMode && (
              <FaPlus
                className="text-purple-700 text-2xl cursor-pointer"
                onClick={() => setShowOptions(!showOptions)}
              />
            )}
          </div>

          {/* Options for Announcement / Assignment */}
          {showOptions && (
            <div className="flex gap-4 mt-2">
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                onClick={() => {
                  setInputMode("announcement");
                  setShowOptions(false);
                }}
              >
                Announcement
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setInputMode("assignment");
                  setShowOptions(false);
                }}
              >
                Assignment
              </button>
            </div>
          )}

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

          {/* Assignments Section */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-blue-400">
            <div className="bg-blue-700 text-white px-4 py-2 rounded-t-lg font-bold">
              Assignments
            </div>
            {assignments.length > 0 ? (
              assignments.map((assignment, index) => (
                <div key={index} className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex justify-between items-center">
                  <p className="text-gray-800">{assignment.text}</p>
                  <span className="text-gray-500 text-sm">{assignment.dateTime}</span>
                  <button
                    onClick={handleCreateTest}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Create Test
                  </button>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500">No assignments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;




// import React, { useState, useEffect } from "react";
// import { FaPlus } from "react-icons/fa";

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

// const TeacherDashboard = () => {
//   const [newAnnouncement, setNewAnnouncement] = useState("");
//   const [announcements, setAnnouncements] = useState([]);
//   const [newAssignment, setNewAssignment] = useState("");
//   const [assignments, setAssignments] = useState([]);
//   const [inputMode, setInputMode] = useState(null);
//   const [showOptions, setShowOptions] = useState(false);

//   const getCurrentDateTime = () => {
//     const now = new Date();
//     return now.toLocaleDateString("en-GB") + " " + now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
//   };

//   const handleAnnouncementChange = (event) => setNewAnnouncement(event.target.value);
//   const handleAssignmentChange = (event) => setNewAssignment(event.target.value);

//   const handlePostAnnouncement = () => {
//     if (newAnnouncement.trim() === "") return;
//     setAnnouncements([{ text: newAnnouncement, dateTime: getCurrentDateTime() }, ...announcements]);
//     setNewAnnouncement("");
//     setInputMode(null);
//   };

//   const handlePostAssignment = () => {
//     if (newAssignment.trim() === "") return;
//     setAssignments([{ text: newAssignment, dateTime: getCurrentDateTime() }, ...assignments]);
//     setNewAssignment("");
//     setInputMode(null);
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === "Enter") {
//       if (inputMode === "announcement") handlePostAnnouncement();
//       else if (inputMode === "assignment") handlePostAssignment();
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen flex p-4">
//       <LiveCalendar />

//       <div className="w-[84%] flex flex-col items-center">
//         {/* Class Header */}
//         <div className="bg-purple-700 text-white p-8 rounded-lg shadow-md w-full max-w-4xl flex justify-between items-center ml-4 py-10">
//           <div>
//             <h1 className="text-5xl font-bold">DSA</h1>{/* aadithya take input of coure name from backend*/}
//             <p className="text-xl">Data Structures with Applications</p> {/* aadithya take input of coure descripton from backend*/}
//           </div>
//           <p className="text-lg font-semibold">Ruchira Nitin Selote</p> {/* aadithya take input of teacher name from backend*/}
//         </div>

//         {/* Input Section */}
//         <div className="bg-white w-full max-w-4xl mt-4 p-4 rounded-lg shadow-md border border-gray-300 flex items-center justify-between">
//           <div className="flex gap-4 w-full">
//             {inputMode === "announcement" && (
//               <div className="flex items-center w-full">
//                 <input
//                   type="text"
//                   placeholder="Make a class announcement..."
//                   value={newAnnouncement}
//                   onChange={handleAnnouncementChange}
//                   onKeyDown={handleKeyPress}
//                   className="w-full p-2 border border-gray-300 rounded-lg outline-none"
//                 />
//                 {newAnnouncement.trim() !== "" && (
//                   <button
//                     className="bg-purple-700 text-white px-4 py-2 rounded-lg ml-3 hover:bg-purple-800"
//                     onClick={handlePostAnnouncement}
//                   >
//                     Submit
//                   </button>
//                 )}
//               </div>
//             )}

//             {inputMode === "assignment" && (
//               <div className="flex items-center w-full">
//                 <input
//                   type="text"
//                   placeholder="Give an assignment..."
//                   value={newAssignment}
//                   onChange={handleAssignmentChange}
//                   onKeyDown={handleKeyPress}
//                   className="w-full p-2 border border-gray-300 rounded-lg outline-none"
//                 />
//                 {newAssignment.trim() !== "" && (
//                   <button
//                     className="bg-blue-700 text-white px-4 py-2 rounded-lg ml-3 hover:bg-blue-800"
//                     onClick={handlePostAssignment}
//                   >
//                     Submit
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>

//           {!inputMode && (
//             <FaPlus
//               className="text-purple-700 text-2xl cursor-pointer"
//               onClick={() => setShowOptions(!showOptions)}
//             />
//           )}
//         </div>

//         {/* Options for Announcement / Assignment */}
//         {showOptions && (
//           <div className="flex gap-4 mt-2">
//             <button
//               className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
//               onClick={() => {
//                 setInputMode("announcement");
//                 setShowOptions(false);
//               }}
//             >
//               Announcement
//             </button>
//             <button
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//               onClick={() => {
//                 setInputMode("assignment");
//                 setShowOptions(false);
//               }}
//             >
//               Assignment
//             </button>
//           </div>
//         )}

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
//         <div className="bg-white w-full max-w-4xl mt-4 p-4 rounded-lg shadow-md border border-blue-400">
//           <div className="bg-blue-700 text-white px-4 py-2 rounded-t-lg font-bold">
//             Tests
//           </div>
//           {assignments.length > 0 ? (
//             assignments.map((assignment, index) => (
//               <div key={index} className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex justify-between items-center">
//                 <p className="text-gray-800">{assignment.text}</p>
//                 <span className="text-gray-500 text-sm">{assignment.dateTime}</span>
//                 <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
//                   Conduct a test
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

// export default TeacherDashboard;
