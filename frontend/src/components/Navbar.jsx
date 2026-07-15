import { FaBell } from 'react-icons/fa';

function Navbar() {
    return (
        <header className="admin-navbar">
            <div>
                <h2 className="admin-navbar-title">
                    Student Management System
                </h2>

                <small className="text-muted">
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
                    <div className="small text-muted">
                        System Admin
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;