import { useEffect, useState } from 'react';
import axios from 'axios';

const StudentProfile = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const studentName =
        student?.full_name ||
        `${student?.first_name || ''} ${student?.last_name || ''}`.trim() ||
        'Student Name';

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.get(
                    'http://127.0.0.1:8000/api/student/profile',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json',
                        },
                    }
                );
                // console.log('Student profile response:', response.data);

                setStudent(response.data.student);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    'Unable to load student profile.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStudentProfile();
    }, []);

    if (loading) {
        return <p className={"stext"}>Loading student profile...</p>;
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                {error}
            </div>
        );
    }

    return (
        <div className="student-profile-page">
            <div className="student-profile-frame">

                <div className="student-profile-cover">
                    <div className="student-profile-avatar">
                        {student?.profile_image ? (
                            <img
                                src={student.profile_image}
                                alt={studentName || 'Student'}
                            />
                        ) : (
                            <span>
                        {studentName
                            ?.split(' ')
                            .map((word) => word[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase() || 'ST'}
                    </span>
                        )}
                    </div>
                </div>

                <div className="student-profile-body">

                    <div className="student-profile-main-info">
                        <div>
                            <h2>
                                {studentName || 'Student Name'}
                            </h2>

                            <p>
                                Student ID:
                                <strong>
                                    {' '}
                                    {student?.student_number || '-'}
                                </strong>
                            </p>
                        </div>

                        <span
                            className={`student-profile-badge ${
                                student?.status === 'active'
                                    ? 'status-active'
                                    : 'status-inactive'
                            }`}
                        >
                    {student?.status || 'Unknown'}
                </span>
                    </div>

                    <div className="student-profile-divider" />

                    <div className="student-profile-section-heading">
                        <div>
                            <h3>Personal Information</h3>
                            <p>Your registered student details</p>
                        </div>
                    </div>

                    <div className="student-profile-grid">

                        <div className="student-profile-field">
                            <span>Full Name</span>
                            <strong>
                                {studentName || '-'}
                            </strong>
                        </div>

                        <div className="student-profile-field">
                            <span>Student Number</span>
                            <strong>
                                {student?.student_number || '-'}
                            </strong>
                        </div>

                        <div className="student-profile-field">
                            <span>Course</span>
                            <strong>
                                {student?.course || '-'}
                            </strong>
                        </div>

                        <div className="student-profile-field">
                            <span>Enrollment Date</span>
                            <strong>
                                {student?.enrollment_date
                                    ? new Date(
                                        student.enrollment_date
                                    ).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })
                                    : '-'}
                            </strong>
                        </div>

                        <div className="student-profile-field">
                            <span>Account Status</span>
                            <strong className="text-capitalize">
                                {student?.status || '-'}
                            </strong>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;