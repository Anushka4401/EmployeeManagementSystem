import { Routes, Route } from "react-router-dom";
import Profile from "../component/Profile";
import Sidebar from "../component/Sidebar";
import profileService from "../services/ProfileService";
import { useEffect, useState } from "react";
import Documents from "../component/Documents";
import Message from "../component/Message";

const Home = () => {
  const [userId, setUserId] = useState(null); // Store the user ID
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        console.log("Fetched Profile:", profile); // Debugging

        if (profile && profile.id) {
          setUserId(profile.id); // Set the user ID
        } else {
          console.log("Profile data is missing ID");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProfile();
  }, []);

  console.log("Current userId:", userId); // Debugging

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark position-fixed vh-100">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col offset-md-3 offset-xl-2 p-60">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Routes>
              {/* Profile Route */}
              <Route path="profile" element={<Profile />} />

              {/* Messages Route */}
              <Route path="messages" element={<Message userId={userId} />} />

              {/* Documents Route */}
              <Route path="documents" element={<Documents isAdmin={false} />} />

              {/* Default Route (Redirect to Profile) */}
              <Route path="/" element={<Profile />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
