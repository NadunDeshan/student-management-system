import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { FaBell, FaSignOutAlt } from 'react-icons/fa';

function Navbar() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const handleLogout = async () => {
        try {
            await axios.post('/logout');
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            navigate('/login');
        }
    };
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

                <div className="admin-avatar">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name || 'Profile'}
                            className="admin-avatar-img"
                        />
                    ) : (
                        user?.name
                            ?.split(' ')
                            .map((word) => word[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase() || 'US'
                    )}
                </div>

                <div className="d-none d-md-block">
                    <strong>{user?.name ?? 'User'}</strong>

                    <div className="small stext">
                        <span>
                            {user?.role?.charAt(0).toUpperCase() +
                                user?.role?.slice(1)}
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-danger ms-3"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt className="me-2" />
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Navbar;