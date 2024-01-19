import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate} from "react-router-dom";
import request from "superagent";

function QuestionPage() {
    // Get the state from the location (passed from the WelcomePage component)
    const { state: locationState } = useLocation();
    const navigate = useNavigate(); 

    // console.log("🚀 ~ QuestionPage ~ state :", locationState);

    // Set default state values if no state is received
    const defaultState = { amount: 10, difficulty: 'medium' };
    const { amount, difficulty, questions: initialQuestions } = locationState || defaultState;

    // State for holding questions, current question, shuffled answers, and question index
    const [state, setState] = useState({
        questions: initialQuestions || [],
        currentQuestion: null,
        shuffledAnswers: [],
        questionIndex: 0,
        userAnswers: [],
    });

    // Function to shuffle answers for a question
    const shuffleAnswers = (correctAnswer, incorrectAnswers) => {
        const allAnswers = [...incorrectAnswers, correctAnswer];
        return allAnswers.sort(() => Math.random() - 0.5);
    };

    // Function to handle logic when a user clicks on an answer
    const handleAnswerClick = (selectedAnswer) => {
        console.log("Selected answer:", selectedAnswer);
        setState((prev) => ({
            ...prev,
            userAnswers: [...prev.userAnswers, { question: state.currentQuestion.question, answer: selectedAnswer }],
        }));
        // Handle selected answer logic here...
    };

    // Function to move to the next question
    const handleNextQuestion = () => {
        const nextIndex = state.questionIndex + 1;
        if (nextIndex < state.questions.length) {
            setState((prev) => ({
                ...prev,
                currentQuestion: state.questions[nextIndex],
                shuffledAnswers: shuffleAnswers(
                    state.questions[nextIndex].correct_answer,
                    state.questions[nextIndex].incorrect_answers
                ),
                questionIndex: nextIndex,
            }));
            console.log("User Answers:", state.userAnswers);
        } else {
            console.log("Redirect to results page");
            // Redirect to stats page using navigate
            navigate("/stats");
            // Implement logic for redirecting to the results page
            // Move to stats page
        }
    };

    // UseEffect hook to fetch questions from the Open Trivia API
    useEffect(() => {
        const fetchData = async () => {
            try {
                let data;
                if (initialQuestions) {
                    // If questions are passed from the WelcomePage, use them directly
                    data = initialQuestions;
                } else {
                    // Otherwise, fetch questions from the API
                    const response = await request
                        .get("https://opentdb.com/api.php")
                        .query({ amount, category: 12, difficulty });
                    data = response.body.results;
                }

                // Set questions, current question, and shuffled answers based on API response or initialQuestions
                setState((prev) => ({
                    ...prev,
                    questions: data,
                    currentQuestion: data[0],
                    shuffledAnswers: shuffleAnswers(
                        data[0].correct_answer,
                        data[0].incorrect_answers
                    ),
                }));
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchData();
    }, [amount, difficulty, initialQuestions]);

    // If no current question is available (during loading), display a loading message 
    if (!state.questions.length) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div>
                <h3>Question:</h3>
                <p>{state.currentQuestion.question}</p>
            </div>
            <div>
                {state.shuffledAnswers.map((answer, index) => (
                    <button key={index} onClick={() => handleAnswerClick(answer)}>
                        {answer}
                    </button>
                ))}
            </div>
            <button onClick={handleNextQuestion}>Next Question</button>
            {/* <NavLink to="/stats">
                <button>Results</button>
            </NavLink> */}
            <p>{state.questionIndex + 1} of {state.questions.length}</p>
        </>
    );
}

export default QuestionPage;
