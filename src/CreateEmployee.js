import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function CreateEmployee() {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [createdUser, setCreatedUser] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.userName.trim()) newErrors.userName = "Username is required";

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!formData.password || !passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase, one uppercase, and one number";
    }

    // First & Last name
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    // Email validation
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    // Role validation
    if (!["ADMIN", "USER"].includes(formData.role.toUpperCase())) {
      newErrors.role = "Role must be ADMIN or USER";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:8080/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Employee created successfully!");
        setCreatedUser(data.data);
        setShowForm(false);
      } else {
        setMessage(data.message || "Failed to create employee.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  const handleCreateAnother = () => {
    setFormData({
      userName: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: ""
    });
    setErrors({});
    setCreatedUser(null);
    setMessage("");
    setShowForm(true);
  };

  const handleGoToHome = () => {
    navigate("/home");
  };

  return (
    <div className="card shadow-sm p-4 bg-white mx-auto" style={{ maxWidth: "80%" }}>
      <h3 className="text-center text-primary mb-4">Register Employee</h3>

      {showForm ? (
        <form onSubmit={handleCreate}>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className={`form-control ${errors.userName ? "is-invalid" : ""}`}
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
            />
            {errors.userName && <div className="invalid-feedback">{errors.userName}</div>}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          {/* First Name */}
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
          
          {/* Role */}
          </div>
            <div className="mb-3">
            <label className="form-label">Role</label>
            <select
                className={`form-select ${errors.role ? "is-invalid" : ""}`}
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
            >
                <option value="">-- Select Role --</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
            </select>
            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100">Create Employee</button>
        </form>
      ) : (
        <div className="text-center">
          <div className="alert alert-success">{message}</div>

          {createdUser && (
            <div className="text-start mt-3">
              <h5>Created Employee Details</h5>
              <p><b>Username:</b> {createdUser.userName}</p>
              <p><b>Name:</b> {createdUser.firstName} {createdUser.lastName}</p>
              <p><b>Email:</b> {createdUser.email}</p>
              <p><b>Phone:</b> {createdUser.phoneNumber}</p>
              <p><b>Role:</b> {createdUser.role}</p>
            </div>
          )}

          <div className="mt-4">
            <p>Do you want to create another employee?</p>
            <button className="btn btn-primary me-2" onClick={handleCreateAnother}>Yes</button>
            <button className="btn btn-secondary" onClick={handleGoToHome}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}
