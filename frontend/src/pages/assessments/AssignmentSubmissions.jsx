import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaDownload,
  FaFileAlt,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";

import api from "../../api/axios";
import Loading from "../../components/Loading";
import DocumentTitle from "../../hooks/DocumentTitle.js";

function AssignmentSubmissions() {
  const { id } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [students, setStudents] = useState([]);

  const [summary, setSummary] = useState({
    total_students: 0,
    submitted_count: 0,
    not_submitted_count: 0,
    graded_count: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  DocumentTitle("Assignment Submissions");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}",
  );

  const basePath =
    user.role === "lecturer"
      ? "/lecturer/assessments"
      : "/admin/assessments";

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/assessments/${id}/submissions`,
        );

        setAssessment(response.data.assessment);
        setStudents(response.data.students ?? []);

        setSummary(
          response.data.summary ?? {
            total_students: 0,
            submitted_count: 0,
            not_submitted_count: 0,
            graded_count: 0,
          },
        );
      } catch (requestError) {
        console.error(requestError);

        if (requestError.response?.status === 404) {
          setError("Assignment not found.");
        } else if (
          requestError.response?.status === 403
        ) {
          setError(
            requestError.response?.data?.message ??
              "You cannot view these submissions.",
          );
        } else if (
          requestError.response?.status === 422
        ) {
          setError(
            requestError.response?.data?.message ??
              "This assessment is not an assignment.",
          );
        } else {
          setError(
            "Unable to load assignment submissions.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [id]);

  const formatDateTime = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  if (loading) {
    return (
      <Loading message="Loading submissions..." />
    );
  }

  if (error || !assessment) {
    return (
      <div className="content-card p-4">
        <div className="alert alert-danger mb-3">
          {error || "Assignment not found."}
        </div>

        <Link
          to={basePath}
          className="btn btn-outline-light"
        >
          <FaArrowLeft className="me-2" />
          Back to Assessments
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Assignment Submissions
          </h1>

          <p className="page-subtitle">
            {assessment.subject?.subject_code}
            {" - "}
            {assessment.title}
          </p>
        </div>

        <Link
          to={`${basePath}/${id}`}
          className="btn btn-outline-light"
        >
          <FaArrowLeft className="me-2" />
          Back
        </Link>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>

            <h3 className="stat-number">
              {summary.total_students}
            </h3>

            <span className="stext">
              Registered Students
            </span>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon">
              <FaCheckCircle />
            </div>

            <h3 className="stat-number">
              {summary.submitted_count}
            </h3>

            <span className="stext">
              Submitted
            </span>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon">
              <FaTimesCircle />
            </div>

            <h3 className="stat-number">
              {summary.not_submitted_count}
            </h3>

            <span className="stext">
              Not Submitted
            </span>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon">
              <FaFileAlt />
            </div>

            <h3 className="stat-number">
              {summary.graded_count}
            </h3>

            <span className="stext">
              Graded
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
              No students are registered for this
              assignment subject.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student Number</th>
                  <th>Course</th>
                  <th>Submission</th>
                  <th>Submitted At</th>
                  <th>Marks</th>
                  <th className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => {
                  const submission =
                    student.submission;

                  return (
                    <tr key={student.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {student.profile_image_url ? (
                            <img
                              src={
                                student.profile_image_url
                              }
                              alt={student.full_name}
                              className="student-image"
                            />
                          ) : (
                            <div className="student-image-placeholder">
                              {student.full_name
                                ?.charAt(0)
                                ?.toUpperCase() || "S"}
                            </div>
                          )}

                          <div>
                            <strong>
                              {student.full_name}
                            </strong>

                            <div className="small">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <strong>{student.student_number}</strong>
                      </td>

                      <td>
                        {student.course || "-"}
                      </td>

                      <td>
                        {student.has_submitted ? (
                          <span
                            className={`badge ${
                              submission?.status ===
                              "graded"
                                ? "bg-success"
                                : "bg-primary"
                            }`}
                          >
                            {submission?.status ===
                            "graded"
                              ? "Graded"
                              : "Submitted"}
                          </span>
                        ) : (
                          <span className="badge bg-secondary">
                            Not Submitted
                          </span>
                        )}
                      </td>

                      <td>
                        {submission
                          ? formatDateTime(
                              submission.submitted_at,
                            )
                          : "-"}
                      </td>

                      <td>
                        {submission?.marks !== null &&
                        submission?.marks !== undefined
                          ? `${submission.marks} / ${assessment.total_marks}`
                          : "-"}
                      </td>

                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          {submission
                            ?.submission_file_url && (
                            <a
                              href={
                                submission.submission_file_url
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-info"
                              title="Open submission"
                            >
                              <FaDownload />
                            </a>
                          )}

                          {student.has_submitted && (
                            <Link
                              to={`${basePath}/${id}/submissions/${submission.id}/grade`}
                              className="btn btn-sm btn-outline-warning"
                            >
                              {submission.status ===
                              "graded"
                                ? "Edit Grade"
                                : "Grade"}
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default AssignmentSubmissions;