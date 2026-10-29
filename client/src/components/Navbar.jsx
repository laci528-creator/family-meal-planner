import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ThemeSwitcher from "../theme/ThemeSwitcher";

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  const recipesActive =
    location.pathname.startsWith("/recipes") ||
    location.pathname.startsWith("/discover");

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button
          type="button"
          className={`nav-toggle${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <img
            src={menuOpen ? "/icons/close.svg" : "/icons/menu.svg"}
            alt=""
            aria-hidden="true"
          />
        </button>

        <div className={`nav-links${menuOpen ? " open" : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link-a${isActive ? " active" : ""}`
            }
          >
            Home
          </NavLink>
          <div className="nav-dropdown">
            <NavLink
              to="/recipes"
              className={`nav-link-a${recipesActive ? " active" : ""}`}
            >
              Recipes <span className="dropdown-arrow">▾</span>
            </NavLink>

            <div className="nav-dropdown-menu">
              <NavLink
                to="/recipes"
                end
                className={({ isActive }) =>
                  `nav-link-a${isActive ? " active" : ""}`
                }
              >
                My Recipes
              </NavLink>

              <NavLink
                to="/discover"
                className={({ isActive }) =>
                  `nav-link-a${isActive ? " active" : ""}`
                }
              >
                Discover Recipes
              </NavLink>

              <NavLink
                to="/recipes/family/new"
                className={({ isActive }) =>
                  `nav-link-a${isActive ? " active" : ""}`
                }
              >
                Add Family Recipe
              </NavLink>
            </div>
          </div>
          <NavLink
            to="/planner"
            className={({ isActive }) =>
              `nav-link-a${isActive ? " active" : ""}`
            }
          >
            Planner
          </NavLink>
          <NavLink
            to="/shopping"
            className={({ isActive }) =>
              `nav-link-a${isActive ? " active" : ""}`
            }
          >
            Shopping
          </NavLink>
          <NavLink
            to="/pantry"
            className={({ isActive }) =>
              `nav-link-a${isActive ? " active" : ""}`
            }
          >
            Pantry
          </NavLink>
          {user ? (
            <>
              <span className="nav-user">Hello, {user.firstName}</span>
              <button className="nav-link-a logout-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `nav-link-a${isActive ? " active" : ""}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `nav-link-a${isActive ? " active" : ""}`
                }
              >
                Register
              </NavLink>
            </>
          )}
          <div className="theme-switcher-container">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
