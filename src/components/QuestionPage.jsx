import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
        answerClicked: false,
    });

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
        } else {
            console.log("Is incorrect")
        }

        setState((prev) => ({
            ...prev,
            userAnswers: [...prev.userAnswers,
            {
                question: state.currentQuestion.question,
                answer: selectedAnswer,
                isCorrect,
                answerClicked: true,
            }],
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
                answerClicked: false,
            }));
            console.log("User Answers:", state.userAnswers);
        } else {
            // Redirect to stats page using navigate
            navigate("/stats", {state: { userAnswers: state.userAnswers, questions: state.questions }});
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

    // If no current question is available (during loading), display a loading message 
    if (!state.questions.length) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div>
                <h3>Question:</h3>
                {/* Presents question nicely without ugly representation of ' " */}
                <p dangerouslySetInnerHTML={{ __html: state.currentQuestion.question }}></p>
            </div>
            <div>
                {/* Presents answers nicely without ugly representation of ' " */}
                {state.shuffledAnswers.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerClick(answer)}
                        dangerouslySetInnerHTML={{ __html: answer }}
                        className={`btn ${state.userAnswers.length > state.questionIndex
                            ? answer === state.userAnswers[state.questionIndex].answer
                                ? state.userAnswers[state.questionIndex].isCorrect
                                    ? 'btn-success'
                                    : 'btn-danger'
                                : 'btn-light'
                            : 'btn-light'}`}
                        disabled={
                            state.answerClicked ||
                            state.userAnswers.length > state.questionIndex
                        }
                    ></button>
                ))}


            </div>
            <button onClick={handleNextQuestion}>
                {/* When last question is reached Next Question button becomes Submit button */}
                {state.questionIndex + 1 < state.questions.length ? "Next Question" : "Submit"}
            </button>
            <p>{state.questionIndex + 1} of {state.questions.length}</p>
        </>
    );
}

export default QuestionPage;