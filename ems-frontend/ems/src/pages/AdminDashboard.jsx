import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import profileService from "../services/ProfileService";
import Sidebar from "../component/Sidebar";
import Profile from "../component/Profile";
import LoginHistory from "../component/LoginHistory";
import AdminSidebar from "../component/AdminSidebar";
import AdminMessages from "../component/AdminMessages";
import Documents from "../component/Documents";
import UserTableAction from "../component/UserTableAction";

const AdminDashboard = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        console.log("Fetched Profile:", profile);

        if (profile && profile.id) {
          setUserId(profile.id);
        } else {
          console.log("Profile data is missing ID");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar (Fixed Position) */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark position-fixed vh-100">
          <AdminSidebar />
        </div>

        {/* Main Content Area */}
        <div className="col offset-md-3 offset-xl-2 p-4">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Routes>
              {/* Admin Dashboard Default Route */}
              <Route path="/" element={<Profile />} />

              {/* Login History Page (Now under /admin/login-history) */}
              <Route path="login-history" element={<LoginHistory />} />
              <Route
                path="messages"
                element={<AdminMessages userId={userId} />}
              />
              <Route path="documents" element={<Documents isAdmin={true} />} />
              <Route path="user-table" element={<UserTableAction />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
