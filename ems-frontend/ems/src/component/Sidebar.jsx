import { Link } from "react-router-dom";

const Sidebar = () => {
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
                  to="/user/messages"
                  className="nav-link px-2 py-2 w-100 d-flex align-items-center bg-transparent border-0 text-white"
                >
                  <i className="bi bi-chat-left-fill me-2"></i>
                  <span className="d-sm-inline d-none">Messages</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/user/documents"
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

export default Sidebar;
