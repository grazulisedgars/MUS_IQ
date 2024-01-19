import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import request from "superagent"



function WelcomePage() {
  const navigate = useNavigate();

  // State for the number of questions and difficulty level
  const [amount, setAmount] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState(null); // New state to store API response

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

  return (
    <>
      <h1>MUS I.Q.</h1>
      <div>
        <h2>Number of Questions:</h2>
        <ul>
          <button onClick={() => setAmount(5)}>5</button>
          <button onClick={() => setAmount(10)}>10</button>
          <button onClick={() => setAmount(15)}>15</button>
        </ul>
      </div>
      <div>
        <h2>Difficulty:</h2>
        <ul>
          <button onClick={() => setDifficulty("easy")}>Easy</button>
          <button onClick={() => setDifficulty("medium")}>Medium</button>
          <button onClick={() => setDifficulty("hard")}>Hard</button>
        </ul>
      </div>

      <NavLink to={{ pathname: "/questions", state: { amount, difficulty } }}>
        <button onClick={startQuiz}>Start Quiz</button>
      </NavLink>
    </>
  )
}

export default WelcomePage;
