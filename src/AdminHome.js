import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";

export default function AdminHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  console.log("Hello.....");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); 
      const userName = payload.sub; // subject = userName in backend

      fetch(`http://localhost:8080/api/employees/${userName}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok) {
            setUser(data.data);
          }
        })
        .catch(() => console.error("Error fetching user profile"));
    } catch (err) {
      console.error("Invalid token", err);
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    navigate("/"); // redirect back to login
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <h2>Employee Leave Management System</h2>
        <div className="user-info">
          <span>👤 {user?.firstName || "User"}</span>
          {/* <span>📑 Policy: {user?.policyNumber || "N/A"}</span> */}
        </div>
      </header>

      {/* Main layout */}
      <div className="main">
        {/* Sidebar Navigation */}
        <div className="sidebar">
          <Link to="welcome">
            <button>Profile</button>
          </Link>
          <Link to="create">
            <button>Register Employee</button>
          </Link>
          <Link to="applyLeave">
            <button>Apply Leave</button>
          </Link>
          <Link to="update">
            <button>Update Details</button>
          </Link>
          <Link to="manageLeaves">
            <button>Manage Leaves</button>
          </Link>
          <Link to="viewEmployeeLeaves">
            <button>View Leave Requests</button>
          </Link>
          <Link to="viewMyLeaves">
            <button>View my Leaves</button>
          </Link>
          <Link to="delete">
            <button>Remove Employee</button>
          </Link>
          <Link to="changePassword">
            <button>Change Password</button>
          </Link>
          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="content">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} Employee Leave Management System. All Rights Reserved.
      </footer>
    </div>
  );
}