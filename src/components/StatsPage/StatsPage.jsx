import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../StatsPage/StatsPage.css"
import request from "superagent";

function StatsPage() {
    // Get the state from the location (passed from the QuestionPage component)
    const { state: locationState } = useLocation();
    const navigate = useNavigate();

    console.log("🚀 ~ StatsPage ~ state :", locationState);

    // Retrieve accumulated user answers from the route
    const { userAnswers: accumulatedUserAnswers, questions } = locationState;
    console.log("questions:", questions);

    // Accumulate the user answers from previous rounds
    // const previousUserAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];
    // const userAnswers = [...previousUserAnswers, ...accumulatedUserAnswers];

    const totalQuestions = questions.length;

    // Identify incorrectly answered questions
    const incorrectlyAnswered = accumulatedUserAnswers.filter(answer => !answer.isCorrect);
    const correctlyAnswered = accumulatedUserAnswers.filter(answer => answer.isCorrect);
    console.log(correctlyAnswered);

    // Function to get correct answer for a given question index
    const getCorrectAnswer = (questionIndex) => {
        return incorrectlyAnswered[questionIndex].correctAnswer;
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

    const [gifUrl, setGifUrl] = useState("");

    const gifSearchAnswer = (answers) => {
        for (let i = 0; i < answers.length; i++) {
            const currentAnswer = answers[i];

            if (typeof currentAnswer === 'string') {
                // The current answer is a string
                console.log('String:', currentAnswer);
                // Add your logic for handling a string answer here
                break; // Exit the loop since we found a string answer
            } else {
                // The current answer is not a string (could be a number, boolean, etc.)
                console.log('Not a string:', currentAnswer);
                // Add your logic for handling a non-string answer here
            }
        }
    };

    useEffect(() => {
        // Fetch the Giphy API when the component mounts
        fetchGiphy(questions[0].correct_answer);

    }, []);

    // GET Giphy API
    const fetchGiphy = async (q) => {
        try {
            // Constructing the API URL based on selected amount and difficulty
            const apiUrl2 = `//api.giphy.com/v1/gifs/search?api_key=${import.meta.env.VITE_API_KEY}&q=${q}&limit=1&offset=0&rating=pg&lang=en&bundle=messaging_non_clips`;

            const response = await request
                .get(apiUrl2)
                .set('authorization', import.meta.env.VITE_API_KEY);
            const data = response.body.data[0].images.fixed_height.url;
            console.log("Giphy results:", data);

            // Set the Giphy URL to the state
            setGifUrl(data);
        } catch (error) {

            // Handling errors during the quiz start process`
            console.error("Error generating gif:", error);
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
            <img src={gifUrl} alt="Giphy" />
            <h1 className="header-message">{getHeaderMessage(percentage)}</h1>
            <div className="correct-answers-div">
                {/* Display stats for correctly answered questions */}
                <h2 className="correct-answers">{correctlyAnswered.length + '/' + questions.length + ' correct '} <br /> <br />{formattedPercentage + '%'}</h2>
            </div>
            <div className="stats-div">
                {/* Display details for incorrectly answered questions */}
                {incorrectlyAnswered.length > 0 && (
                    <>
                        <h3 className="stats-h3">Review and Learn:</h3>
                        {incorrectlyAnswered.map((answer, index) => (
                            <div className="corrections" key={index}>
                                <p dangerouslySetInnerHTML={renderHTML(`Question: ${answer.question}`)}></p>
                                <p dangerouslySetInnerHTML={renderHTML(`Your Answer: ${answer.answer}`)}
                                    className="your-answer-p"></p>
                                <p dangerouslySetInnerHTML={renderHTML(`Correct Answer: ${getCorrectAnswer(index)}`)}
                                    className="correct-answer-p"></p>
                            </div>
                        ))}
                    </>
                )}

            </div>
            <NavLink to="/">
                <button className="btn btn-light play-again">Play Again</button>
            </NavLink>
        </>
    );
}

export default StatsPage;