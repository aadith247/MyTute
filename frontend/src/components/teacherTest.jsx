import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../api/config";

const CreateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state?.courseId;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [startTime, setStartTime] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correctAnswer: "" }
  ]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleDurationChange = (e) => setDuration(parseInt(e.target.value));
  
  const handleStartTimeChange = (e) => {
    const localDate = new Date(e.target.value);
    // Add IST offset (+5:30)
    const istDate = new Date(localDate.getTime() + (5.5 * 60 * 60 * 1000));
    setStartTime(istDate.toISOString());
  };
  
  const handleNumQuestionsChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumQuestions(count);
    setQuestions(
      Array.from({ length: count }, (_, i) =>
        questions[i] || { text: "", options: ["", "", "", ""], correctAnswer: "" }
      )
    );
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctAnswer = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    try {
      if (!courseId) {
        toast.error("Course ID is missing");
        return;
      }

      const token = localStorage.getItem("token");
      const formattedQuestions = questions.map(q => ({
        question: q.text,
        options: {
          "1": q.options[0],
          "2": q.options[1],
          "3": q.options[2],
          "4": q.options[3]
        },
        correctAnswer: q.correctAnswer
      }));

      const response = await axios.post(
        api.createTest,
        {
          courseId,
          title,
          description,
          duration,
          startTime,
          questions: formattedQuestions
        },
        {
          headers: { Authorization: token }
        }
      );

      if (response.data.testId) {
        toast.success("Test created successfully!");
        navigate("/teacher-dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create test");
    }
  };

  const getLocalDateTime = () => {
    if (!startTime) return "";
    const istDate = new Date(startTime);
    const localDate = new Date(istDate.getTime() - (5.5 * 60 * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-purple-700 text-3xl font-bold mb-4 text-center">
          Create a New Test
        </h2>
        <hr className="border-purple-500 mb-4" />
        
        <input
          type="text"
          placeholder="Test Title"
          value={title}
          onChange={handleTitleChange}
          className="w-full p-2 mb-3 border border-gray-300 rounded"
        />
        
        <textarea
          placeholder="Test Description"
          value={description}
          onChange={handleDescriptionChange}
          className="w-full p-2 mb-3 border border-gray-300 rounded"
        />

        <div className="mb-3">
          <label className="block text-purple-700 font-semibold mb-1">Duration (minutes):</label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={handleDurationChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-purple-700 font-semibold mb-1">Start Time (IST):</label>
          <input
            type="datetime-local"
            value={getLocalDateTime()}
            onChange={handleStartTimeChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-sm text-gray-600 mt-1">
            * Time is in Indian Standard Time (IST)
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 font-semibold mb-1">Number of Questions:</label>
          <input
            type="number"
            min="1"
            value={numQuestions}
            onChange={handleNumQuestionsChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-purple-100 p-6 rounded-lg mb-4 border border-purple-400">
            <label className="block text-lg font-semibold text-purple-800 mb-2">
              Question {qIndex + 1}:
            </label>
            <input
              type="text"
              placeholder={`Enter question ${qIndex + 1}`}
              value={q.text}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full p-3 text-lg font-medium border border-gray-400 bg-white rounded mb-4 shadow-sm"
            />
            <div className="mb-2">
              <p className="text-purple-700 font-semibold mb-2">Options:</p>
              {q.options.map((opt, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  className="w-full p-2 mb-2 border border-gray-300 rounded bg-gray-50"
                />
              ))}
            </div>
            <label className="text-purple-700 font-semibold">Correct Answer:</label>
            <select
              value={q.correctAnswer}
              onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-gray-50"
            >
              <option value="">Select Correct Answer</option>
              {q.options.map((opt, oIndex) => (
                <option key={oIndex} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button 
          onClick={handleSubmit}
          className="w-full bg-purple-700 text-white p-3 rounded hover:bg-purple-800"
        >
          Create Test
        </button>
      </div>
    </div>
  );
};

export default CreateForm;