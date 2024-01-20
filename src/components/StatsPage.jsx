import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import StatsHeader from "./StatsHeader";




function StatsPage() {
    // Get the state from the location (passed from the QuestionPage component)
    const { state: locationState } = useLocation();
    const navigate = useNavigate(); 

    console.log("🚀 ~ StatsPage ~ state :", locationState);

    // Assumere totalQuestions and correctAnswers are obtained from the quiz
    const totalQuestions = state.questions.length;
    const correctAnswers = 5;
    return (
        <>
            <StatsHeader totalQuestions={totalQuestions} correctAnswers={correctAnswers}/>
            <div>
                <h2>4/5 correct     80%</h2>
                <p>Last time you scored 66%</p>
                <p>Your best score 80%</p>
                <p>So far you've answered 24 questions correctly!</p>
            </div>
            <button onClick={handleClearStats}>Clear Stats</button>
            <NavLink to="/">
                <button>Play Again</button>
            </NavLink>
        </>
    )
}

export default StatsPage;