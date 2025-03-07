import React, { useState, useEffect } from "react";
import profileService from "../services/ProfileService";
import { Modal, Button, Form } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import AuthService from "../services/AuthService";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);

        setUpdatedProfile({ name: data.name, email: data.email });
      } catch (error) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await profileService.updateProfile(updatedProfile);
      console.log("Profile updated successfully:", response);
      setProfile(response); // Update UI with new data
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="w-50 p-5 border rounded-4 shadow-lg bg-white">
        <h2 className="text-center text-primary mb-4">My Profile</h2>

        {profile && (
          <div className="card mb-4">
            <div className="card-body">
              <div className="text-center mb-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZsL6PVn0SNiabAKz7js0QknS2ilJam19QQ&s"
                  alt="User Avatar"
                  className="rounded-circle img-fluid"
                  style={{ width: "120px" }}
                />
              </div>
              <p>
                <strong>Full Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Role:</strong> {profile.roles?.role_name}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  className={profile.status ? "text-success" : "text-danger"}
                >
                  {profile.status ? "Active" : "Inactive"}
                </span>
              </p>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Edit Profile
              </Button>
            </div>
          </div>
        )}

        {/* Modal for updating profile */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label> Name</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedProfile.name}
                  onChange={(e) =>
                    setUpdatedProfile({
                      ...updatedProfile,
                      name: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={updatedProfile.email}
                  onChange={(e) =>
                    setUpdatedProfile({
                      ...updatedProfile,
                      email: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
