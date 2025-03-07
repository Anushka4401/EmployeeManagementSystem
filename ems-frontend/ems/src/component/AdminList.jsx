import React, { useState, useEffect } from "react";
import MessageService from "../services/MessageService";

const AdminList = ({ onSelectUser, userId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await MessageService.getAdmins();

        const filteredUsers = data.filter((admin) => admin.id !== userId);

        setUsers(filteredUsers);
      } catch (error) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    onSelectUser(user);
  };

  if (loading) return <p className="text-center mt-3">Loading users...</p>;
  if (error) return <p className="text-danger text-center mt-3">{error}</p>;

  return (
    <div
      className="card border rounded shadow-sm p-3 mt-5"
      style={{ marginTop: "80px" }}
    >
      <h5 className="text-primary mb-3">Select an Admin to Chat</h5>
      <ul className="list-group">
        {users.map((user) => (
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
    </div>
  );
};

export default AdminList;
