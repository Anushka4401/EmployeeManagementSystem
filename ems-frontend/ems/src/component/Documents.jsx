import React, { useEffect, useState } from "react";
import DocumentServices from "../services/DocumentServices";
import AdminService from "../services/AdminServices";

const Documents = ({ isAdmin }) => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]); // Store users in state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await DocumentServices.getDocuments();
        setDocuments(data);
      } catch (error) {
        console.error("Failed to fetch documents");
      }
    };
    const fetchUsers = async () => {
      try {
        const data = await AdminService.getUsersList();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users");
      }
    };

    fetchDocuments();
    if (isAdmin) {
      fetchUsers();
    }
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !userId) {
      alert("Please select a file and provide a valid user ID.");
      return;
    }

    try {
      await DocumentServices.uploadFile(file, userId);
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  const filteredDocuments = documents.filter((doc) =>
    doc.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Documents</h2>
      {isAdmin && (
        <div className="mb-4 p-3 border rounded shadow-sm bg-light">
          <h5 className="mb-3">Upload Document</h5>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="form-control"
            />
            <select
              className="form-control"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={{ width: "150px" }}
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
      )}

      <div className="mb-3">
        <h4 className="text-secondary">List of Documents</h4>
        {isAdmin && (
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by user name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
      <div className="row">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-truncate" title={doc.filePath}>
                  {doc.filePath.replace(/^temp-\d+/, "")}{" "}
                </h5>
                {isAdmin && (
                  <p className="text-muted mb-1">
                    <strong>User :{doc.userName} </strong>
                  </p>
                )}
                <p className="card-text text-muted">
                  Uploaded At: {new Date(doc.uploadedAt).toLocaleString()}
                </p>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => DocumentServices.downloadFile(doc.filePath)}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
