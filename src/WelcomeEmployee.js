import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomeEmployee() {
  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found, please login.");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); 
      const userName = payload.sub; // extracting employee username
      fetch(`http://localhost:8080/api/employees/${userName}`, {
      
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok) {
            setEmployee(data.data); // adjust as per your sample response\
            setMessage(data.message);
            console.log(data.message);
          } else {
            setMessage(data.message || "Unauthorized");
             console.log(data.message);
             navigate("/")
          }
        })
        .catch(() => setMessage("Something went wrong"));
    } catch (err) {
      setMessage("Invalid token");
    }
  }, []);

  if (message && !employee) {
    return (
      <div className="p-4 text-center">
        <p className="text-danger fw-bold">{message}</p>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center p-4 mt-5">
      <div className="card shadow-lg w-100" style={{ maxWidth: "700px" }}>
        <div className="card-body text-center">
          <h1 className="card-title mb-3 text-primary fw-bold">
            Welcome, {employee?.firstName} {employee?.lastName}!
          </h1>
          <h5 className="card-subtitle mb-4 text-muted">
            Here are your employee details:
          </h5>
          <ul className="list-group list-group-flush text-start">
            <li className="list-group-item">
              <strong>Username:</strong> {employee?.userName}
            </li>
            <li className="list-group-item">
              <strong>Email:</strong> {employee?.email}
            </li>
            <li className="list-group-item">
              <strong>Phone Number:</strong> {employee?.phoneNumber}
            </li>
            <li className="list-group-item">
              <strong>Role:</strong>{" "}
              <span className="badge bg-success">{employee?.role}</span>
            </li>
            <li className="list-group-item">
              <strong>Status:</strong>{" "}
              {employee?.active ? (
                <span className="badge bg-primary">Active</span>
              ) : (
                <span className="badge bg-danger">Inactive</span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
