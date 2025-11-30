import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    SuiviMat
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <NavLink
                                to="/materials"
                                className={({ isActive }) =>
                                    "nav-link " + (isActive ? "active" : "")
                                }
                            >
                                Matériels
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/declarations"
                                className={({ isActive }) =>
                                    "nav-link " + (isActive ? "active" : "")
                                }
                            >
                                Déclarations
                            </NavLink>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}
