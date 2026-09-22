import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';



function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault(); // page refresh not allowed 
    setError(null);
    setIsSubmitting(true);

    const trimmedEmail = email.trim();

    try {
        await api.post('/auth/login', { 
          email: trimmedEmail, 
          password 
        });

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
          'Invalid email or password.'
      );
    } finally {
    setIsSubmitting(false);
  }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email address:</label>
          <input
            id="email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            autoComplete="email"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password:</label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            autoComplete="current-password" 
            className="form-input"
          />
        </div>

        <button 
          type="submit" 
          className="login-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
)}

export default Login;