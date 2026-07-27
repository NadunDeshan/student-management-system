import { useEffect, useState } from 'react';
import {
    FaChalkboardTeacher,
    FaUserCheck,
    FaUserGraduate,
    FaUsers,
} from 'react-icons/fa';
import axios from '../../api/axios';
import DocumentTitle from '../../hooks/DocumentTitle.js';

function AdminDashboard() {
    const [statistics, setStatistics] = useState({
        total_students: 0,
        total_lecturers: 0,
        active_students: 0,
        active_lecturers: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    DocumentTitle('Dashboard');

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await axios.get(
                    '/admin/dashboard/statistics'
                );

                setStatistics(response.data);
            } catch (error) {
                console.error(
                    'Failed to load dashboard statistics:',
                    error
                );

                setError(
                    'Unable to load dashboard statistics.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const cards = [
        {
            title: 'Students',
            total: statistics.total_students,
            active: statistics.active_students,
            icon: <FaUserGraduate />,
        },
        {
            title: 'Lecturers',
            total: statistics.total_lecturers,
            active: statistics.active_lecturers,
            icon: <FaChalkboardTeacher />,
        },
    ];


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

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="row g-4">
                {cards.map((card) => (
                    <div
                        className="col-sm-6 col-xl-3"
                        key={card.title}
                    >
                        <div className="stat-card">
                            <div className="stat-icon mb-2">
                                {card.icon}
                            </div>

                            <h5 className="mb-3">
                                {card.title}
                            </h5>

                            <div className="d-flex justify-content-between mb-2 ">
                                <span className="stext display-6">Total</span>

                                <strong className="stext display-6 ">
                                    {loading ? '...' : card.total}
                                </strong>
                            </div>

                            <div className="d-flex justify-content-between bg-white p-2 rounded-3">
                                <span className="text-dark">Active</span>

                                <strong className="text-success  ">
                                    {loading ? '...' : card.active}
                                </strong>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default AdminDashboard;