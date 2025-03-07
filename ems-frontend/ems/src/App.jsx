import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/register-user" />} />

        <Route path="/register-user" element={<Register />} />
        <Route path="/login-user" element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={["ROLE_USER"]} />}>
          <Route
            path="/user/*"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]} />
          }
        >
          <Route
            path="/admin/*"
            element={
              <>
                <Navbar />
                <AdminDashboard />
              </>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
