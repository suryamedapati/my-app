import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ViewMyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  // ✅ Verify token & fetch username
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // redirect if not logged in
      return;
    }

    try {
      const decoded = jwtDecode(token);
      // Adjust based on your JWT payload
      const uname = decoded.employeeUserName || decoded.sub || decoded.username;
      setUsername(uname);

      fetchLeaves(uname, token);
    } catch (err) {
      console.error("Invalid token", err);
      navigate("/"); // force re-login
    }
  }, [navigate]);

  // Fetch leave requests for this user
  const fetchLeaves = async (uname, token) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:8080/api/leaves/user/${uname}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setLeaves(data.data);
      } else {
        setError(data.message || "Failed to fetch leave requests");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading your leave requests...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-3">My Leave Requests</h3>

      {leaves.length === 0 ? (
        <p>You have not applied for any leaves yet.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Leave ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.leaveId}>
                <td>{leave.leaveId}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
