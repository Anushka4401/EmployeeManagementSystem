import React, { useState, useEffect } from "react";
import AdminService from "../services/AdminServices";
const UserList = ({ onSelectUser, userId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await AdminService.getAllUsers(page, pageSize);
        const { content, totalPages } = data;

        const filteredUsers = content.filter((admin) => admin.id !== userId);

        setUsers(filteredUsers);
        setTotalPages(totalPages);
      } catch (error) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    onSelectUser(user); // Pass selected user to parent
  };
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (loading) return <p className="text-center mt-3">Loading users...</p>;
  if (error) return <p className="text-danger text-center mt-3">{error}</p>;

  return (
    <div
      className="card border rounded shadow-sm p-3 mt-5"
      style={{ marginTop: "80px" }}
    >
      <h5 className="text-primary mb-3">Select a User to Chat</h5>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search user..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="list-group">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className={`list-group-item list-group-item-action d-flex align-items-center ${
              selectedUser?.id === user.id ? "active text-white bg-primary" : ""
            }`}
            onClick={() => handleUserClick(user)}
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-person-circle"></i>

            {/* Added `me-2` for spacing */}
            {user.name}
          </li>
        ))}
      </ul>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          className="btn btn-outline-primary"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
