import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaPen, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

import { deleteSubject, getSubjects } from "../../api/subjectApi";

import Loading from "../../components/Loading";
import DocumentTitle from "../../hooks/DocumentTitle.js";

function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  DocumentTitle("Subjects");

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getSubjects(search, page);

      setSubjects(result.data ?? []);

      setPagination({
        current_page: result.meta?.current_page ?? 1,

        last_page: result.meta?.last_page ?? 1,

        total: result.meta?.total ?? 0,
      });
    } catch (requestError) {
      console.error(requestError);

      setError("Unable to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSubjects();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, page]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleDelete = async (subject) => {
    const result = await Swal.fire({
      title: "Delete subject?",
      text: `${subject.subject_code} - ${subject.subject_name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc3545",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteSubject(subject.id);

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "The subject was deleted successfully.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: "rgb(135 227 169)",
        color: "#1f2937",
        iconColor: "rgb(7 117 48)",
        width: "350px",
      });

      /*
       * If the last record on the current page was deleted,
       * move to the previous page.
       */
      if (subjects.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        loadSubjects();
      }
    } catch (requestError) {
      console.error(requestError);

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Unable to delete the subject.",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
        background: "#fee2e2",
        color: "#7f1d1d",
        iconColor: "#dc2626",
        width: "350px",
      });
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Subjects</h1>

          <p className="page-subtitle">
            Manage subjects and assigned lecturers.
          </p>
        </div>

        <Link to="/admin/subjects/create" className="btn btn-system">
          <FaPlus className="me-2" />
          Add Subject
        </Link>
      </div>

      <div className="content-card">
        <div className="row g-3 align-items-center mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>

              <input
                type="text"
                className="form-control"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by code, name or lecturer"
              />
            </div>
          </div>

          <div className="col-md-6 text-md-end">
            <span className="stext">Total subjects: {pagination.total}</span>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <Loading message="Loading subjects..." />
        ) : subjects.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="stext">No subjects found.</h5>

            <p className="page-subtitle">
              Create your first subject or try another search value.
            </p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Subject Name</th>
                    <th>Lecturer</th>
                    <th>Lecturer Department</th>
                    <th>Credits</th>
                    <th>Semester</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject.id}>
                      <td>
                        <strong>{subject.subject_code}</strong>
                      </td>

                      <td><strong>{subject.subject_name}</strong></td>

                      <td>{subject.lecturer?.full_name ?? "-"}</td>

                      <td>
                        <div>
                          <strong>{subject.lecturer?.department ?? "-"} |{" "}</strong>
                           {subject.lecturer?.specialization ?? ""}
                        </div>
                      </td>

                      <td>{subject.credits}</td>

                      <td>Semester {subject.semester}</td>

                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          <Link
                            to={`/admin/subjects/${subject.id}`}
                            className="btn btn-sm btn-outline-info"
                            title="View subject"
                          >
                            <FaEye />
                          </Link>

                          <Link
                            to={`/admin/subjects/${subject.id}/edit`}
                            className="btn btn-sm btn-outline-warning"
                            title="Edit subject"
                          >
                            <FaPen />
                          </Link>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Delete subject"
                            onClick={() => handleDelete(subject)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4">
              <span className="stext">
                Page {pagination.current_page} of {pagination.last_page}
              </span>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-light"
                  disabled={pagination.current_page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </button>

                <button
                  type="button"
                  className="btn btn-outline-light"
                  disabled={pagination.current_page >= pagination.last_page}
                  onClick={() => setPage((current) => current + 1)}
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

export default SubjectList;
