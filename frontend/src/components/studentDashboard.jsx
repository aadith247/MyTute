import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api,API_BASE_URL } from "../api/config";

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
  const [announcements, setAnnouncements] = useState([]);
  const [tests, setTests] = useState([]);
  const {courseId}=useParams();
  useEffect(() => {
    fetchTests();
  }, []);


  const fetchTests = async () => {


    try {
      const response = await axios.get( `${API_BASE_URL}/student/course/${courseId}/tests`,{
        headers:{
          Authorization:localStorage.getItem("token")
        }
      });


      if(response)
      {
        setTests(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch tests");
    }
  };
 
  const generateReport = async (test) => {
    try {
      const testId = test._id;
      // toast.loading("Generating report...");
      // Navigate to the TestReport component
      
      navigate(`/test-report/${courseId}/${testId}`);
    } catch (error) {
      toast.error("Failed to generate report");
      console.error("Report generation error:", error);
    }
  };

  const handleTakeTest = (test) => {
    if(new Date(test.startTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) <= new Date().toLocaleString("en-IN",{timeZone:"Asia/Kolkata"} && new Date().toLocaleString("en-IN",{timeZone:"Asia/Kolkata"}) <=new Date(test.startTime ).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})+test.duration))
    {
      navigate(`/student-test/${courseId}/${test._id}`);
    }
    
    else {
   
      toast.error("Please start the test at "+new Date(test.startTime).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"}));
    }
    
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="flex gap-4">
        <LiveCalendar />

        

        <div className="w-[84%] space-y-4 flex flex-col">

        <div className="bg-purple-700 text-white p-8 rounded-lg shadow-md  max-w-8xl flex justify-between items-center ml-2 py-10">
          
          <div>
            <h1 className="text-5xl pl-4  font-bold">DSA</h1>
            <p className="text-xl pl-4 mt-2">Data structures and algorithms</p> 
          </div>
          <div>
          <p className="text-xl">Faculty name</p> 
          </div>
      
     
        </div>
        


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
                 
                    <p className="text-gray-500 text-sm">Start Time: {new Date(test.startTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
                  </div>
                  {!test.submitted ? (
                    <button
                      onClick={() => handleTakeTest(test)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Take Test
                    </button>
                  ) : (


                    <div>
                    <div className="text-green-600 mb-2 font-semibold">
                      Completed - Score: {test.score}/{test.questions.length}
        
                    </div>
                    <button onClick={()=>{generateReport(test)}}  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Generate a report</button>
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




