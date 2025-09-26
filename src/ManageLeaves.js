import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ManageLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminUserName, setAdminUserName] = useState("");

  const navigate = useNavigate();

  // ✅ On component mount: verify JWT and extract username
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // redirect if no token
      return;
    }
    try {
      const decoded = jwtDecode(token);
      // adjust field name depending on your JWT payload
      const username = decoded.employeeUserName || decoded.sub || decoded.username;
      setAdminUserName(username);
      fetchLeaves(token);
    } catch (err) {
      console.error("Invalid token", err);
      navigate("/"); // force re-login
    }
  }, [navigate]);

  // Fetch upcoming leaves
  const fetchLeaves = async (token = localStorage.getItem("token")) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/api/leaves/upcoming", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setLeaves(data.data);
      } else {
        setError(data.message || "Failed to fetch leaves");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Approve / Reject leave
  const decideLeave = async (leaveId, status) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/api/leaves/${leaveId}/decision?adminUserName=${adminUserName}&status=${status}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        // Update status locally
        setLeaves((prev) =>
          prev.map((leave) =>
            leave.leaveId === leaveId ? { ...leave, status: data.data.status } : leave
          )
        );
      } else {
        alert(data.message || "Failed to update leave status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating leave");
    }
  };

  if (loading) return <div>Loading leave requests...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Upcoming Leave Requests</h3>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => fetchLeaves()}
        >
          🔄 Refresh
        </button>
      </div>

      {leaves.length === 0 ? (
        <p>No upcoming leave requests.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Employee</th>
              <th>Leave ID</th>
              <th>Start</th>
              <th>End</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.leaveId}>
                <td>{leave.employeeUserName}</td>
                <td>{leave.leaveId}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>
                <td>
                  {leave.status === "PENDING" ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => decideLeave(leave.leaveId, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => decideLeave(leave.leaveId, "REJECTED")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>{leave.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
