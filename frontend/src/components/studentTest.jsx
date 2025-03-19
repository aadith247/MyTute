import React, { useState } from "react";

const StudentTest = () => {
  const [answers, setAnswers] = useState({});
  const [test] = useState({
    title: "Sample Test",
    description: "Please answer all the questions to the best of your ability.",
    questions: [
      {
        text: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"]
      },
      {
        text: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"]
      },
      {
        text: "What is 2 + 2?",
        options: ["3", "4", "5", "6"]
      }
    ]
  });

  const handleOptionChange = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  const handleSubmit = () => {
    console.log("Student Answers:", answers);
    alert("Test submitted successfully!");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-purple-700 text-3xl font-bold mb-4 text-center">
          {test.title}
        </h2>
        <p className="text-gray-700 text-center mb-6">{test.description}</p>
        <hr className="border-purple-500 mb-4" />

        {/* All Questions Displayed */}
        {test.questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-purple-100 p-6 rounded-lg mb-4 border border-purple-400">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Question {qIndex + 1}: {q.text}</h3>
            {q.options.map((option, oIndex) => (
              <label key={oIndex} className="block bg-white p-3 rounded-lg border border-gray-300 mb-2 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  value={option}
                  checked={answers[qIndex] === option}
                  onChange={() => handleOptionChange(qIndex, option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 mt-4"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
};

export default StudentTest;
