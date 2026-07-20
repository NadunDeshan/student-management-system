import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    FaEye,
    FaPen,
    FaPlus,
    FaSearch,
    FaTrash,
} from 'react-icons/fa';

import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
    deleteLecturer,
    getLecturers,
} from '../../api/lecturerApi';

import Loading from '../../components/Loading';
import DocumentTitle from "../../hooks/DocumentTitle.js";

function LecturerList() {
    const [lecturers, setLecturers] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    DocumentTitle('Lecturers List');

    /**
     * Load lecturers from the Laravel API.
     */
    const loadLecturers = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const result = await getLecturers(search, page);

            setLecturers(result.data ?? []);
            setMeta(result.meta ?? null);
        } catch (requestError) {
            console.error(requestError);

            setError(
                'Unable to load lecturers from the server.'
            );
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => {
        loadLecturers();
    }, [loadLecturers]);

    /**
     * Submit lecturer search.
     */
    const handleSearch = (event) => {
        event.preventDefault();

        setPage(1);
        setSearch(searchInput.trim());
    };

    /**
     * Clear the current search.
     */
    const clearSearch = () => {
        setSearchInput('');
        setSearch('');
        setPage(1);
    };

    /**
     * Delete lecturer after confirmation.
     */
    const handleDelete = async (lecturer) => {
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
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Lecture deleted successfully.",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: "rgb(135 227 169)",
                color: "#1f2937",
                iconColor: "rgb(7 117 48)",
                width: "350px",
            });

            /*
             * If the final item on the current page was deleted,
             * return to the previous page.
             */
            if (lecturers.length === 1 && page > 1) {
                setPage((currentPage) => currentPage - 1);
                return;
            }

            await loadLecturers();
        } catch (requestError) {
            console.error(requestError);

            const message =
                requestError.response?.data?.message ??
                'The lecturer could not be deleted.';

            Swal.fire(
                'Delete failed',
                message,
                'error'
            );
        }
    };

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Lecturers
                    </h1>

                    <p className="page-subtitle">
                        Create, search, view, update and delete
                        lecturer records.
                    </p>
                </div>

                <Link
                    to="/admin/lecturers/create"
                    className="btn btn-system"
                >
                    <FaPlus className="me-2" />
                    Add Lecturer
                </Link>
            </div>

            <div className="content-card">
                <div className="p-3 border-bottom">
                    <form
                        className="row g-2"
                        onSubmit={handleSearch}
                    >
                        <div className="col-md-8 col-lg-5">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaSearch />
                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search number, name, email, department or specialization"
                                    value={searchInput}
                                    onChange={(event) =>
                                        setSearchInput(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-auto">
                            <button
                                type="submit"
                                className="btn btn-system"
                            >
                                Search
                            </button>
                        </div>

                        {search && (
                            <div className="col-auto">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={clearSearch}
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {loading ? (
                    <Loading message="Loading lecturers..." />
                ) : error ? (
                    <div className="alert alert-danger m-3">
                        {error}

                        <div className="mt-3">
                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={loadLecturers}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : lecturers.length === 0 ? (
                    <div className="text-center py-5">
                        <h5>No lecturers found</h5>

                        <p className="text-muted">
                            Add your first lecturer or change the
                            search text.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Lecturer No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Specialization</th>
                                    <th>Status</th>
                                    <th className="text-end">
                                        Actions
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                {lecturers.map((lecturer) => (
                                    <tr key={lecturer.id}>
                                        <td>
                                            {lecturer.profile_image_url ? (
                                                <img
                                                    src={
                                                        lecturer.profile_image_url
                                                    }
                                                    alt={
                                                        lecturer.full_name
                                                    }
                                                    className="student-image"
                                                />
                                            ) : (
                                                <div className="student-image-placeholder">
                                                    {lecturer.first_name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                        </td>

                                        <td>
                                            <strong>
                                                {
                                                    lecturer.lecturer_number
                                                }
                                            </strong>
                                        </td>

                                        <td>
                                            {lecturer.full_name}
                                        </td>

                                        <td>
                                            {lecturer.email}
                                        </td>

                                        <td>
                                            {lecturer.department}
                                        </td>

                                        <td>
                                            {lecturer.specialization ||
                                                'Not provided'}
                                        </td>

                                        <td>
                                                <span
                                                    className={`badge ${
                                                        lecturer.status ===
                                                        'active'
                                                            ? 'text-bg-success'
                                                            : 'text-bg-secondary'
                                                    }`}
                                                >
                                                    {lecturer.status}
                                                </span>
                                        </td>

                                        <td className="text-end text-nowrap">
                                            <Link
                                                to={`/admin/lecturers/${lecturer.id}`}
                                                className="btn btn-sm btn-outline-primary me-2"
                                                title="View lecturer"
                                            >
                                                <FaEye />
                                            </Link>

                                            <Link
                                                to={`/admin/lecturers/${lecturer.id}/edit`}
                                                className="btn btn-sm btn-outline-warning me-2"
                                                title="Edit lecturer"
                                            >
                                                <FaPen />
                                            </Link>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                title="Delete lecturer"
                                                onClick={() =>
                                                    handleDelete(
                                                        lecturer
                                                    )
                                                }
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {meta && meta.last_page > 1 && (
                            <div className="d-flex align-items-center justify-content-between p-3 border-top">
                                <small className="text-muted">
                                    Page {meta.current_page} of{' '}
                                    {meta.last_page}
                                </small>

                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary me-2"
                                        disabled={
                                            meta.current_page === 1
                                        }
                                        onClick={() =>
                                            setPage((currentPage) =>
                                                Math.max(
                                                    currentPage - 1,
                                                    1
                                                )
                                            )
                                        }
                                    >
                                        Previous
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        disabled={
                                            meta.current_page ===
                                            meta.last_page
                                        }
                                        onClick={() =>
                                            setPage((currentPage) =>
                                                currentPage + 1
                                            )
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default LecturerList;