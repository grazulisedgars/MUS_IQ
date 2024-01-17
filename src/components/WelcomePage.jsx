import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { getTriviaQuestions } from "../utils/API";


function WelcomePage() {
const [amount, setAmount] = useState(10);
const [difficulty, setDifficulty] = useState('medium');

const startQuiz = async () => {
  try {
    const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=12&difficulty=${difficulty}`;
    const questions = await getTriviaQuestions(amount, difficulty);
    console.log("Fetched questions", questions, apiUrl);
  } catch (error) {
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

      <NavLink to="/questions">
        <button onClick={startQuiz}>Start Quiz</button>
      </NavLink>
    </>
  )
}

export default WelcomePage;
