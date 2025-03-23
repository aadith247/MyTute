import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../api/config';

export const CourseCard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = role === 'teacher' ? api.getTeacherTests : api.getEnrolledCourses;
      
      const response = await axios.get(endpoint, {
        headers: { Authorization: token }
      });
      
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    }
  };

  const handleCourseAction = (courseId) => {
    if (role === 'teacher') {
      navigate('/create-form', { state: { courseId } });
    } else {
      navigate(`/student-dashboard/${courseId}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {courses.map((course) => (
        <div key={course._id} className="bg-white shadow-lg border border-purple-400 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-4">
            <h3 className="text-white text-xl font-bold">{course.courseName}</h3>
            <p className="text-purple-100">{course.courseTitle}</p>
          </div>
          <div className="p-4">
            {role === 'teacher' ? (
              <>
                <p className="text-gray-600 mb-2">Course Code: {course.courseCode}</p>
                <p className="text-gray-600 mb-4">Students: {course.students.length}</p>
                <button
                  onClick={() => handleCourseAction(course._id)}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Create Test
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-2">Teacher: {course.teacherId.Fullname}</p>
                <button
                  onClick={() => handleCourseAction(course._id)}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  View Course
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCard;