import {
    FaBook,
    FaClipboardList,
    FaIdCard,
} from 'react-icons/fa';

import DocumentTitle from '../../hooks/DocumentTitle.js';

function StudentDashboard() {
    DocumentTitle('Student Dashboard');

    const savedUser = localStorage.getItem('user');
    const user = savedUser ? JSON.parse(savedUser) : {};

    const cards = [
        {
            title: 'My Profile',
            label: 'View personal information',
            icon: <FaIdCard />,
        },
        {
            title: 'My Subjects',
            label: 'Registered subjects',
            icon: <FaBook />,
        },
        {
            title: 'My Exams',
            label: 'Upcoming examinations',
            icon: <FaClipboardList />,
        },
    ];

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Student Dashboard
                    </h1>

                    <p className="page-subtitle">
                        Welcome back, {user?.name || 'Student'}.
                    </p>
                </div>
            </div>

            <div className="row g-4">
                {cards.map((card) => (
                    <div
                        className="col-sm-6 col-xl-4"
                        key={card.title}
                    >
                        <div className="stat-card h-100">
                            <div className="stat-icon">
                                {card.icon}
                            </div>

                            <h3 className="mt-3 mb-2">
                                {card.title}
                            </h3>

                            <span className="stext">
                                {card.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 mt-2">
                <div className="col-lg-8">
                    <div className="dashboard-panel">
                        <h4>Upcoming Exams</h4>

                        <p className="stext">
                            Your next scheduled examinations.
                        </p>

                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Exam</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                                </thead>

                                <tbody>
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center py-4 stext"
                                    >
                                        No upcoming exams available.
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="dashboard-panel h-100">
                        <h4>Student Account</h4>

                        <div className="text-center mt-4">
                            <div className="profile-avatar-large mx-auto mb-3">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name || 'Profile'}
                                        className="profile-avatar-img"
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

                            <h5>{user?.name || 'Student'}</h5>

                            <p className="stext mb-2">
                                {user?.email || 'No email available'}
                            </p>

                            <span className="badge text-bg-success">
                                Active Student
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentDashboard;
