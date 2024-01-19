import React from "react";
import { NavLink } from "react-router-dom";




function StatsPage() {
    return (
        <>
            <h1>Congratulations!</h1>
            <div>
                <h2>4/5 correct     80%</h2>
                <p>Last time you scored 66%</p>
                <p>Your best score 80%</p>
                <p>So far you've answered 24 questions correctly!</p>
            </div>
            <NavLink to="/">
                <button>Play Again</button>
            </NavLink>
        </>
    )
}

export default StatsPage;