import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CCardText, CCardTitle } from '@coreui/react';

export const CourseCard = () => {
  // State for course details (Array of Objects)
  const [courses, setCourses] = useState([
    { id: 1, name: "React Basics", description: "Learn the fundamentals of React." },
    { id: 2, name: "Advanced JavaScript", description: "Deep dive into JS concepts." },
  ]);

  return (
    <div className="flex flex-wrap gap-4">
      {courses.map((course) => (
        <CCard key={course.id} className="w-72 shadow-lg border border-purple-400 rounded-lg overflow-hidden">
          {/* Header with Purple Gradient */}
          <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-4">
            <CCardTitle className="text-white text-lg font-bold">{course.name}</CCardTitle>
          </div>

          {/* Body Content */}
          <CCardBody className="bg-purple-100 p-4">
            <CCardText className="text-black">{course.description}</CCardText>
            <CButton
              color="primary"
              className="bg-purple-700 hover:bg-purple-900 text-white w-full mt-4"
            >
              Go Somewhere
            </CButton>
          </CCardBody>
        </CCard>
      ))}
    </div>
  );
};
