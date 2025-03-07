import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div
          className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark "
          style={{ marginTop: "56px" }}
        >
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100"
              id="menu"
            >
              {/* Messages */}
              <li className="w-100">
                <Link
                  to="/admin/messages"
                  className="nav-link px-2 py-2 w-100 d-flex align-items-center bg-transparent border-0 text-white"
                >
                  <i className="bi bi-chat-left-fill me-2"></i>
                  <span className="d-sm-inline d-none">Messages</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/admin/user-table"
                  className="nav-link px-2 py-2 w-100 d-flex align-items-center bg-transparent border-0 text-white"
                >
                  <i className="bi bi-people-fill me-2"></i>
                  <span className="d-sm-inline d-none">Users</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/admin/login-history"
                  className="nav-link px-2 py-2 w-100 d-flex align-items-center bg-transparent border-0 text-white"
                >
                  <i className="bi bi-hourglass me-2"></i>
                  <span className="d-sm-inline d-none">Login History</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/admin/documents"
                  className="nav-link px-2 py-2 w-100 d-flex align-items-center bg-transparent border-0 text-white"
                >
                  <i className="bi bi-file-text me-2"></i>
                  <span className="d-sm-inline d-none">Documents</span>
                </Link>
              </li>
            </ul>

            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
