


function Register() {
  return (
    <div className="register-container">
      <h2>Sign Up</h2>

      <form className="register-form">
        <div className="form-group">
          <label htmlFor="firstname" className="form-label">
            First name:
          </label>

          <input
            id="firstname"
            name="firstname"
            type="text"
            required
            autoComplete="given-name"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastname" className="form-label">
            Last name:
          </label>

          <input
            id="lastname"
            name="lastname"
            type="text"
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
            required
            autoComplete="new-password"
            className="form-input"
          />
        </div>

        <button
          type="submit"
          className="primary-button"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;