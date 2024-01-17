import React from "react";
import { NavLink } from "react-router-dom";


function WelcomePage() {
  return (
    <>
      <h1>MUS I.Q.</h1>
      <div>
        <h2>Number of Questions:</h2>
        <ul>
          <button>5</button>
          <button>10</button>
          <button>15</button>
        </ul>
      </div>
      <div>
        <h2>Difficulty:</h2>
        <ul>
          <button>Easy</button>
          <button>Medium</button>
          <button>Hard</button>
        </ul>
      </div>

      <NavLink to="/questions">
        <button>Start Quiz</button>
      </NavLink>
    </>
  )
}

export default WelcomePage;
