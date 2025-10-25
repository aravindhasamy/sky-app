import { NavLink } from "react-router-dom";
import logo from "../../../assets/Sky-spectrum-rgb.png";
import "../styles/Header.css";

export default function Header() {
  return (
    <nav className="navbar navbar-expand shadow-sm bg-dark sticky-header">
      <div className="container d-flex align-items-center">
        <NavLink
          to="/assets"
          className="d-flex align-items-center text-decoration-none me-3"
        >
          <img src={logo} alt="Logo" className="me-2 header-logo-image" />
        </NavLink>
        <div className="navbar-nav ms-auto">
          <NavLink
            to="/assets"
            className={({ isActive }) =>
              `nav-link px-3${isActive ? " active" : ""}`
            }
          >
            Assets
          </NavLink>
          <NavLink
            to="/timeseries"
            className={({ isActive }) =>
              `nav-link px-3${isActive ? " active" : ""}`
            }
          >
            Timeseries
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
