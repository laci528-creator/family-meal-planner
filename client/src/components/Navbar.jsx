import { NavLink } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";


function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">

        <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => `nav-link-a${isActive ? " active" : ""}`} >Home</NavLink>
            <NavLink to="/recipes" className={({ isActive }) => `nav-link-a${isActive ? " active" : ""}`}>Recipes</NavLink>
            <NavLink to="/planner" className={({ isActive }) => `nav-link-a${isActive ? " active" : ""}`}>Planner</NavLink>
            <NavLink to="/shopping" className={({ isActive }) => `nav-link-a${isActive ? " active" : ""}`}>Shopping</NavLink>
            {user ? (
                <>
                  <span>Hello, {user.firstName}</span>
                  <button onClick={logout}>Logout</button>
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/register">Register</NavLink>
                </>
              )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;