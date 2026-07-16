import { useCallback, useEffect, useState } from 'react';
import DocumentTitle from "../../hooks/DocumentTitle.js";
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
    deleteStudent,
    getStudents,
} from '../../api/studentApi';
import Loading from '../../components/Loading';

function StudentList() {
    const [students, setStudents] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');



    const loadStudents = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const result = await getStudents(search, page);

            setStudents(result.data);
            setMeta(result.meta);
        } catch (requestError) {
            console.error(requestError);

            setError('Unable to load students.');
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    };

    const clearSearch = () => {
        setSearchInput('');
        setSearch('');
        setPage(1);
    };

    const handleDelete = async (student) => {
        const result = await Swal.fire({
            title: 'Delete student?',
            text: `${student.full_name} will be permanently deleted.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await deleteStudent(student.id);

            await Swal.fire({
                title: 'Deleted',
                text: 'Student deleted successfully.',
                icon: 'success',
                timer: 1600,
                showConfirmButton: false,
            });

            loadStudents();
        } catch (requestError) {
            console.error(requestError);

            Swal.fire(
                'Delete failed',
                'The student could not be deleted.',
                'error'
            );
        }
    };
    DocumentTitle('Student List');

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Students</h1>

                    <p className="page-subtitle">
                        Create, search, view, edit and delete
                        student records.
                    </p>
                </div>

                <Link
                    to="/admin/students/create"
                    className="btn btn-system"
                >
                    <FaPlus className="me-2" />
                    Add Student
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
                                    placeholder="Search name, number, email or course"
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
                    <Loading message="Loading students..." />
                ) : error ? (
                    <div className="alert alert-danger m-3">
                        {error}
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-5">
                        <h5>No students found</h5>

                        <p className="text-muted">
                            Add your first student or change the
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
                                    <th>Student No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Course</th>
                                    <th>Status</th>
                                    <th className="text-end">
                                        Actions
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td>
                                            {student.profile_image_url ? (
                                                <img
                                                    src={
                                                        student.profile_image_url
                                                    }
                                                    alt={
                                                        student.full_name
                                                    }
                                                    className="student-image"
                                                />
                                            ) : (
                                                <div className="student-image-placeholder">
                                                    {student.first_name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                        </td>

                                        <td>
                                            <strong>
                                                {
                                                    student.student_number
                                                }
                                            </strong>
                                        </td>

                                        <td>{student.full_name}</td>
                                        <td>{student.email}</td>
                                        <td>{student.course}</td>

                                        <td>
                                                <span
                                                    className={`badge ${
                                                        student.status ===
                                                        'active'
                                                            ? 'text-bg-success'
                                                            : 'text-bg-secondary'
                                                    }`}
                                                >
                                                    {student.status}
                                                </span>
                                        </td>

                                        <td className="text-end text-nowrap">
                                            <Link
                                                to={`/admin/students/${student.id}`}
                                                className="btn btn-sm btn-outline-primary me-2"
                                                title="View student"
                                            >
                                                <FaEye />
                                            </Link>

                                            <Link
                                                to={`/admin/students/${student.id}/edit`}
                                                className="btn btn-sm btn-outline-warning me-2"
                                                title="Edit student"
                                            >
                                                <FaPen />
                                            </Link>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                title="Delete student"
                                                onClick={() =>
                                                    handleDelete(
                                                        student
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
                                            setPage((current) =>
                                                Math.max(
                                                    current - 1,
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
                                            setPage((current) =>
                                                current + 1
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

export default StudentList;