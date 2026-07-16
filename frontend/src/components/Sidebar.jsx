import {NavLink} from 'react-router-dom';
import {
    FaBook,
    FaChalkboardTeacher,
    FaClipboardList,
    FaGraduationCap,
    FaTachometerAlt,
    FaUserGraduate,
} from 'react-icons/fa';

function Sidebar() {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">
                    <FaGraduationCap/>
                </div>

                <div>
                    <h4>WELCOME TO SMS</h4>
                    {/*<h4>SMS Portal</h4>*/}
                    <small>Admin Panel</small>
                </div>
            </div>

            <p className="sidebar-menu-title">Main menu</p>

            <nav className="sidebar-menu">
                <NavLink
                    to="/admin/dashboard"
                    className="sidebar-link"
                >
                    <FaTachometerAlt/>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/admin/students"
                    className="sidebar-link"
                >
                    <FaUserGraduate/>
                    <span>Students</span>
                </NavLink>


                <NavLink
                    to="/admin/lecturers"
                    className="sidebar-link"
                >
                    <FaChalkboardTeacher/>
                    <span>Lecturers</span>
                </NavLink>

                <NavLink
                    to="/admin/subjects"
                    className="sidebar-link"
                >
                    <FaBook/>
                    <span>Subjects</span>
                </NavLink>

                <NavLink
                    to="/admin/exams"
                    className="sidebar-link"
                >
                    <FaClipboardList/>
                    <span>Exams</span>
                </NavLink>

            </nav>
        </aside>
    );
}

export default Sidebar;