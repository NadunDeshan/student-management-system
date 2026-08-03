import { NavLink, useLocation } from "react-router-dom";

import {
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
  FaGraduationCap,
  FaIdCard,
  FaTachometerAlt,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();

  let portal = "student";

  if (location.pathname.startsWith("/admin")) {
    portal = "admin";
  } else if (location.pathname.startsWith("/lecturer")) {
    portal = "lecturer";
  }

  const menuItems = {
    admin: [
      {
        path: "/admin/dashboard",
        label: "Dashboard",
        icon: <FaTachometerAlt />,
      },
      {
        path: "/admin/students",
        label: "Students",
        icon: <FaUserGraduate />,
      },
      {
        path: "/admin/lecturers",
        label: "Lecturers",
        icon: <FaChalkboardTeacher />,
      },
      {
        path: "/admin/subjects",
        label: "Subjects",
        icon: <FaBook />,
      },
      // {
      //   path: "/admin/exams",
      //   label: "Exams",
      //   icon: <FaClipboardList />,
      // },
      {
        path: "/admin/assessments",
        label: "Assessments",
        icon: <FaClipboardList />,
      },
    ],

    student: [
      {
        path: "/student/dashboard",
        label: "Dashboard",
        icon: <FaTachometerAlt />,
      },
      {
        path: "/student/profile",
        label: "My Profile",
        icon: <FaIdCard />,
      },
      {
        path: "/student/subjects",
        label: "My Subjects",
        icon: <FaBook />,
      },
      {
        path: "/student/assessments",
        label: "My Assessments",
        icon: <FaClipboardList />,
      },
    ],

    lecturer: [
      {
        path: "/lecturer/dashboard",
        label: "Dashboard",
        icon: <FaTachometerAlt />,
      },
      {
        path: "/lecturer/profile",
        label: "My Profile",
        icon: <FaIdCard />,
      },
      {
        path: "/lecturer/subjects",
        label: "My Subjects",
        icon: <FaBook />,
      },
      // {
      //   path: "/lecturer/students",
      //   label: "My Students",
      //   icon: <FaUsers />,
      // },
      {
        path: "/lecturer/assessments",
        label: "Assessments",
        icon: <FaClipboardList />,
      },
    ],
  };

  const panelNames = {
    admin: "Admin Panel",
    student: "Student Panel",
    lecturer: "Lecturer Panel",
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <FaGraduationCap />
        </div>

        <div>
          <h4>WELCOME TO SMS</h4>
          <small>{panelNames[portal]}</small>
        </div>
      </div>

      <p className="sidebar-menu-title">Main menu</p>

      <nav className="sidebar-menu">
        {menuItems[portal].map((item) => (
          <NavLink key={item.path} to={item.path} className="sidebar-link">
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
