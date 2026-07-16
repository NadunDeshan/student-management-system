import {
    FaBook,
    FaChalkboardTeacher,
    FaClipboardList,
    FaUserGraduate,
} from 'react-icons/fa';
import DocumentTitle from "../../hooks/DocumentTitle.js";

function AdminDashboard() {
    const cards = [
        {
            title: 'Students',
            value: 'Manage',
            icon: <FaUserGraduate />,
        },
        {
            title: 'Lecturers',
            value: 'Manage',
            icon: <FaChalkboardTeacher />,
        },
        // {
        //     title: 'Subjects',
        //     value: 'Coming soon',
        //     icon: <FaBook />,
        // },
        // {
        //     title: 'Exams',
        //     value: 'Coming soon',
        //     icon: <FaClipboardList />,
        // },
    ];
    DocumentTitle('Dashboard');

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Admin Dashboard
                    </h1>

                    <p className="page-subtitle">
                        Welcome to your Student Management
                        System.
                    </p>
                </div>
            </div>

            <div className="row g-4">
                {cards.map((card) => (
                    <div
                        className="col-sm-6 col-xl-3"
                        key={card.title}
                    >
                        <div className="stat-card">
                            <div className="stat-icon">
                                {card.icon}
                            </div>

                            <h3 className="stat-number">
                                {card.value}
                            </h3>

                            <span className="stext">
                                {card.title}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default AdminDashboard;