import { FaBell } from 'react-icons/fa';

function Navbar() {
    return (
        <header className="admin-navbar">
            <div>
                <h2 className="admin-navbar-title">
                    Student Management System
                </h2>

                <small className="stext">
                    Manage students from the admin panel
                </small>
            </div>

            <div className="admin-user">
                <button
                    type="button"
                    className="btn btn-light rounded-circle"
                    aria-label="Notifications"
                >
                    <FaBell />
                </button>

                <div className="admin-avatar">AD</div>

                <div className="d-none d-md-block">
                    <strong>Administrator</strong>
                    <div className="small stext"  >
                        <span>System Admin</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;