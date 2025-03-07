import React, { useEffect, useState } from "react";
import AdminServices from "../services/AdminServices";
import moment from "moment";

const LoginHistory = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLoginHistory();
  }, [page, size]);

  const fetchLoginHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await AdminServices.getLoginHistory(
        page,
        size,
        "loginTime",
        "desc"
      );
      setLogs(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching login history:", error);
      setError("Failed to load login history.");
    } finally {
      setLoading(false);
    }
  };

  // Function to format timestamp
  const formatLoginTime = (isoTimestamp) => {
    return moment(isoTimestamp).format("MMM D, YYYY [at] h:mm A");
  };

  return (
    <div>
      <h4 className="mb-3">Login History</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>User ID</th>
            <th>Login Time</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="2" className="text-center">
                Loading...
              </td>
            </tr>
          ) : logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.id}>
                <td>{log.userId}</td>
                <td>{formatLoginTime(log.loginTime)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center">
                No login history found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-primary"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          {" "}
          Page {page + 1} of {totalPages}{" "}
        </span>
        <button
          className="btn btn-primary"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LoginHistory;
