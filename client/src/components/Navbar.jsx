import { NavLink } from 'react-router-dom';

function Navbar() {


  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link-a${isActive ? " active" : ""}`} >Home</NavLink>
            <NavLink to="/recipes" className={({ isActive }) => `nav-link-a${isActive ? " active" : ""}`}>Recipes</NavLink>
            <NavLink to="/planner" className={({ isActive }) => `nav-link-a${isActive ? " active" : ""}`}>Planner</NavLink>
            <NavLink to="/shopping" className={({ isActive }) => `nav-link-a${isActive ? " active" : ""}`}>Shopping</NavLink>
            <NavLink to="/login" className={({ isActive }) => `nav-link-a${isActive ? " active" : ""}`}>Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => `nav-link-a${isActive ? " active" : ""}`}>Register</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;