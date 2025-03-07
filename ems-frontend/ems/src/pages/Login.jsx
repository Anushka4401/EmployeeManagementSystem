import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Alert } from "react-bootstrap";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      {/* Heading */}
      <h1 className="mb-4 text-primary fw-bold">EMPLOYEE MANAGEMENT SYSTEM</h1>

      {/* Login Card - Now 85% Width */}
      <div
        className="row shadow-lg rounded overflow-hidden bg-white"
        style={{ width: "85%", maxWidth: "1200px" }}
      >
        {/* Left Side - Image */}
        <div className="col-md-6 p-0">
          <img
            src="https://media.istockphoto.com/id/1298405314/vector/job-interview.jpg?s=612x612&w=0&k=20&c=F3P4brlXN7S35fe73OrxrKs0-FMc3VoMSuv6I6VIcGg="
            alt="Login Illustration"
            className="img-fluid h-100 w-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="col-md-6 p-5">
          <h3 className="text-center mb-4 text-primary fw-bold">Login</h3>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" className="text-center" dismissible>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold mt-2"
            >
              Login
            </button>

            <p className="text-center mt-3">
              Don't have an account?{" "}
              <Link
                to="/register-user"
                className="fw-bold text-primary text-decoration-none"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
