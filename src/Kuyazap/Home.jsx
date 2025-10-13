import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>🎯 Guessing Game</h1>
            <p>Select a difficulty level:</p>
            <Link to="/hard">
                <button style={{ padding: "10px 20px", fontSize: "16px" }}>
                    Hard Level
                </button>
            </Link>
        </div>
    );
}
