import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  // Decode JWT Token to get user role
  let userRole = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role; // Assuming the token contains a 'role' field
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login-user");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow fixed-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold " to="/">
          Employee Management
        </Link>

        {/* Toggler Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {token ? (
              <>
                {/* Profile Link - Navigate based on role */}
                <li className="nav-item mx-2">
                  <Link
                    to={
                      userRole === "ROLE_ADMIN" ||
                      userRole === "ROLE_SUPER_ADMIN"
                        ? "/admin"
                        : "/user/profile"
                    }
                    className="nav-link d-flex align-items-center"
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    <span className="d-none d-sm-inline">Profile</span>
                  </Link>
                </li>

                {/* Logout Button */}
                <li className="nav-item mx-2">
                  <button
                    className="btn btn-danger px-4 py-2 fw-semibold rounded-pill shadow-sm"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Login Link */}
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/login-user">
                    Login
                  </Link>
                </li>

                {/* Register Link */}
                <li className="nav-item mx-2">
                  <Link className="btn btn-light px-3 py-2" to="/register-user">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
