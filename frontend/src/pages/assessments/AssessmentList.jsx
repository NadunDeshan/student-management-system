import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaFileAlt,
  FaPen,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUsers,
} from "react-icons/fa";
import Swal from "sweetalert2";

import { deleteAssessment, getAssessments } from "../../api/assessmentApi";

import Loading from "../../components/Loading";
import DocumentTitle from "../../hooks/DocumentTitle.js";

function AssessmentList() {
  const [assessments, setAssessments] = useState([]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  DocumentTitle("Assessments");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const basePath =
    user.role === "lecturer" ? "/lecturer/assessments" : "/admin/assessments";

  const loadAssessments = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAssessments(search, type, status, page);

      setAssessments(result.data ?? []);

      setPagination({
        current_page: result.meta?.current_page ?? 1,

        last_page: result.meta?.last_page ?? 1,

        total: result.meta?.total ?? 0,
      });
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ?? "Unable to load assessments.",
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
  }, [search, type, status, page]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const formatType = (assessmentType) => {
    const labels = {
      written_exam: "Written Exam",
      assignment: "Assignment",
      mcq: "MCQ Quiz",
    };

    return labels[assessmentType] ?? assessmentType;
  };

  const getTypeBadgeClass = (assessmentType) => {
    const classes = {
      written_exam: "bg-primary",
      assignment: "bg-warning text-dark",
      mcq: "bg-info text-dark",
    };

    return classes[assessmentType] ?? "bg-secondary";
  };

  const getStatusBadgeClass = (assessmentStatus) => {
    const classes = {
      draft: "bg-secondary",
      published: "bg-success",
      closed: "bg-dark",
      cancelled: "bg-danger",
    };

    return classes[assessmentStatus] ?? "bg-secondary";
  };

  const handleDelete = async (assessment) => {
    const result = await Swal.fire({
      title: "Delete assessment?",
      text: assessment.title,
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
      await deleteAssessment(assessment.id);

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Assessment deleted successfully.",
        showConfirmButton: false,
        timer: 1600,
        timerProgressBar: true,
        background: "rgb(135 227 169)",
        color: "#1f2937",
        iconColor: "rgb(7 117 48)",
        width: "350px",
      });

      if (assessments.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        loadAssessments();
      }
    } catch (requestError) {
      console.error(requestError);

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title:
          requestError.response?.data?.message ??
          "Unable to delete the assessment.",
        showConfirmButton: false,
        timer: 1900,
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
          <h1 className="page-title">Assessments</h1>

          <p className="page-subtitle">
            Manage written exams, assignments, and MCQ quizzes.
          </p>
        </div>

        <Link to={`${basePath}/create`} className="btn btn-system">
          <FaPlus className="me-2" />
          Create Assessment
        </Link>
      </div>

      <div className="content-card">
        <div className="row g-3 mb-4">
          <div className="col-lg-5">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>

              <input
                type="text"
                className="form-control"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search title or subject"
              />
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <select
              className="form-select"
              value={type}
              onChange={handleTypeChange}
            >
              <option value="">All Types</option>

              <option value="written_exam">Written Exam</option>

              <option value="assignment">Assignment</option>

              <option value="mcq">MCQ Quiz</option>
            </select>
          </div>

          <div className="col-md-6 col-lg-2">
            <select
              className="form-select"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="">All Statuses</option>

              <option value="draft">Draft</option>

              <option value="published">Published</option>

              <option value="closed">Closed</option>

              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-lg-2 d-flex align-items-center justify-content-lg-end">
            <span className="stext">Total: {pagination.total}</span>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <Loading message="Loading assessments..." />
        ) : assessments.length === 0 ? (
          <div className="text-center py-5">
            <div className="stat-icon mx-auto mb-3">
              <FaFileAlt />
            </div>

            <h4 className="stext">No assessments found</h4>

            <p className="page-subtitle mb-0">
              Create an assessment or change your search filters.
            </p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Type</th>
                    <th>Total Marks</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {assessments.map((assessment) => (
                    <tr key={assessment.id}>
                      <td>
                        <strong>{assessment.title}</strong>
                      </td>

                      <td>
                        <div>
                          <strong>{assessment.subject?.subject_code} | </strong>
                          {assessment.subject?.subject_name}

                          {/* <div className=" ">
                                                           
                                                        </div> */}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge ${getTypeBadgeClass(
                            assessment.type,
                          )}`}
                        >
                          {formatType(assessment.type)}
                        </span>
                      </td>

                      <td>{assessment.total_marks}</td>

                      <td>
                        <span
                          className={`badge text-capitalize ${getStatusBadgeClass(
                            assessment.status,
                          )}`}
                        >
                          {assessment.status}
                        </span>
                      </td>

                      <td>{assessment.creator?.name ?? "-"}</td>

                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          {assessment.type === "assignment" && (
                            <Link
                              to={`${basePath}/${assessment.id}/submissions`}
                              className="btn btn-outline-success btn-sm"
                            >
                              <FaUsers className="me-2" />
                              <strong>{"  "}View Submissions</strong>
                            </Link>
                          )}
                          {assessment.type === "mcq" && (
                                      <Link
                                        to={`${basePath}/${assessment.id}/quiz-attempts`}
                                        className="btn btn-outline-dark btn-sm"
                                      >
                                        
                                       <strong> <FaUsers className="me-2" />Results</strong>
                                      </Link>
                                    )}
                          {assessment.type === "mcq" && (
                                      <Link
                                        to={`${basePath}/${assessment.id}/questions`}
                                        className="btn btn-outline-success btn-sm"
                                      >
                                        <FaFileAlt className="me-2" />
                                        <strong>Manage Questions</strong>
                                      </Link>
                                    )}
                          <Link
                            to={`${basePath}/${assessment.id}`}
                            className="btn btn-sm btn-outline-info"
                            title="View assessment"
                          >
                            <FaEye />
                          </Link>

                          <Link
                            to={`${basePath}/${assessment.id}/edit`}
                            className="btn btn-sm btn-outline-warning"
                            title="Edit assessment"
                          >
                            <FaPen />
                          </Link>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Delete assessment"
                            onClick={() => handleDelete(assessment)}
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

export default AssessmentList;
