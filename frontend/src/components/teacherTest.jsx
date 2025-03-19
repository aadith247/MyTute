import React, { useState } from "react";

const CreateForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correct: "" }
  ]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleNumQuestionsChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumQuestions(count);
    setQuestions(
      Array.from({ length: count }, (_, i) =>
        questions[i] || { text: "", options: ["", "", "", ""], correct: "" }
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
    updatedQuestions[qIndex].correct = value;
    setQuestions(updatedQuestions);
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
          placeholder="Form Title"
          value={title}
          onChange={handleTitleChange}
          className="w-full p-2 mb-3 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Form Description"
          value={description}
          onChange={handleDescriptionChange}
          className="w-full p-2 mb-3 border border-gray-300 rounded"
        />
        <label className="text-purple-700 font-semibold">Number of Questions:</label>
        <input
          type="number"
          min="1"
          value={numQuestions}
          onChange={handleNumQuestionsChange}
          className="w-full p-2 mb-3 border border-gray-300 rounded"
        />

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
              value={q.correct}
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

        <button className="w-full bg-purple-700 text-white p-3 rounded hover:bg-purple-800">
          Submit Form
        </button>
      </div>
    </div>
  );
};

export default CreateForm;
