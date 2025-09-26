import React, { useState } from "react";

export default function ViewEmployeeLeaves() {
  const [username, setUsername] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleFetchLeaves = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);
    try {
      const response = await fetch(`http://localhost:8080/api/leaves/user/${username}`, {
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

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-3">View Leave Requests by Username</h3>

      {/* Username Input Form */}
      <form onSubmit={handleFetchLeaves} className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>

      {loading && <div>Loading leave requests...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && leaves.length > 0 && (
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

      {hasSearched && !loading && !error && leaves.length === 0 && (
        <p>No leave requests found for this user.</p>
      )}
    </div>
  );
}
