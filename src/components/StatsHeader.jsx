import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const StatsHeader = ({ totalQuestions, correctAnswers }) => {

    // Function to calculate user's percentage correct
    const calculatePercentage = (correct, total) => {
        return ((correct / total) * 100).toFixed(2);
      };

    // Function to display Congrats or Aww Man based on quiz percentage
  const getHeaderMessage = (percentage) => {
    if (percentage >= 80) {
      return "Congratulations! You're a Quiz Master!";
    } else if (percentage >= 50) {
      return 'Great job! All the greats started somewhere...';
    } else {
      return "Keep practicing! There's a lot to learn about music.";
    }
  };

  const percentage = calculatePercentage(correctAnswers, totalQuestions);

  return (
    <div>
      <h1>{getHeaderMessage(percentage)}</h1>
      <h2>correct/total</h2>
      <h3>That's Percentage !</h3>
    </div>
  );
};

export default StatsHeader;
