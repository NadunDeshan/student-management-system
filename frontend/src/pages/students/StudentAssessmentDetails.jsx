import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaDownload,
  FaFileAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaUpload,
} from "react-icons/fa";
import api from "../../api/axios";
import Loading from "../../components/Loading";
import DocumentTitle from "../../hooks/DocumentTitle.js";
import Swal from "sweetalert2";

function StudentAssessmentDetails() {
  const { id } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [submission, setSubmission] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submissionLoading, setSubmissionLoading] =
    useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] =
    useState("");

  DocumentTitle("Assessment Details");

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/student/assessments/${id}`,
        );

        const assessmentData = response.data.data;

        setAssessment(assessmentData);

        if (assessmentData.type === "assignment") {
          try {
            setSubmissionLoading(true);
            setSubmissionError("");

            const submissionResponse = await api.get(
              `/student/assignments/${id}/submission`,
            );

            setSubmission(
              submissionResponse.data.submission ?? null,
            );
          } catch (submissionRequestError) {
            console.error(submissionRequestError);

            setSubmissionError(
              submissionRequestError.response?.data
                ?.message ??
                "Unable to load your assignment submission.",
            );
          } finally {
            setSubmissionLoading(false);
          }
        }
      } catch (requestError) {
        console.error(requestError);

        if (requestError.response?.status === 404) {
          setError("Assessment not found.");
        } else if (
          requestError.response?.status === 403
        ) {
          setError(
            requestError.response?.data?.message ??
              "You cannot view this assessment.",
          );
        } else {
          setError("Unable to load the assessment.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [id]);

  const handleSubmissionFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    setSubmissionFile(file);
    setSubmissionError("");
  };

  const handleAssignmentSubmit = async (event) => {
    event.preventDefault();

    if (!submissionFile) {
      setSubmissionError(
        "Please select a file before submitting.",
      );

      return;
    }

    try {
      setSubmitting(true);
      setSubmissionError("");

      const data = new FormData();

      data.append(
        "submission_file",
        submissionFile,
      );

      const response = await api.post(
        `/student/assignments/${id}/submission`,
        data,
      );

      setSubmission(
        response.data.submission ?? null,
      );

      setSubmissionFile(null);

      const fileInput = document.getElementById(
        "assignment-submission-file",
      );

      if (fileInput) {
        fileInput.value = "";
      }

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title:
          response.data.message ??
          "Assignment submitted successfully.",
        showConfirmButton: false,
        timer: 1700,
        timerProgressBar: true,
        background: "rgb(135 227 169)",
        color: "#1f2937",
        iconColor: "rgb(7 117 48)",
        width: "350px",
      });
    } catch (requestError) {
      console.error(requestError);

      if (requestError.response?.status === 422) {
        const validationMessage =
          requestError.response?.data?.errors
            ?.submission_file?.[0];

        setSubmissionError(
          validationMessage ??
            requestError.response?.data?.message ??
            "Unable to submit the assignment.",
        );

        return;
      }

      setSubmissionError(
        requestError.response?.data?.message ??
          "Unable to submit the assignment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatType = (type) => {
    const labels = {
      written_exam: "Written Exam",
      assignment: "Assignment",
      mcq: "MCQ Quiz",
    };

    return labels[type] ?? type;
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    );
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      published: "bg-success",
      closed: "bg-dark",
    };

    return classes[status] ?? "bg-secondary";
  };

  const getSubmissionBadgeClass = (status) => {
    const classes = {
      submitted: "bg-primary",
      graded: "bg-success",
    };

    return classes[status] ?? "bg-secondary";
  };

  if (loading) {
    return (
      <Loading message="Loading assessment..." />
    );
  }

  if (error || !assessment) {
    return (
      <div className="content-card p-4">
        <div className="alert alert-danger mb-3">
          {error || "Assessment not found."}
        </div>

        <Link
          to="/student/assessments"
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
            Assessment Details
          </h1>

          <p className="page-subtitle">
            View assessment instructions and schedule.
          </p>
        </div>

        <Link
          to="/student/assessments"
          className="btn btn-outline-light"
        >
          <FaArrowLeft className="me-2" />
          Back
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="stat-card h-100">
            <div className="stat-icon">
              <FaFileAlt />
            </div>

            <h3 className="mt-3 mb-2">
              {assessment.title}
            </h3>

            <span className="stext">
              {formatType(assessment.type)}
            </span>

            <div className="mt-3">
              <span
                className={`badge text-capitalize ${getStatusBadgeClass(
                  assessment.status,
                )}`}
              >
                {assessment.status}
              </span>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="dashboard-panel h-100">
            <h4 className="mb-4">
              Assessment Information
            </h4>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Assessment Type</span>

                  <strong>
                    {formatType(assessment.type)}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Total Marks</span>

                  <strong>
                    {assessment.total_marks}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Status</span>

                  <strong className="text-capitalize">
                    {assessment.status}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Created By</span>

                  <strong>
                    {assessment.creator?.name ?? "-"}
                  </strong>
                </div>
              </div>

              <div className="col-12">
                <div className="student-profile-field">
                  <span>Description</span>

                  <strong>
                    {assessment.description || "-"}
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
                <FaBook />
              </div>

              <div>
                <h4 className="mb-1">
                  Subject Information
                </h4>

                <p className="stext mb-0">
                  Subject connected to this assessment.
                </p>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <div className="student-profile-field">
                  <span>Subject Code</span>

                  <strong>
                    {assessment.subject
                      ?.subject_code ?? "-"}
                  </strong>
                </div>
              </div>

              <div className="col-md-4">
                <div className="student-profile-field">
                  <span>Subject Name</span>

                  <strong>
                    {assessment.subject
                      ?.subject_name ?? "-"}
                  </strong>
                </div>
              </div>

              <div className="col-md-4">
                <div className="student-profile-field">
                  <span>Semester</span>

                  <strong>
                    Semester{" "}
                    {assessment.subject?.semester ??
                      "-"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="dashboard-panel">
            <h4 className="mb-4">
              Schedule and Availability
            </h4>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>
                    <FaCalendarAlt className="me-2" />
                    Available From
                  </span>

                  <strong>
                    {formatDateTime(
                      assessment.available_from,
                    )}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>
                    <FaCalendarAlt className="me-2" />
                    Due Date
                  </span>

                  <strong>
                    {formatDateTime(
                      assessment.due_date,
                    )}
                  </strong>
                </div>
              </div>

              {assessment.type ===
                "written_exam" && (
                <>
                  <div className="col-md-6">
                    <div className="student-profile-field">
                      <span>
                        <FaCalendarAlt className="me-2" />
                        Exam Date
                      </span>

                      <strong>
                        {formatDate(
                          assessment.exam_date,
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="student-profile-field">
                      <span>
                        <FaClock className="me-2" />
                        Start Time
                      </span>

                      <strong>
                        {assessment.start_time || "-"}
                      </strong>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="student-profile-field">
                      <span>
                        <FaClock className="me-2" />
                        Duration
                      </span>

                      <strong>
                        {assessment.duration_minutes
                          ? `${assessment.duration_minutes} minutes`
                          : "-"}
                      </strong>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="student-profile-field">
                      <span>
                        <FaMapMarkerAlt className="me-2" />
                        Location
                      </span>

                      <strong>
                        {assessment.location || "-"}
                      </strong>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {assessment.attachment_url && (
          <div className="col-12">
            <div className="dashboard-panel">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div>
                  <h4 className="mb-1">
                    Assessment PDF
                  </h4>

                  <p className="stext mb-0">
                    Open the attached instructions or
                    question paper.
                  </p>
                </div>

                <a
                  href={assessment.attachment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-system"
                >
                  <FaDownload className="me-2" />
                  Open PDF
                </a>
              </div>
            </div>
          </div>
        )}

        {assessment.type === "assignment" && (
          <div className="col-12">
            <div className="dashboard-panel">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="stat-icon">
                  <FaUpload />
                </div>

                <div>
                  <h4 className="mb-1">
                    Assignment Submission
                  </h4>

                  <p className="stext mb-0">
                    Upload your completed assignment file.
                  </p>
                </div>
              </div>

              {submissionLoading ? (
                <p className="stext mb-0">
                  Loading submission...
                </p>
              ) : (
                <>
                  {submission && (
                    <div className="assignment-submission-summary mb-4">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="student-profile-field">
                            <span>
                              Submission Status
                            </span>

                            <div>
                              <span
                                className={`badge text-capitalize ${getSubmissionBadgeClass(
                                  submission.status,
                                )}`}
                              >
                                {submission.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="student-profile-field">
                            <span>
                              Submitted At
                            </span>

                            <strong>
                              {formatDateTime(
                                submission.submitted_at,
                              )}
                            </strong>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="student-profile-field">
                            <span>Marks</span>

                            <strong>
                              {submission.marks !==
                              null
                                ? `${submission.marks} / ${assessment.total_marks}`
                                : "Not graded yet"}
                            </strong>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="student-profile-field">
                            <span>Feedback</span>

                            <strong>
                              {submission.feedback ||
                                "No feedback yet"}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {submission.submission_file_url && (
                        <a
                          href={
                            submission.submission_file_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-info mt-3"
                        >
                          <FaDownload className="me-2" />
                          Open My Submission
                        </a>
                      )}
                    </div>
                  )}

                  {submissionError && (
                    <div className="alert alert-danger">
                      {submissionError}
                    </div>
                  )}

                  {submission?.status === "graded" ? (
                    <div className="alert alert-info mb-0">
                      This submission has already been
                      graded and cannot be replaced.
                    </div>
                  ) : (
                    <form
                      onSubmit={
                        handleAssignmentSubmit
                      }
                    >
                      <div className="row g-3 align-items-end">
                        <div className="col-lg-8">
                          <label className="form-label">
                            Submission File
                            <span className="required-mark">
                              {" "}
                              *
                            </span>
                          </label>

                          <input
                            id="assignment-submission-file"
                            type="file"
                            className={`form-control ${
                              submissionError
                                ? "is-invalid"
                                : ""
                            }`}
                            accept=".pdf,.doc,.docx,.zip"
                            onChange={
                              handleSubmissionFileChange
                            }
                          />

                          <small className="page-subtitle">
                            Allowed: PDF, DOC, DOCX and
                            ZIP. Maximum size: 20 MB.
                          </small>
                        </div>

                      </div>
                      <div className="col-lg-2">
                          <button
                            type="submit"
                            className="btn btn-system w-100 mt-4"
                            disabled={submitting}
                          >
                            <FaPaperPlane className="me-2" />

                            {submitting
                              ? "Submitting..."
                              : submission
                                ? "Replace Submission"
                                : "Submit Assignment"}
                          </button>
                        </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {assessment.type === "mcq" && (
  <div className="col-12">
    <div className="dashboard-panel">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h4 className="mb-1">
            MCQ Quiz
          </h4>

          <p className="stext mb-0">
            Start the quiz and submit your answers.
            Only one attempt is allowed.
          </p>
        </div>

        <Link
          to={`/student/quizzes/${assessment.id}`}
          className="btn btn-system"
        >
          Start Quiz
        </Link>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
}

export default StudentAssessmentDetails;