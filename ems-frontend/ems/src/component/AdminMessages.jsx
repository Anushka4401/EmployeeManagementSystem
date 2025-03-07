import React, { useState } from "react";
import ChatBox from "./ChatBox";
import UserList from "./UserList";

const AdminMessages = ({ userId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  console.log("Received userId in Messages:", userId); // Debugging

  return (
    <div className="container-fluid mt-5 pt-5">
      <div className="row">
        {/* User List */}
        <div className="col-md-4">
          <UserList onSelectUser={setSelectedUser} userId={userId} />
        </div>

        {/* Chat Box */}
        <div className="col-md-8">
          {selectedUser ? (
            <ChatBox user={selectedUser} senderId={userId} />
          ) : (
            <div className="text-center mt-5">
              <p className="text-muted">Select a user to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
