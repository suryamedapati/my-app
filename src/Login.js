import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/employees/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.data.token);
        setMessage("✅ Login successful!");
        navigate("/home/welcome");
      } else {
        setMessage(data.message || "❌ Login failed, please check your credentials.");
      }
    } catch (error) {
      setMessage("⚠️ Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1 className="brand">🌐 Employee Leave Management System</h1>
        <h3 className="title">Welcome Back</h3>

        <div className="form-group">
          <label>User Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn primary">
            🚀 Login
          </button>
          <button type="button" className="btn secondary" onClick={handleForgotPassword}>
            🔑 Forgot Password?
          </button>
        </div>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
