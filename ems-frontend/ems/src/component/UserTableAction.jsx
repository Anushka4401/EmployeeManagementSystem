import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import AdminService from "../services/AdminServices";

const UserTableAction = () => {
  const [users, setUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getAllUsers(page, size);
      setUsers(response.content);
      setTotalPages(response.totalPages);

      setError(null);
    } catch (error) {
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    try {
      await AdminService.approveUser(id);
      fetchUsers();
    } catch {
      setError("Failed to approve user.");
    }
  };

  const deactivateUser = async (id) => {
    try {
      await AdminService.deactivateUser(id);
      fetchUsers();
    } catch {
      setError("Failed to deactivate user.");
    }
  };

  const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

  const uploadFile = async () => {
    if (!selectedFile) return alert("Please select a file first!");
    try {
      await AdminService.importUsers(selectedFile);
      alert("Users imported successfully!");
      fetchUsers();
    } catch {
      setError("Failed to import users.");
    }
  };

  const openEditModal = (user) => {
    setSelectedUser({
      ...user,
      role_id: user.roles?.id || 0, // Use roles.id for role_id
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const saveChanges = async () => {
    if (!selectedUser) return;
    try {
      await AdminService.updateUser(selectedUser.id, {
        ...selectedUser,
        roles: { id: parseInt(selectedUser.role_id, 10) }, // Send role as object
      });

      fetchUsers();
      closeEditModal();
    } catch {
      setError("Failed to update user.");
    }
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setNewUser({ username: "", email: "", password: "" });
    setMessage("");
    setError("");
  };

  const handleRegisterChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await AdminService.registerUserManually(newUser);
      setMessage("User registered successfully!");
      fetchUsers();
      setTimeout(() => closeRegisterModal(), 2000); // Auto-close modal
    } catch (err) {
      setError("Failed to register user.");
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [page, size]);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary fw-bold">User Management</h2>
      {error && (
        <Alert variant="danger" dismissible>
          {error}
        </Alert>
      )}

      <div className="d-flex flex-column mb-3">
        <div className="d-flex justify-content-between align-items-center gap-3">
          <div className="d-flex gap-2">
            <input
              type="file"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
          <button
            className="btn btn-success"
            onClick={uploadFile}
            disabled={!selectedFile}
          >
            Import Users
          </button>
          <button
            className="btn btn-primary ms-auto"
            onClick={openRegisterModal}
          >
            Manual Registration
          </button>
        </div>
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search by username..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "300px" }} // Centers it
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : users.length ? (
              users
                .filter((user) =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.roles?.role_name.replace("ROLE_", "")}</td>
                    <td>{user.status ? "Active" : "Inactive"}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => approveUser(user.id)}
                        disabled={user.status}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deactivateUser(user.id)}
                        disabled={!user.status}
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>
          {" "}
          Page {page + 1} of {totalPages}{" "}
        </span>
        <button
          className="btn btn-outline-primary"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={selectedUser?.name || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={selectedUser?.email || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={selectedUser?.role_id || ""}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    role_id: Number(e.target.value),
                  })
                }
              >
                <option value={2}>Admin</option> {/* Use 2 for Admin */}
                <option value={3}>User</option> {/* Use 3 for User */}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={saveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Manual Registration Modal */}
      <Modal show={showRegisterModal} onHide={closeRegisterModal}>
        <Modal.Header closeButton>
          <Modal.Title>Manual User Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="name"
                onChange={handleRegisterChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleRegisterChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={handleRegisterChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="success">
              Register
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserTableAction;
