import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../api/config";

const StudentTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${api.getTest}/${testId}`,
          {
            headers: { Authorization: token }
          }
        );
        
        const testData = {
          ...response.data,
          startTime: new Date(response.data.startTime).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata'
          })
        };
        
        setTest(testData);
        setTimeLeft(testData.duration * 60); // Convert minutes to seconds
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to fetch test");
        navigate("/student-dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (qIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [qIndex]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const formattedAnswers = Object.entries(answers).map(([questionIndex, selectedAnswer]) => ({
        questionIndex: parseInt(questionIndex),
        selectedAnswer
      }));

      const response = await axios.post(
        `${api.submitTest}/${testId}/submit`,
        { answers: formattedAnswers },
        {
          headers: { Authorization: token }
        }
      );

      toast.success(`Test submitted! Score: ${response.data.score}/${response.data.totalQuestions}`);
      navigate("/student-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit test");
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading test...</div>;
  }

  if (!test) {
    return <div className="text-center p-8">Test not found</div>;
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-purple-700 text-3xl font-bold">
            {test.title}
          </h2>
          <div className="text-xl font-bold text-red-600">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>
        <p className="text-gray-700">{test.description}</p>
        <p className="text-sm text-gray-600 mb-6">
          Start Time (IST): {test.startTime}
        </p>
        <hr className="border-purple-500 mb-4" />

        {test.questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-purple-100 p-6 rounded-lg mb-4 border border-purple-400">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">
              Question {qIndex + 1}: {q.question}
            </h3>
            {Object.entries(q.options).map(([optionKey, optionValue]) => (
              <label key={optionKey} className="block bg-white p-3 rounded-lg border border-gray-300 mb-2 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  value={optionValue}
                  checked={answers[qIndex] === optionValue}
                  onChange={() => handleOptionChange(qIndex, optionValue)}
                  className="mr-2"
                />
                {optionValue}
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