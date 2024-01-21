import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage/WelcomePage';
import QuestionPage from './components/QuestionPage';
import StatsPage from './components/StatsPage';
import LyricsQuizComponent from './components/LyricsQuizComponent';

function App() {
  return (
    <>
      <Router>
        <LyricsQuizComponent/>
        <Routes>
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/questions" element={<QuestionPage/>} />
        <Route path="/stats" element={<StatsPage/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
