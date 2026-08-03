import { useEffect, useState } from 'react';
import {
    FaBook,
    FaChalkboardTeacher,
    FaGraduationCap,
} from 'react-icons/fa';

import api from '../../api/axios';
import Loading from '../../components/Loading';
import DocumentTitle from '../../hooks/DocumentTitle.js';

function StudentMySubjects() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    DocumentTitle('My Subjects');

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await api.get(
                    '/student/subjects'
                );

                setSubjects(
                    response.data.subjects ?? []
                );
            } catch (requestError) {
                console.error(requestError);

                setError(
                    requestError.response?.data?.message ??
                    'Unable to load your subjects.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadSubjects();
    }, []);

    if (loading) {
        return (
            <Loading message="Loading your subjects..." />
        );
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        My Subjects
                    </h1>

                    <p className="page-subtitle">
                        View the subjects registered to your account.
                    </p>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!error && subjects.length === 0 ? (
                <div className="content-card text-center py-5">
                    <div className="stat-icon mx-auto mb-3">
                        <FaBook />
                    </div>

                    <h4 className="stext">
                        No subjects registered
                    </h4>

                    <p className="page-subtitle mb-0">
                        An administrator has not assigned any
                        subjects to your account yet.
                    </p>
                </div>
            ) : (
                <div className="row g-4">
                    {subjects.map((subject) => (
                        <div
                            className="col-md-6 col-xl-4"
                            key={subject.id}
                        >
                            <div className="student-subject-card">
                                <div className="student-subject-header">
                                    <div className="stat-icon">
                                        <FaBook />
                                    </div>

                                    <span className="student-subject-code">
                                        {subject.subject_code}
                                    </span>
                                </div>

                                <h3 className="student-subject-name">
                                    {subject.subject_name}
                                </h3>

                                <p className="student-subject-description">
                                    {subject.description ||
                                        'No description available.'}
                                </p>

                                <div className="student-subject-meta">
                                    <div>
                                        <FaGraduationCap />
                                        <span>
                                            Semester {subject.semester}
                                        </span>
                                    </div>

                                    <div>
                                        <FaBook />
                                        <span>
                                            {subject.credits} Credits
                                        </span>
                                    </div>

                                    <div>
                                        <FaChalkboardTeacher />
                                        <span>
                                            {subject.lecturer
                                                ?.full_name ??
                                                'Lecturer not assigned'}
                                        </span>
                                    </div>
                                </div>

                                {subject.lecturer?.department && (
                                    <div className="student-subject-department">
                                        {
                                            subject.lecturer
                                                .department
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default StudentMySubjects;