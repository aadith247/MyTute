import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import {useLocation} from 'react-router-dom';
import { useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { api } from "../api/config";
import { API_BASE_URL } from "../api/config";






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

const TeacherDashboard =  () => 
{
  const navigate=useNavigate();


  

  const [course,setCourse]=useState({});
  const [tests,setTests]=useState('');
  const [newTest,setNewTests]=useState('');
  const [announcement, setAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const {courseId}=useParams();




 
  const [inputMode, setInputMode] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [newAnnouncement,setNewAnnouncement]=useState('');


  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;
  
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${api.createCourse}/${courseId}/announcements`, {
        content: announcement
      }, {
        headers: { Authorization: token }
      });
      
      setAnnouncement('');
      fetchAnnouncements();
      toast.success('Announcement posted successfully');
    } catch (error) {
      toast.error('Failed to post announcement');
    }
  };
  
  const handleCreateTest = (x) => {
    navigate(`/course/${courseId}/create-form/${x}`);
  };


  // const location=useLocation();
  // // const courseId = location.state?.courseId;
 const token=localStorage.getItem("token");

  // // const response = await axios.get(`${API_BASE_URL}/${courseId}/tests`,{
  // //   headers:{
  // //     'Authorization':token
  // //   }
  // // });

  
  const fetchTests=async ()=>{
   const response= await axios.get(`${API_BASE_URL}/teacher/course/${courseId}/tests`,{
      headers: {
        Authorization : token
      }
    });

    setTests(response.data);

   

    
  }

  const fetchCourse = async ()=>{
  const response= await axios.get(`${API_BASE_URL}/teacher/course/${courseId}`,{
      headers: {
        Authorization : token
      }
    });
  
    setCourse(response.data);
  }


  useEffect(()=>{
    fetchCourse();
   },[]);


   useEffect(()=>{
    fetchTests();
   },[]);







  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString("en-GB") + " " + now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };


  const handleAssignmentChange = (event) => setNewTests(event.target.value);

  const handlePostAnnouncement = () => {
    if (newAnnouncement.trim() === "") return;
    setAnnouncements([{ text: newAnnouncement, dateTime: getCurrentDateTime() }, ...announcements]);
    setNewAnnouncement({text:newAnnouncement,dateTime:getCurrentDateTime()});
    setInputMode(null);
    setAnnouncement('');

     {handleAnnouncementSubmit} 
  };

  

  const handlePostAssignment = () => {
   
    setTests([{ text: newTest, dateTime: getCurrentDateTime() }, ...tests]);

    setNewTests("");
    setInputMode(null);

  };

  const handleKeyPress = (event) => 
  {
    if (event.key === "Enter") {
      if (inputMode === "announcement") handlePostAnnouncement();
      else if (inputMode === "assignment") handlePostAssignment();
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex p-4">
      <LiveCalendar />

      <div className="w-[84%] flex flex-col items-center">
        {/* Class Header */}
        <div className="bg-purple-700 text-white p-8 rounded-lg shadow-md w-full max-w-4xl flex justify-between items-center ml-4 py-10">
          <div>
            <h1 className="text-5xl font-bold">{course.courseName}</h1>
            <p className="text-xl">{course.courseDescription}</p> 
          </div>
     
        </div>

        {/* Input Section */}
        <div className="bg-white w-full max-w-4xl mt-4 p-4 rounded-lg shadow-md border border-gray-300 flex items-center justify-between">
          <div className="flex gap-4 w-full">
            {inputMode === "announcement" && (
              <div className="flex items-center w-full">
                <input
                  type="text"
                  placeholder="Make a class announcement..."
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                />
                {newAnnouncement.trim() !== "" && (
                  <button
                    className="bg-purple-700 text-white px-4 py-2 rounded-lg ml-3 hover:bg-purple-800"
                    onClick={handlePostAnnouncement}>
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
                  value={newTest}
                  onChange={handleAssignmentChange}
                  onKeyDown={handleKeyPress}
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                />
                {newTest.trim() !== "" && (
                  <button
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg ml-3 hover:bg-blue-800"
                    onClick={()=>{handleCreateTest()}}>
                    Create
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
             Test
            </button>
          </div>
        )}
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
        <div className="bg-white w-full max-w-4xl mt-4 p-4 rounded-lg shadow-md border border-blue-400">
          <div className="bg-blue-700 text-white px-4 py-2 rounded-t-lg font-bold">
            Tests
          </div>
          {tests.length > 0 ? (
            tests.map((assignment, index) => (
            
              <div key={index} className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex justify-between items-center">
                <p className="text-gray-800">{assignment.title}</p>
                <span className="text-gray-500 text-sm">{assignment.startTime}</span>
                <button onClick={()=>{handleCreateTest(assignment.title)}}  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Update
                </button>
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-500">No tests conducted</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;


