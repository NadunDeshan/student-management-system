import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaBook,
    FaCalendarAlt,
    FaEye,
    FaFileAlt,
    FaSearch,
} from 'react-icons/fa';

import api from '../../api/axios';
import Loading from '../../components/Loading';
import DocumentTitle from '../../hooks/DocumentTitle.js';

function StudentMyAssessments() {
    const [assessments, setAssessments] = useState([]);

    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    DocumentTitle('My Assessments');

    const loadAssessments = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get(
                '/student/assessments',
                {
                    params: {
                        search,
                        type,
                        page,
                    },
                }
            );

            setAssessments(response.data.data ?? []);

            setPagination({
                current_page:
                    response.data.meta?.current_page ?? 1,

                last_page:
                    response.data.meta?.last_page ?? 1,

                total:
                    response.data.meta?.total ?? 0,
            });
        } catch (requestError) {
            console.error(requestError);

            setError(
                requestError.response?.data?.message ??
                'Unable to load your assessments.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadAssessments();
        }, 400);

        return () => clearTimeout(timer);
    }, [search, type, page]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    const handleTypeChange = (event) => {
        setType(event.target.value);
        setPage(1);
    };

    const formatType = (assessmentType) => {
        const labels = {
            written_exam: 'Written Exam',
            assignment: 'Assignment',
            mcq: 'MCQ Quiz',
        };

        return labels[assessmentType] ?? assessmentType;
    };

    const getTypeBadgeClass = (assessmentType) => {
        const classes = {
            written_exam: 'bg-primary',
            assignment: 'bg-warning text-dark',
            mcq: 'bg-info text-dark',
        };

        return classes[assessmentType] ?? 'bg-secondary';
    };

    const getStatusBadgeClass = (assessmentStatus) => {
        const classes = {
            published: 'bg-success',
            closed: 'bg-dark',
        };

        return classes[assessmentStatus] ?? 'bg-secondary';
    };

    const formatDateTime = (value) => {
        if (!value) {
            return '-';
        }

        return new Date(value).toLocaleString(
            'en-GB',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }
        );
    };

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        My Assessments
                    </h1>

                    <p className="page-subtitle">
                        View assessments from your registered subjects.
                    </p>
                </div>
            </div>

            <div className="content-card">
                <div className="row g-3 mb-4">
                    <div className="col-lg-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <FaSearch />
                            </span>

                            <input
                                type="text"
                                className="form-control"
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search assessment or subject"
                            />
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <select
                            className="form-select"
                            value={type}
                            onChange={handleTypeChange}
                        >
                            <option value="">
                                All Types
                            </option>

                            <option value="written_exam">
                                Written Exam
                            </option>

                            <option value="assignment">
                                Assignment
                            </option>

                            <option value="mcq">
                                MCQ Quiz
                            </option>
                        </select>
                    </div>

                    <div className="col-md-6 col-lg-3 d-flex align-items-center justify-content-lg-end">
                        <span className="stext">
                            Total: {pagination.total}
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {loading ? (
                    <Loading message="Loading assessments..." />
                ) : assessments.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="stat-icon mx-auto mb-3">
                            <FaFileAlt />
                        </div>

                        <h4 className="stext">
                            No assessments available
                        </h4>

                        <p className="page-subtitle mb-0">
                            No published assessments are available
                            for your registered subjects.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="row g-4">
                            {assessments.map((assessment) => (
                                <div
                                    className="col-md-6 col-xl-4"
                                    key={assessment.id}
                                >
                                    <div className="student-assessment-card">
                                        <div className="student-assessment-header">
                                            <div className="stat-icon">
                                                <FaFileAlt />
                                            </div>

                                            <span
                                                className={`badge ${getTypeBadgeClass(
                                                    assessment.type
                                                )}`}
                                            >
                                                {formatType(
                                                    assessment.type
                                                )}
                                            </span>
                                        </div>

                                        <h3 className="student-assessment-title">
                                            {assessment.title}
                                        </h3>

                                        <div className="student-assessment-subject">
                                            <FaBook />

                                            <span>
                                                {assessment.subject
                                                    ?.subject_code ?? '-'}
                                                {' - '}
                                                {assessment.subject
                                                    ?.subject_name ?? '-'}
                                            </span>
                                        </div>

                                        <p className="student-assessment-description">
                                            {assessment.description ||
                                                'No description available.'}
                                        </p>

                                        <div className="student-assessment-meta">
                                            <div>
                                                <FaCalendarAlt />

                                                <span>
                                                    Available:{' '}
                                                    {formatDateTime(
                                                        assessment.available_from
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <FaCalendarAlt />

                                                <span>
                                                    Due:{' '}
                                                    {formatDateTime(
                                                        assessment.due_date
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center gap-3 mt-4">
                                            <span
                                                className={`badge text-capitalize ${getStatusBadgeClass(
                                                    assessment.status
                                                )}`}
                                            >
                                                {assessment.status}
                                            </span>

                                            <strong className="stext">
                                                {assessment.total_marks}
                                                {' marks'}
                                            </strong>
                                        </div>

                                        <Link
                                            to={`/student/assessments/${assessment.id}`}
                                            className="btn btn-system w-100 mt-4"
                                        >
                                            <FaEye className="me-2" />
                                            View Assessment
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4">
                            <span className="stext">
                                Page {pagination.current_page} of{' '}
                                {pagination.last_page}
                            </span>

                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    disabled={
                                        pagination.current_page <= 1
                                    }
                                    onClick={() =>
                                        setPage((current) =>
                                            Math.max(1, current - 1)
                                        )
                                    }
                                >
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    disabled={
                                        pagination.current_page >=
                                        pagination.last_page
                                    }
                                    onClick={() =>
                                        setPage((current) =>
                                            current + 1
                                        )
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default StudentMyAssessments;