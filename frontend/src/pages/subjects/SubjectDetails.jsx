import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    FaArrowLeft,
    FaBook,
    FaChalkboardTeacher,
    FaPen,
} from 'react-icons/fa';

import { getSubject } from '../../api/subjectApi';
import Loading from '../../components/Loading';
import DocumentTitle from '../../hooks/DocumentTitle.js';

function SubjectDetails() {
    const { id } = useParams();

    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    DocumentTitle('Subject Details');

    useEffect(() => {
        const loadSubject = async () => {
            try {
                setLoading(true);
                setError('');

                const result = await getSubject(id);

                setSubject(result.data);
            } catch (requestError) {
                console.error(requestError);

                if (requestError.response?.status === 404) {
                    setError('Subject not found.');
                } else {
                    setError('Unable to load the subject.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadSubject();
    }, [id]);

    if (loading) {
        return <Loading message="Loading subject..." />;
    }

    if (error || !subject) {
        return (
            <div className="content-card p-4">
                <div className="alert alert-danger mb-3">
                    {error || 'Subject not found.'}
                </div>

                <Link
                    to="/admin/subjects"
                    className="btn btn-outline-light"
                >
                    <FaArrowLeft className="me-2" />
                    Back to Subjects
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Subject Details
                    </h1>

                    <p className="page-subtitle">
                        View the selected subject information.
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <Link
                        to="/admin/subjects"
                        className="btn btn-outline-light"
                    >
                        <FaArrowLeft className="me-2" />
                        Back
                    </Link>

                    <Link
                        to={`/admin/subjects/${subject.id}/edit`}
                        className="btn btn-system"
                    >
                        <FaPen className="me-2" />
                        Edit Subject
                    </Link>
                </div>
            </div>

            <div className="content-card">
                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="stat-card h-100">
                            <div className="stat-icon">
                                <FaBook />
                            </div>

                            <h3 className="mt-3 mb-2">
                                {subject.subject_code}
                            </h3>

                            <p className="stext mb-0">
                                {subject.subject_name}
                            </p>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="dashboard-panel h-100">
                            <h4 className="mb-4">
                                Subject Information
                            </h4>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="student-profile-field">
                                        <span>Subject Code</span>

                                        <strong>
                                            {subject.subject_code}
                                        </strong>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="student-profile-field">
                                        <span>Subject Name</span>

                                        <strong>
                                            {subject.subject_name}
                                        </strong>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="student-profile-field">
                                        <span>Credits</span>

                                        <strong>
                                            {subject.credits}
                                        </strong>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="student-profile-field">
                                        <span>Semester</span>

                                        <strong>
                                            Semester {subject.semester}
                                        </strong>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="student-profile-field">
                                        <span>Description</span>

                                        <strong>
                                            {subject.description || '-'}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="dashboard-panel">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="stat-icon">
                                    <FaChalkboardTeacher />
                                </div>

                                <div>
                                    <h4 className="mb-1">
                                        Assigned Lecturer
                                    </h4>

                                    <p className="stext mb-0">
                                        Lecturer responsible for this subject.
                                    </p>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="student-profile-field">
                                        <span>Lecturer Name</span>

                                        <strong>
                                            {subject.lecturer?.full_name ?? '-'}
                                        </strong>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="student-profile-field">
                                        <span>Lecturer Number</span>

                                        <strong>
                                            {subject.lecturer
                                                ?.lecturer_number ?? '-'}
                                        </strong>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="student-profile-field">
                                        <span>Department</span>

                                        <strong>
                                            {subject.lecturer
                                                ?.department ?? '-'}
                                        </strong>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="student-profile-field">
                                        <span>Specialization</span>

                                        <strong>
                                            {subject.lecturer
                                                ?.specialization ?? '-'}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SubjectDetails;