import React from "react";
import { Link } from "react-router-dom";

const Notfound = () => (
    <div
        style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #000 60%, #0074D9 100%)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
            textAlign: "center",
        }}
    >
        <div
            style={{
                fontSize: "10rem",
                fontWeight: "bold",
                letterSpacing: "0.1em",
                color: "#fff",
                textShadow: "0 0 40px #0074D9, 0 2px 0 #000",
                marginBottom: "1rem",
            }}
        >
            404
        </div>
        <h1
            style={{
                fontSize: "2.5rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "#0074D9",
                textShadow: "0 2px 0 #000",
            }}
        >
            Page Not Found
        </h1>
        <p
            style={{
                fontSize: "1.2rem",
                color: "#fff",
                opacity: 0.85,
                marginBottom: "2rem",
            }}
        >
            Provided link is not valid please check the URL
        </p>
        <Link
        to={"/"}
            style={{
                padding: "0.75rem 2rem",
                background: "#0074D9",
                color: "#fff",
                borderRadius: "30px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                transition: "background 0.2s",
            }}
            onMouseOver={e => (e.target.style.background = "#005fa3")}
            onMouseOut={e => (e.target.style.background = "#0074D9")}
        >
            Go Home
        </Link>
        <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            style={{
                position: "absolute",
                bottom: "40px",
                right: "40px",
                opacity: 0.15,
            }}
        >
            <circle cx="60" cy="60" r="55" stroke="#0074D9" strokeWidth="8" fill="none" />
            <rect x="35" y="35" width="50" height="50" rx="12" fill="#fff" stroke="#0074D9" strokeWidth="4" />
        </svg>
    </div>
);

export default Notfound;