import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";



export default function ApplyLeave() {
  const [formData, setFormData] = useState({
    employeeUserName: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(true);

  const navigate = useNavigate();

  // ✅ On component mount, decode token and set username
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // if no token, redirect to login
      return;
    }
    try {
      const decoded = jwtDecode(token);
      // adjust field based on your JWT payload
      const username = decoded.employeeUserName || decoded.sub || decoded.username;
      setFormData((prev) => ({ ...prev, employeeUserName: username }));
    } catch (err) {
      console.error("Invalid token", err);
      navigate("/"); // force re-login
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Start Date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!formData.startDate || !dateRegex.test(formData.startDate)) {
      newErrors.startDate = "Start date must be in yyyy-mm-dd format";
    }

    // End Date
    if (!formData.endDate || !dateRegex.test(formData.endDate)) {
      newErrors.endDate = "End date must be in yyyy-mm-dd format";
    }

    // Chronological order
    if (
      formData.startDate &&
      formData.endDate &&
      dateRegex.test(formData.startDate) &&
      dateRegex.test(formData.endDate)
    ) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    // Reason
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

    
  };
const leave = () => {
  console.log("in leave function")

}
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/leaves/apply", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // ✅ send token
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Leave applied successfully!");
        setShowForm(false);
      } else {
        setMessage(data.message || "Failed to apply leave.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  const handleApplyAnother = () => {
    setFormData((prev) => ({
      ...prev,
      startDate: "",
      endDate: "",
      reason: ""
    }));
    setErrors({});
    setMessage("");
    setShowForm(true);
  };

  const handleGoToHome = () => {
    const token = localStorage.getItem("token");
    let role = null;
  
              const decoded = jwtDecode(token);
              role =
                decoded.role || decoded.authorities?.[0] || decoded.userRole || null;
            
    
            // ✅ Route based on role
            if (role && role.toLowerCase() === "admin") {
              navigate("/home/welcome");
            } else {
              navigate("/userhome/welcome");
            }
  };

  return (
    <div className="card shadow-sm p-4 bg-white mx-auto" style={{ maxWidth: "80%" }}>
      <h3 className="text-center text-primary mb-4">Apply Leave</h3>

      {showForm ? (
        <form onSubmit={handleSubmit}>
          {/* Start Date */}
          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
          </div>

          {/* End Date */}
          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
            {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
          </div>

          {/* Reason */}
          <div className="mb-3">
            <label className="form-label">Reason</label>
            <textarea
              className={`form-control ${errors.reason ? "is-invalid" : ""}`}
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />
            {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
          </div>

          <button type="submit"  className="btn btn-primary w-100">Apply Leave</button>
        </form>
      ) : (
        <div className="text-center">
          <div className="alert alert-success">{message}</div>
          <div className="mt-4">
            <p>Do you want to apply another leave?</p>
            <button className="btn btn-primary me-2" onClick={handleApplyAnother}>Yes</button>
            <button className="btn btn-secondary" onClick={handleGoToHome}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}
