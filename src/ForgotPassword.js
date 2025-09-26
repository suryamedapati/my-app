import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotResetPassword() {
  const [userName, setUserName] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState("forgot");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Step 1: Forgot Password (send OTP)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/api/employees/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName }),
        }
      );

      const data = await response.text(); // ✅ backend returns string
      if (response.ok) {
        setMessage(data || "OTP sent successfully.");
        setStep("reset");
      } else {
        setMessage(data || "Failed to send OTP.");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/api/employees/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp, newPassword, confirmNewPassword }),
        }
      );

      const data = await response.text(); // ✅ backend returns string
      if (response.ok) {
        setMessage(data || "Password reset successfully!");
        setStep("success");
      } else {
        setMessage(data || "Failed to reset password.");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-900">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        {step === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-blue-600">
              Forgot Password
            </h2>

            <div>
              <label className="block text-gray-700 mb-1">User Name:</label>
              <input
                type="text"
                value={userName}
                placeholder="Enter User Name"
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Send OTP
            </button>

            {message && <p className="text-red-500 text-center">{message}</p>}

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
            >
              Return to Login
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-blue-600">
              Reset Password
            </h2>
            <p className="text-blue-500 text-center text-sm">
              Check your email and enter the OTP below:
            </p>

            <div>
              <label className="block text-gray-700 mb-1">OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Confirm New Password:
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Reset Password
            </button>

            {message && <p className="text-red-500 text-center">{message}</p>}

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
            >
              Return to Login
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-semibold">{message}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
