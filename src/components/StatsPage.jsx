import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import StatsHeader from "./StatsHeader";

function StatsPage() {
    // Get the state from the location (passed from the QuestionPage component)
    const { state: locationState } = useLocation();
    const navigate = useNavigate();

    console.log("🚀 ~ StatsPage ~ state :", locationState);

    // Retrieve accumulated user answers from the route
    const { userAnswers: accumulatedUserAnswers, questions } = locationState;

    // Accumulate the user answers from previous rounds
    const previousUserAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];
    const allUserAnswers = [...previousUserAnswers, ...accumulatedUserAnswers];

    const totalQuestions = questions.length;

    // Identify incorrectly answered questions
    const incorrectlyAnswered = accumulatedUserAnswers.filter(answer => !answer.isCorrect);
    const correctlyAnswered = accumulatedUserAnswers.filter(answer => answer.isCorrect);
    console.log(correctlyAnswered);

    // Function to get correct answer for a given question index
    const getCorrectAnswer = (questionIndex) => {
        return questions[questionIndex].correct_answer;
    };


    // Function to calculate user's percentage correct
    const calculatePercentage = (correct, total) => {
        return ((correct / total) * 100).toFixed(2);
    };

    // Function to display header based on quiz percentage
    const getHeaderMessage = (percentage) => {
        if (percentage >= 80) {
            return "Congratulations! You know some stuff!";
        } else if (percentage >= 50) {
            return 'Great job! Your glass is at least half full...';
        } else {
            return "Keep practicing! All the greats started somewhere...";
        }
    };

    const percentage = calculatePercentage(correctlyAnswered.length, totalQuestions);
    console.log(percentage);

    // Calculate formatted percentage with two decimal places
    const formattedPercentage = parseFloat(percentage).toFixed(0);

    // Helper function to handle HTML entities
    const renderHTML = (html) => {
        return { __html: html };
    };

    return (
        <>
            <h1>{getHeaderMessage(percentage)}</h1>
            <div>
                {/* Display stats for correctly answered questions */}
                <h2>{correctlyAnswered.length}/{questions.length} correct     {formattedPercentage}%</h2>
                <p>Your best score: {((correctlyAnswered.length / questions.length) * 100).toFixed(2)}%</p>

                {/* Display details for incorrectly answered questions */}
                {incorrectlyAnswered.length > 0 && (
                    <>
                        <h3>Review and Learn:</h3>
                        <ul>
                            {incorrectlyAnswered.map((answer, index) => (
                                <li key={index}>
                                    <p dangerouslySetInnerHTML={renderHTML(`Question: ${answer.question}`)}></p>
                                    <p dangerouslySetInnerHTML={renderHTML(`Your Answer: ${answer.answer}`)}></p>
                                    <p dangerouslySetInnerHTML={renderHTML(`Correct Answer: ${getCorrectAnswer(index)}`)}></p>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

            </div>
            <button>Clear Stats</button>
            <NavLink to="/">
                <button>Play Again</button>
            </NavLink>
        </>
    );
}

export default StatsPage;