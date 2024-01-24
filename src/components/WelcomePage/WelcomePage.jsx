import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import request from "superagent"
import "../WelcomePage/WelcomePage.css"

function WelcomePage() {
  const navigate = useNavigate();

  // State for the number of questions and difficulty level
  const [amount, setAmount] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState(null); // New state to store API response
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeDifficulty, setActiveDifficulty] = useState(null);

  // Function triggered when "Start Quiz" button is clicked
  const startQuiz = async () => {
    try {
      // Constructing the API URL based on selected amount and difficulty
      const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=12&difficulty=${difficulty}`;
      const response = await request.get(apiUrl);
      const data = response.body.results;

      // Save API response in state
      setQuestions(data);

      // Navigate to the QuestionPage and pass state
      navigate('/questions', { state: { amount, difficulty, questions: data } });

      // Logging information to the console
      console.log("Starting quiz with amount:", amount, "and difficulty:", difficulty);
      console.log("API URL:", apiUrl);
    } catch (error) {

      // Handling errors during the quiz start process`
      console.error("Error starting quiz:", error);
    }
  };

  // Function triggered when a question button is clicked
  const handleQuestionButtonClick = (value) => {
    setActiveQuestion(value);
    setAmount(value);
  };

  // Function triggered when a difficulty button is clicked
  const handleDifficultyButtonClick = (value) => {
    setActiveDifficulty(value);
    setDifficulty(value);
  };

  return (
    <>
      <div className="container">
        <img className="logo" src="https://i.imgur.com/9pRqzsF.png" alt="MusIQ logo" />
        <div className="container1">
          <h2 className="header">Number of Questions</h2>
          <ul className="questions">
            <button
              className={`btn btn-q ${activeQuestion === 5 ? "active" : ""}`}
              onClick={() => {
                setAmount(5);
                handleQuestionButtonClick(5);
              }}
            >5</button>
            <button
              className={`btn btn-q ${activeQuestion === 10 ? "active" : ""}`}
              onClick={() => {
                setAmount(10);
                handleQuestionButtonClick(10);
              }}
            >10</button>
            <button
              className={`btn btn-q ${activeQuestion === 15 ? "active" : ""}`}
              onClick={() => {
                setAmount(15);
                handleQuestionButtonClick(15);
              }}
            >15</button>
          </ul>
        </div>
        <div className="container2">
          <h2 className="header">Difficulty</h2>
          <ul className="difficulty">
            <button
              className={`btn btn-d ${activeDifficulty === "easy" ? "active" : ""}`}
              onClick={() => {
                setDifficulty("easy");
                handleDifficultyButtonClick("easy");
              }}
            >
              Easy
            </button>
            <button
              className={`btn btn-d ${activeDifficulty === "medium" ? "active" : ""}`}
              onClick={() => {
                setDifficulty("medium");
                handleDifficultyButtonClick("medium");
              }}
            >
              Medium
            </button>
            <button
              className={`btn btn-d ${activeDifficulty === "hard" ? "active" : ""}`}
              onClick={() => {
                setDifficulty("hard");
                handleDifficultyButtonClick("hard");
              }}
            >
              Hard
            </button>
          </ul>
        </div>

        <NavLink to="/questions" state={{ amount, difficulty }}>
          <button className="btn btn-s" onClick={startQuiz}>
            Start Quiz
          </button>
        </NavLink>
      </div>
    </>
  )
}

export default WelcomePage;
