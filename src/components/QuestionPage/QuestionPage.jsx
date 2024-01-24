import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import request from "superagent";
import { useSpring, animated } from "react-spring";
import "../QuestionPage/QuestionPage.css"


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
        answerClicked: false,
    });


    // State for holding the animation trigger
    const [animateCorrectAnswer, setAnimateCorrectAnswer] = useState(false);

    // Function to shuffle answers for a question
    const shuffleAnswers = (correctAnswer, incorrectAnswers) => {
        const allAnswers = [...incorrectAnswers, correctAnswer];
        return allAnswers.sort(() => Math.random() - 0.5);
    };

    // Function to handle logic when a user clicks on an answer
    const handleAnswerClick = (selectedAnswer) => {
        console.log("Handle answer click:", selectedAnswer);
        const isCorrect = selectedAnswer === state.currentQuestion.correct_answer;

        console.log("Selected answer:", selectedAnswer);

        if (isCorrect) {
            console.log("Is correct", isCorrect)
            setAnimateCorrectAnswer(true);
        } else {
            console.log("Is incorrect")
            setAnimateCorrectAnswer(false);
            console.log("Correct answer:", state.currentQuestion.correct_answer);
        }

        setState((prev) => ({
            ...prev,
            userAnswers: [...prev.userAnswers,
            {
                question: state.currentQuestion.question,
                answer: selectedAnswer,
                isCorrect,
                answerClicked: true,
                correctAnswer: state.currentQuestion.correct_answer,
                isCorrectIndex: state.shuffledAnswers.indexOf(state.currentQuestion.correct_answer),
            }],
        }));
        // Handle selected answer logic here...
    };

    // Function to move to the next question
    const handleNextQuestion = () => {
        const nextIndex = state.questionIndex + 1;
        const accumulatedUserAnswers = [...state.userAnswers];
        if (nextIndex < state.questions.length) {
            setState((prev) => ({
                ...prev,
                currentQuestion: state.questions[nextIndex],
                shuffledAnswers: shuffleAnswers(
                    state.questions[nextIndex].correct_answer,
                    state.questions[nextIndex].incorrect_answers
                ),
                questionIndex: nextIndex,
                answerClicked: false,
            }));
            console.log("User Answers:", state.userAnswers);
        } else {
            // // Pass accumulated user answers and questions to the next route
            navigate("/stats", {
                state: {
                    userAnswers: accumulatedUserAnswers,
                    questions: state.questions, // Include questions in the route state
                },
            });
        }
    };

    // UseEffect hook to fetch questions from the Open Trivia API
    useEffect(() => {
        console.log("State in useEffect:", state);
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

                // Use dangerouslySetInnerHTML to render HTML entities
                const decodedData = data.map((question) => ({
                    ...question,
                    question: question.question,
                    incorrect_answers: question.incorrect_answers.map((answer) => answer),
                    correct_answer: question.correct_answer,
                }));


                // Set questions, current question, and shuffled answers based on API response or initialQuestions
                setState((prev) => ({
                    ...prev,
                    questions: decodedData,
                    currentQuestion: decodedData[0],
                    shuffledAnswers: shuffleAnswers(
                        decodedData[0].correct_answer,
                        decodedData[0].incorrect_answers
                    ),
                }));
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchData();
    }, [amount, difficulty, initialQuestions]);

    useEffect(() => {
        console.log("animateCorrectAnswer:", animateCorrectAnswer);
        // Trigger the animation when the answerClicked state changes
        if (state.answerClicked && state.userAnswers.length > state.questionIndex) {
            setAnimateCorrectAnswer(true);

            // Reset the animation trigger after a short delay
            const timeoutId = setTimeout(() => {
                setAnimateCorrectAnswer(false);
            }, 1000); // Adjust the delay as needed
            return () => clearTimeout(timeoutId);
        }
    }, [animateCorrectAnswer, state.answerClicked, state.questionIndex, state.userAnswers]);

    const correctAnswerAnimation = useSpring({
        boxShadow: animateCorrectAnswer
            ? state.shuffledAnswers[state.userAnswers[state.questionIndex]?.isCorrectIndex] === state.currentQuestion.correct_answer
                ? '0px 0px 20px 10px rgba(0, 255, 0, 0.8)' // Correct answer, green glow
                : '0px 0px 20px 10px rgba(255, 0, 0, 0.8)' // Incorrect answer, red glow (you can customize this)
            : '0px 0px 0px 0px rgba(0, 0, 0, 0)', // Initial state
        config: { mass: 1, tension: 170, friction: 26, precision: 0.01 }
    });

    // If no current question is available (during loading), display a loading message 
    if (!state.questions.length) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className="question-container">
                <h3 dangerouslySetInnerHTML={{ __html: state.currentQuestion.question }}></h3>
            </div>
            <div className="answer-container">
                {state.shuffledAnswers.map((answer, index) => (
                    <animated.button
                        key={index}
                        onClick={() => handleAnswerClick(answer, index)}
                        dangerouslySetInnerHTML={{ __html: answer }}
                        className={`btn ${state.userAnswers.length > state.questionIndex
                            ? answer === state.userAnswers[state.questionIndex].answer
                                ? state.userAnswers[state.questionIndex].isCorrect
                                    ? 'btn-success'
                                    : 'btn-danger'
                                : 'btn-light'
                            : 'btn-light'
                            }`}
                        disabled={
                            state.answerClicked ||
                            state.userAnswers.length > state.questionIndex
                        }
                        style={index === state.userAnswers[state.questionIndex]?.isCorrectIndex ? correctAnswerAnimation : {}}
                    ></animated.button>
                ))}
            </div>
            <div className="next-question">
                <button className="btn btn-light" onClick={handleNextQuestion}>
                    {state.questionIndex + 1 < state.questions.length ? "Next Question" : "Submit"}
                </button>
            </div>
            <p className="question-counter">{state.questionIndex + 1} of {state.questions.length}</p>
        </>
    );
}

export default QuestionPage;