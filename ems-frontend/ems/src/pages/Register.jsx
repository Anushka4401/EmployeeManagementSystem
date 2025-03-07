import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Alert } from "react-bootstrap";

const Register = () => {
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
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
      await register(formData.name, formData.email, formData.password);
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      {/* Heading */}
      <h1 className="mb-4 text-primary fw-bold text-center">
        EMPLOYEE MANAGEMENT SYSTEM
      </h1>

      {/* Sign Up Card - 85% Width */}
      <div
        className="row shadow-lg rounded overflow-hidden bg-white"
        style={{ width: "85%", maxWidth: "1200px" }}
      >
        {/* Left Side - Image */}
        <div className="col-md-6 p-0">
          <img
            src="https://media.istockphoto.com/id/1298405314/vector/job-interview.jpg?s=612x612&w=0&k=20&c=F3P4brlXN7S35fe73OrxrKs0-FMc3VoMSuv6I6VIcGg="
            alt="Register Illustration"
            className="img-fluid h-100 w-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="col-md-6 p-5">
          <h3 className="text-center mb-4 text-primary fw-bold">Sign Up</h3>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" className="text-center" dismissible>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-3">
              <label className="form-label fw-bold">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold mt-2"
            >
              Sign Up
            </button>

            {/* Login Link */}
            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link
                to="/login-user"
                className="fw-bold text-primary text-decoration-none"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
