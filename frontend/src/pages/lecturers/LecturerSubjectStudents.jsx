import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    FaArrowLeft,
    FaBook,
    FaUsers,
} from 'react-icons/fa';

import api from '../../api/axios';
import Loading from '../../components/Loading';
import DocumentTitle from '../../hooks/DocumentTitle.js';

function LecturerSubjectStudents() {
    const { id } = useParams();

    const [subject, setSubject] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    DocumentTitle('Subject Students');

    useEffect(() => {
        const loadSubjectStudents = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await api.get(
                    `/lecturer/subjects/${id}`
                );

                setSubject(response.data.subject);
                setStudents(response.data.students ?? []);
            } catch (requestError) {
                console.error(requestError);

                setError(
                    requestError.response?.data?.message ??
                    'Unable to load subject students.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadSubjectStudents();
    }, [id]);

    if (loading) {
        return (
            <Loading message="Loading registered students..." />
        );
    }

    if (error || !subject) {
        return (
            <div className="content-card p-4">
                <div className="alert alert-danger mb-3">
                    {error || 'Subject not found.'}
                </div>

                <Link
                    to="/lecturer/subjects"
                    className="btn btn-outline-light"
                >
                    <FaArrowLeft className="me-2" />
                    Back to My Subjects
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Registered Students
                    </h1>

                    <p className="page-subtitle">
                        {subject.subject_code}
                        {' - '}
                        {subject.subject_name}
                    </p>
                </div>

                <Link
                    to="/lecturer/subjects"
                    className="btn btn-outline-light"
                >
                    <FaArrowLeft className="me-2" />
                    Back
                </Link>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <FaBook />
                        </div>

                        <h3 className="stat-number">
                            {subject.subject_code}
                        </h3>

                        <span className="stext">
                            {subject.subject_name}
                        </span>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <FaUsers />
                        </div>

                        <h3 className="stat-number">
                            {students.length}
                        </h3>

                        <span className="stext">
                            Registered Students
                        </span>
                    </div>
                </div>
            </div>

            <div className="content-card">
                {students.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="stat-icon mx-auto mb-3">
                            <FaUsers />
                        </div>

                        <h4 className="stext">
                            No registered students
                        </h4>

                        <p className="page-subtitle mb-0">
                            No students have been assigned to this
                            subject yet.
                        </p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Student Number</th>
                                    <th>Email</th>
                                    <th>Course</th>
                                    <th>Status</th>
                                    <th>Registered Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                {student.profile_image_url ? (
                                                    <img
                                                        src={
                                                            student
                                                                .profile_image_url
                                                        }
                                                        alt={
                                                            student.full_name
                                                        }
                                                        className="student-image"
                                                    />
                                                ) : (
                                                    <div className="student-image-placeholder">
                                                        {student.full_name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            'S'}
                                                    </div>
                                                )}

                                                <strong>
                                                    {student.full_name}
                                                </strong>
                                            </div>
                                        </td>

                                        <td>
                                            {student.student_number}
                                        </td>

                                        <td>{student.email}</td>

                                        <td>{student.course}</td>

                                        <td>
                                            <span
                                                className={`badge ${
                                                    student.status ===
                                                    'active'
                                                        ? 'bg-success'
                                                        : 'bg-secondary'
                                                }`}
                                            >
                                                {student.status}
                                            </span>
                                        </td>

                                        <td>
                                            {student.registered_at
                                                ? new Date(
                                                    student.registered_at
                                                ).toLocaleDateString(
                                                    'en-GB'
                                                )
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

export default LecturerSubjectStudents;