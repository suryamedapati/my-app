import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    userName: "",   // ✅ changed from userId
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // ✅ Extract username from token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const username =
          decoded.userName || decoded.sub || decoded.username || "";
        setFormData((prev) => ({ ...prev, userName: username }));
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  // Handle input changes (for old/new password only)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage("New Password and Confirm Password do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/employees/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.text(); // ✅ backend returns plain string

      if (response.ok) {
        setMessage(data || "Password changed successfully");
        setSuccess(true);
        setFormData({
          userName: formData.userName, // keep decoded username
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setMessage(data || "Failed to change password");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong, please try again");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="mb-4 text-xl fw-bold text-primary border-bottom pb-2 text-center">
        Change Password
      </h2>

      {success ? (
        <div className="text-center space-y-4">
          <p className="text-green-700 font-medium bg-green-100 p-2 rounded">
            {message}
          </p>
          <button
            onClick={() =>{const token = localStorage.getItem("token");
                let role = null;
              
                          const decoded = jwtDecode(token);
                          role =
                            decoded.role || decoded.authorities?.[0] || decoded.userRole || null;
                        
                
                        // ✅ Route based on role
                        if (role && role.toLowerCase() === "admin") {
                          navigate("/home/welcome");
                        } else {
                          navigate("/userhome/welcome");
                        }}
               }
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Old Password:
            </label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your old password"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              New Password:
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter a new password"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Confirm New Password:
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Update Password
          </button>
        </form>
      )}

      {!success && message && (
        <p className="mt-4 text-red-700 bg-red-100 p-2 rounded text-center">
          {message}
        </p>
      )}
    </div>
  );
}
