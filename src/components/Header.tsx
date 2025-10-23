import { NavLink } from "react-router-dom";
import logo from "../assets/Sky-spectrum-rgb.png";

export default function Header() {
  return (
    <nav className="navbar navbar-expand shadow-sm bg-dark">
      <div className="container d-flex align-items-center">
        <NavLink
          to="/assets"
          className="d-flex align-items-center text-decoration-none me-3"
        >
          <img
            src={logo}
            alt="Logo"
            className="me-2"
            style={{ height: "40px", width: "auto", objectFit: "contain" }}
          />
        </NavLink>
        <div className="navbar-nav ms-auto">
          <NavLink
            to="/assets"
            className={({ isActive }) =>
              "nav-link px-3" + (isActive ? " active" : "")
            }
            style={({ isActive }) => ({
              color: isActive ? "white" : "rgba(255, 255, 255, 0.7)",
              fontWeight: isActive ? "600" : "400",
              borderBottom: isActive ? "3px solid #ffcc00" : "none",
              transition: "color 0.3s, border-bottom 0.3s",
            })}
          >
            Assets
          </NavLink>
          <NavLink
            to="/timeseries"
            className={({ isActive }) =>
              "nav-link px-3" + (isActive ? " active" : "")
            }
            style={({ isActive }) => ({
              color: isActive ? "white" : "rgba(255, 255, 255, 0.7)",
              fontWeight: isActive ? "600" : "400",
              borderBottom: isActive ? "3px solid #ffcc00" : "none",
              transition: "color 0.3s, border-bottom 0.3s",
            })}
          >
            Timeseries
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
