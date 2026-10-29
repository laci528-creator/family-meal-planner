import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import StatusMessage from "../components/StatusMessage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUser } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message || "";

  const handleSubmit = async (e) => {
    e.preventDefault(); // page refresh not allowed
    setError(null);
    setIsSubmitting(true);

    const trimmedEmail = email.trim();

    try {
      const response = await api.post("/auth/login", {
        email: trimmedEmail,
        password,
      });

      setUser(response.data.user);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-container auth-page">
      <div className="auth-card">
        <h1>Login</h1>

        <StatusMessage type="success">{successMessage}</StatusMessage>

        <StatusMessage type="error">{error}</StatusMessage>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
              autoComplete="email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
              autoComplete="current-password"
              className="form-input"
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;
