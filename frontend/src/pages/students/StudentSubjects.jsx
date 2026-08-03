import { useEffect, useState } from 'react';
import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    FaArrowLeft,
    FaBook,
    FaSave,
} from 'react-icons/fa';

import {
    getStudentSubjects,
    updateStudentSubjects,
} from '../../api/studentApi';

import Loading from '../../components/Loading';
import DocumentTitle from '../../hooks/DocumentTitle.js';

function StudentSubjects() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectIds, setSelectedSubjectIds] =
        useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    DocumentTitle('Assign Student Subjects');

    useEffect(() => {
        const loadStudentSubjects = async () => {
            try {
                setLoading(true);
                setError('');

                const result =
                    await getStudentSubjects(id);

                setStudent(result.student);
                setSubjects(result.subjects ?? []);

                setSelectedSubjectIds(
                    (result.registered_subject_ids ?? [])
                        .map(Number)
                );
            } catch (requestError) {
                console.error(requestError);

                if (
                    requestError.response?.status === 404
                ) {
                    setError('Student not found.');
                } else {
                    setError(
                        'Unable to load student subjects.'
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadStudentSubjects();
    }, [id]);

    const handleSubjectChange = (subjectId) => {
        const numericId = Number(subjectId);

        setSelectedSubjectIds((current) => {
            if (current.includes(numericId)) {
                return current.filter(
                    (id) => id !== numericId
                );
            }

            return [...current, numericId];
        });
    };

    const handleSelectAll = () => {
        if (
            selectedSubjectIds.length === subjects.length
        ) {
            setSelectedSubjectIds([]);
            return;
        }

        setSelectedSubjectIds(
            subjects.map((subject) =>
                Number(subject.id)
            )
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);

            await updateStudentSubjects(
                id,
                selectedSubjectIds
            );

            await Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title:
                    'Student subjects updated successfully.',
                showConfirmButton: false,
                timer: 1600,
                timerProgressBar: true,
                background: 'rgb(135 227 169)',
                color: '#1f2937',
                iconColor: 'rgb(7 117 48)',
                width: '350px',
            });

            navigate(`/admin/students/${id}`);
        } catch (requestError) {
            console.error(requestError);

            await Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title:
                    requestError.response?.data?.message ??
                    'Unable to update student subjects.',
                showConfirmButton: false,
                timer: 1800,
                timerProgressBar: true,
                background: '#fee2e2',
                color: '#7f1d1d',
                iconColor: '#dc2626',
                width: '350px',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Loading message="Loading student subjects..." />
        );
    }

    if (error || !student) {
        return (
            <div className="content-card p-4">
                <div className="alert alert-danger mb-3">
                    {error || 'Student not found.'}
                </div>

                <Link
                    to="/admin/students"
                    className="btn btn-outline-light"
                >
                    <FaArrowLeft className="me-2" />
                    Back to Students
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Assign Subjects
                    </h1>

                    <p className="page-subtitle">
                        Select subjects for{' '}
                        {student.full_name}.
                    </p>
                </div>

                <Link
                    to={`/admin/students/${id}`}
                    className="btn btn-outline-light"
                >
                    <FaArrowLeft className="me-2" />
                    Cancel
                </Link>
            </div>

            <div className="content-card p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <div>
                        <h4 className="stext mb-1">
                            {student.student_number}
                            {' - '}
                            {student.full_name}
                        </h4>

                        <p className="page-subtitle mb-0">
                            Selected subjects:{' '}
                            {selectedSubjectIds.length}
                        </p>
                    </div>

                    {subjects.length > 0 && (
                        <button
                            type="button"
                            className="btn btn-outline-light"
                            onClick={handleSelectAll}
                        >
                            {selectedSubjectIds.length ===
                            subjects.length
                                ? 'Clear All'
                                : 'Select All'}
                        </button>
                    )}
                </div>

                {subjects.length === 0 ? (
                    <div className="alert alert-warning mb-0">
                        No subjects are available. Create subjects
                        before assigning them to students.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            {subjects.map((subject) => {
                                const subjectId = Number(
                                    subject.id
                                );

                                const isSelected =
                                    selectedSubjectIds.includes(
                                        subjectId
                                    );

                                return (
                                    <div
                                        className="col-md-6 col-xl-4"
                                        key={subject.id}
                                    >
                                        <label
                                            className={`subject-selection-card ${
                                                isSelected
                                                    ? 'selected'
                                                    : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="form-check-input subject-selection-checkbox"
                                                checked={isSelected}
                                                onChange={() =>
                                                    handleSubjectChange(
                                                        subjectId
                                                    )
                                                }
                                            />

                                            <div className="subject-selection-icon">
                                                <FaBook />
                                            </div>

                                            <div className="subject-selection-content">
                                                <strong>
                                                    {
                                                        subject.subject_code
                                                    }
                                                </strong>

                                                <h5>
                                                    {
                                                        subject.subject_name
                                                    }
                                                </h5>

                                                <p>
                                                    Semester{' '}
                                                    {
                                                        subject.semester
                                                    }
                                                    {' • '}
                                                    {
                                                        subject.credits
                                                    }{' '}
                                                    Credits
                                                </p>

                                                <small>
                                                    Lecturer:{' '}
                                                    {subject
                                                        .lecturer
                                                        ?.full_name ??
                                                        'Not assigned'}
                                                </small>
                                            </div>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
                            <button
                                type="submit"
                                className="btn btn-system px-4"
                                disabled={submitting}
                            >
                                <FaSave className="me-2" />

                                {submitting
                                    ? 'Saving...'
                                    : 'Save Subjects'}
                            </button>

                            <Link
                                to={`/admin/students/${id}`}
                                className="btn btn-outline-light"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

export default StudentSubjects;