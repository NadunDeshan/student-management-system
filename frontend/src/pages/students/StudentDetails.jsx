import { useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { getStudent } from '../../api/studentApi';
import Loading from '../../components/Loading';

function StudentDetails() {
    const { id } = useParams();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadStudent = async () => {
            try {
                const result = await getStudent(id);

                setStudent(result.data);
            } catch (requestError) {
                console.error(requestError);

                setError('Student could not be found.');
            } finally {
                setLoading(false);
            }
        };

        loadStudent();
    }, [id]);

    if (loading) {
        return <Loading message="Loading student..." />;
    }

    if (error || !student) {
        return (
            <div className="alert alert-danger">
                {error || 'Student not found.'}
            </div>
        );
    }

    const details = [
        ['Student number', student.student_number],
        ['Full name', student.full_name],
        ['Email', student.email],
        ['Phone number', student.phone_number || 'Not provided'],
        ['Date of birth', student.date_of_birth],
        ['Gender', student.gender],
        ['Address', student.address || 'Not provided'],
        ['Course', student.course],
        ['Enrollment date', student.enrollment_date],
        ['Status', student.status],
        ['Created at', student.created_at],
        ['Updated at', student.updated_at],
    ];

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Student Details
                    </h1>

                    <p className="page-subtitle">
                        View the student's complete information.
                    </p>
                </div>

                <div>
                    <Link
                        to="/admin/students"
                        className="btn btn-outline-secondary me-2"
                    >
                        Back
                    </Link>

                    <Link
                        to={`/admin/students/${student.id}/edit`}
                        className="btn btn-system"
                    >
                        <FaPen className="me-2" />
                        Edit
                    </Link>
                </div>
            </div>

            <div className="content-card p-4">
                <div className="text-center mb-4">
                    {student.profile_image_url ? (
                        <img
                            src={student.profile_image_url}
                            alt={student.full_name}
                            className="details-profile-image"
                        />
                    ) : (
                        <div
                            className="student-image-placeholder mx-auto"
                            style={{
                                width: '145px',
                                height: '145px',
                                fontSize: '38px',
                            }}
                        >
                            {student.first_name
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>
                    )}

                    <h3 className="mt-3 mb-1">
                        {student.full_name}
                    </h3>

                    <span
                        className={`badge ${
                            student.status === 'active'
                                ? 'text-bg-success'
                                : 'text-bg-secondary'
                        }`}
                    >
                        {student.status}
                    </span>
                </div>

                <div className="row">
                    {details.map(([label, value]) => (
                        <div
                            className="col-md-6 mb-3"
                            key={label}
                        >
                            <div className="border rounded p-3 h-100">
                                <small className="text-muted">
                                    {label}
                                </small>

                                <div className="fw-semibold mt-1 text-capitalize">
                                    {value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default StudentDetails;