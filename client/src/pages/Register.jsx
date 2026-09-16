import { useState } from 'react';


function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
  e.preventDefault();

  if (password !== password2) {
    console.log("Passwords do not match");
    return;
  }

  console.log({
    firstName,
    lastName,
    email,
    password,
  });
}

  return (
    <div className="register-container">
      <h2>Sign Up</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            First name:
          </label>

          <input
            id="firstName"
            name="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Last name:
          </label>

          <input
            id="lastName"
            name="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email address:
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            name="password"
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password2" className="form-label">
            Confirm password:
          </label>

          <input
            id="password2"
            name="password2"
            type="password"
            minLength={8}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            autoComplete="new-password"
            className="form-input"
          />
        </div>

        <button
          type="submit"
          className="primary-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Create an Account '}
        </button>
      </form>
    </div>
  );
}

export default Register;