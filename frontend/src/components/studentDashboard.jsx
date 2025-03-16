import React, { useState, useEffect } from "react";

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

const StudentDashboard = () => {   // aadithya take input of course name, course description, teacher name, announcements and assignments from backend
  const [announcements, setAnnouncements] = useState([
    { text: "Exam on Monday", dateTime: "15/03/2025 10:00 AM" },
    { text: "New course material uploaded", dateTime: "14/03/2025 8:30 AM" },
  ]);
   
  const [assignments, setAssignments] = useState([
    { text: "Assignment 1: Linked Lists", dateTime: "15/03/2025 5:00 PM" },
    { text: "Assignment 2: Binary Trees", dateTime: "14/03/2025 6:00 PM" },
  ]);

  return (
    <div className="bg-gray-100 min-h-screen flex p-4">
      <LiveCalendar />

      <div className="w-[84%] flex flex-col items-center">
        {/* Class Header */}
        <div className="bg-purple-700 text-white p-8 rounded-lg shadow-md w-full max-w-4xl flex justify-between items-center ml-4 py-10">
          <div>
            <h1 className="text-5xl font-bold">DSA</h1> {/* aadithya take input of coure name from backend*/}
            <p className="text-xl">Data Structures with Applications</p> {/* aadithya take input of coure descripton from backend*/}
          </div>
          <p className="text-lg font-semibold">Ruchira Nitin Selote</p> {/* aadithya take input of teacher name from backend*/}
        </div>

        {/* Announcements Section */}
        <div className="bg-white w-full max-w-4xl mt-4 p-4 rounded-lg shadow-md border border-purple-400">
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
        <div className="bg-white w-full max-w-4xl mt-4 p-4 rounded-lg shadow-md border border-blue-400">
          <div className="bg-blue-700 text-white px-4 py-2 rounded-t-lg font-bold">
            Assignments
          </div>
          {assignments.length > 0 ? (
            assignments.map((assignment, index) => (
              <div key={index} className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex justify-between items-center">
                <p className="text-gray-800">{assignment.text}</p>
                <span className="text-gray-500 text-sm">{assignment.dateTime}</span>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Take Test
                </button>
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-500">No assignments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
