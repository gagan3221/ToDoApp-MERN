import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const response = await fetch("http://localhost:5000/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, userName }),
    });

    const json = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      console.log(json.error);
      setError(json.error);
    }

    if (response.ok) {
      console.log(json);
      dispatch({ type: "LOGIN", payload: json });
      localStorage.setItem("user", JSON.stringify(json));
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">TASKIFY</h1>
          <h3 className="auth-title">Create Account</h3>
          <p className="auth-subtitle">Sign up to get started with Taskify</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <button 
            type="button"
            className="auth-secondary-btn" 
            onClick={handleLoginRedirect}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
