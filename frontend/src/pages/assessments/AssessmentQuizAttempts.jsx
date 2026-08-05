import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaQuestionCircle,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";

import api from "../../api/axios";
import Loading from "../../components/Loading";
import DocumentTitle from "../../hooks/DocumentTitle.js";

function AssessmentQuizAttempts() {
  const { id } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [students, setStudents] = useState([]);

  const [summary, setSummary] = useState({
    total_students: 0,
    attempted_count: 0,
    submitted_count: 0,
    not_attempted_count: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  DocumentTitle("Quiz Results");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}",
  );

  const basePath =
    user.role === "lecturer"
      ? "/lecturer/assessments"
      : "/admin/assessments";

  useEffect(() => {
    const loadQuizAttempts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/assessments/${id}/quiz-attempts`,
        );

        setAssessment(
          response.data.assessment ?? null,
        );

        setStudents(
          response.data.students ?? [],
        );

        setSummary(
          response.data.summary ?? {
            total_students: 0,
            attempted_count: 0,
            submitted_count: 0,
            not_attempted_count: 0,
          },
        );
      } catch (requestError) {
        console.error(requestError);

        if (
          requestError.response?.status === 404
        ) {
          setError("Quiz not found.");
        } else if (
          requestError.response?.status === 403
        ) {
          setError(
            requestError.response?.data?.message ??
              "You cannot view these quiz results.",
          );
        } else if (
          requestError.response?.status === 422
        ) {
          setError(
            requestError.response?.data?.message ??
              "This assessment is not an MCQ quiz.",
          );
        } else {
          setError(
            "Unable to load quiz results.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadQuizAttempts();
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

  const getResultBadgeClass = (percentage) => {
    if (percentage === null) {
      return "bg-secondary";
    }

    if (percentage >= 75) {
      return "bg-success";
    }

    if (percentage >= 50) {
      return "bg-primary";
    }

    return "bg-danger";
  };

  if (loading) {
    return (
      <Loading message="Loading quiz results..." />
    );
  }

  if (error || !assessment) {
    return (
      <div className="content-card p-4">
        <div className="alert alert-danger mb-3">
          {error || "Quiz not found."}
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
            Quiz Results
          </h1>

          <p className="page-subtitle">
            {assessment.subject?.subject_code}
            {" - "}
            {assessment.title}
          </p>
        </div>

        <Link
          to={'/lecturer/assessments'}
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
              <FaQuestionCircle />
            </div>

            <h3 className="stat-number">
              {summary.attempted_count}
            </h3>

            <span className="stext">
              Attempted
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
              {summary.not_attempted_count}
            </h3>

            <span className="stext">
              Not Attempted
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
              quiz subject.
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
                  <th>Attempt Status</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Started At</th>
                  <th>Submitted At</th>
                  <th className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => {
                  const attempt =
                    student.attempt;

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

                            <div className="small ">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        {student.student_number}
                      </td>

                      <td>
                        {student.course || "-"}
                      </td>

                      <td>
                        {!student.has_attempted ? (
                          <span className="badge bg-secondary">
                            Not Attempted
                          </span>
                        ) : attempt?.status ===
                          "submitted" ? (
                          <span className="badge bg-success">
                            Submitted
                          </span>
                        ) : (
                          <span className="badge bg-warning text-dark">
                            In Progress
                          </span>
                        )}
                      </td>

                      <td>
                        {attempt?.status ===
                        "submitted"
                          ? `${attempt.score} / ${attempt.total_marks}`
                          : "-"}
                      </td>

                      <td>
                        {attempt?.status ===
                        "submitted" ? (
                          <span
                            className={`badge ${getResultBadgeClass(
                              attempt.percentage,
                            )}`}
                          >
                            {attempt.percentage}%
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        {attempt
                          ? formatDateTime(
                              attempt.started_at,
                            )
                          : "-"}
                      </td>

                      <td>
                        {attempt?.submitted_at
                          ? formatDateTime(
                              attempt.submitted_at,
                            )
                          : "-"}
                      </td>

                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          {attempt?.status ===
                            "submitted" && (
                            <Link
                              to={`${basePath}/${id}/quiz-attempts/${attempt.id}`}
                              className="btn btn-sm btn-outline-dark"
                              title="View result details"
                            >
                              <FaEye />
                              <span className="ms-2">View</span>
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

export default AssessmentQuizAttempts;