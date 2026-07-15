import {
    useEffect,
    useState,
} from 'react';

import {
    FaPen,
    FaTrash,
} from 'react-icons/fa';

import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';

import Swal from 'sweetalert2';

import {
    deleteLecturer,
    getLecturer,
} from '../../api/lecturerApi';

import Loading from '../../components/Loading';

function LecturerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [lecturer, setLecturer] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    /**
     * Load the selected lecturer.
     */
    useEffect(() => {
        let ignore = false;

        const loadLecturer = async () => {
            try {
                setLoading(true);
                setError('');

                const result = await getLecturer(id);

                if (!ignore) {
                    setLecturer(result.data);
                }
            } catch (requestError) {
                console.error(requestError);

                if (!ignore) {
                    setError(
                        requestError.response?.status === 404
                            ? 'Lecturer not found.'
                            : 'Lecturer could not be loaded.'
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadLecturer();

        return () => {
            ignore = true;
        };
    }, [id]);

    /**
     * Format an API date into a readable value.
     */
    const formatDate = (dateValue) => {
        if (!dateValue) {
            return 'Not provided';
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleDateString();
    };

    /**
     * Delete the selected lecturer.
     */
    const handleDelete = async () => {
        if (!lecturer) {
            return;
        }

        const confirmation = await Swal.fire({
            title: 'Delete lecturer?',
            text: `${lecturer.full_name} will be permanently deleted.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545',
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        try {
            await deleteLecturer(lecturer.id);

            await Swal.fire({
                title: 'Deleted',
                text: 'Lecturer deleted successfully.',
                icon: 'success',
                timer: 1600,
                showConfirmButton: false,
            });

            navigate('/admin/lecturers');
        } catch (requestError) {
            console.error(requestError);

            const message =
                requestError.response?.data?.message ??
                'Unable to delete the lecturer.';

            Swal.fire(
                'Delete failed',
                message,
                'error'
            );
        }
    };

    if (loading) {
        return (
            <Loading message="Loading lecturer..." />
        );
    }

    if (error || !lecturer) {
        return (
            <div className="content-card p-4">
                <div className="alert alert-danger mb-3">
                    {error || 'Lecturer not found.'}
                </div>

                <Link
                    to="/admin/lecturers"
                    className="btn btn-outline-secondary"
                >
                    Back to Lecturers
                </Link>
            </div>
        );
    }

    const details = [
        [
            'Lecturer number',
            lecturer.lecturer_number,
        ],
        [
            'Full name',
            lecturer.full_name,
        ],
        [
            'Email',
            lecturer.email,
        ],
        [
            'Phone number',
            lecturer.phone_number || 'Not provided',
        ],
        [
            'Address',
            lecturer.address || 'Not provided',
        ],
        [
            'Department',
            lecturer.department,
        ],
        [
            'Specialization',
            lecturer.specialization || 'Not provided',
        ],
        [
            'Hire date',
            formatDate(lecturer.hire_date),
        ],
        [
            'Status',
            lecturer.status,
        ],
        [
            'Created at',
            formatDate(lecturer.created_at),
        ],
        [
            'Updated at',
            formatDate(lecturer.updated_at),
        ],
    ];

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Lecturer Details
                    </h1>

                    <p className="page-subtitle">
                        View the lecturer's complete information.
                    </p>
                </div>

                <div>
                    <Link
                        to="/admin/lecturers"
                        className="btn btn-outline-secondary me-2"
                    >
                        Back
                    </Link>

                    <Link
                        to={`/admin/lecturers/${lecturer.id}/edit`}
                        className="btn btn-system me-2"
                    >
                        <FaPen className="me-2" />
                        Edit
                    </Link>

                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={handleDelete}
                    >
                        <FaTrash className="me-2" />
                        Delete
                    </button>
                </div>
            </div>

            <div className="content-card p-4">
                <div className="text-center mb-4">
                    {lecturer.profile_image_url ? (
                        <img
                            src={
                                lecturer.profile_image_url
                            }
                            alt={lecturer.full_name}
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
                            {lecturer.first_name
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>
                    )}

                    <h3 className="mt-3 mb-1">
                        {lecturer.full_name}
                    </h3>

                    <p className="text-muted mb-2">
                        {lecturer.department}
                    </p>

                    <span
                        className={`badge ${
                            lecturer.status === 'active'
                                ? 'text-bg-success'
                                : 'text-bg-secondary'
                        }`}
                    >
                        {lecturer.status}
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

                                <div
                                    className={`fw-semibold mt-1 ${
                                        label === 'Status'
                                            ? 'text-capitalize'
                                            : ''
                                    }`}
                                >
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

export default LecturerDetails;