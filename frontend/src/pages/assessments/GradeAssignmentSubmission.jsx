import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  FaArrowLeft,
  FaDownload,
  FaSave,
  FaUserGraduate,
} from "react-icons/fa";
import Swal from "sweetalert2";

import api from "../../api/axios";
import Loading from "../../components/Loading";
import DocumentTitle from "../../hooks/DocumentTitle.js";

function GradeAssignmentSubmission() {
  const { id, submissionId } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);

  const [formData, setFormData] = useState({
    marks: "",
    feedback: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");

  DocumentTitle("Grade Assignment");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}",
  );

  const basePath =
    user.role === "lecturer"
      ? "/lecturer/assessments"
      : "/admin/assessments";

  useEffect(() => {
    const loadSubmission = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const response = await api.get(
          `/assessments/${id}/submissions/${submissionId}`,
        );

        const submissionData =
          response.data.submission;

        setSubmission(submissionData);

        setFormData({
          marks:
            submissionData.marks ?? "",
          feedback:
            submissionData.feedback ?? "",
        });
      } catch (requestError) {
        console.error(requestError);

        if (
          requestError.response?.status === 404
        ) {
          setLoadError(
            "Submission not found.",
          );
        } else if (
          requestError.response?.status === 403
        ) {
          setLoadError(
            requestError.response?.data
              ?.message ??
              "You cannot grade this submission.",
          );
        } else if (
          requestError.response?.status === 422
        ) {
          setLoadError(
            requestError.response?.data
              ?.message ??
              "This submission cannot be graded.",
          );
        } else {
          setLoadError(
            "Unable to load the submission.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadSubmission();
  }, [id, submissionId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setErrors({});

      const response = await api.put(
        `/assessments/${id}/submissions/${submissionId}/grade`,
        {
          marks: formData.marks,
          feedback:
            formData.feedback || null,
        },
      );

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title:
          response.data.message ??
          "Assignment graded successfully.",
        showConfirmButton: false,
        timer: 1700,
        timerProgressBar: true,
        background: "rgb(135 227 169)",
        color: "#1f2937",
        iconColor: "rgb(7 117 48)",
        width: "350px",
      });

      navigate(
        `${basePath}/${id}/submissions`,
      );
    } catch (requestError) {
      console.error(requestError);

      if (
        requestError.response?.status === 422
      ) {
        setErrors(
          requestError.response.data.errors ??
            {},
        );

        return;
      }

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title:
          requestError.response?.data
            ?.message ??
          "Unable to grade the assignment.",
        showConfirmButton: false,
        timer: 1900,
        timerProgressBar: true,
        background: "#fee2e2",
        color: "#7f1d1d",
        iconColor: "#dc2626",
        width: "350px",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (fieldName) => {
    return errors[fieldName]?.[0] ?? "";
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

  if (loading) {
    return (
      <Loading message="Loading submission..." />
    );
  }

  if (loadError || !submission) {
    return (
      <div className="content-card p-4">
        <div className="alert alert-danger mb-3">
          {loadError ||
            "Submission not found."}
        </div>

        <Link
          to={`${basePath}/${id}/submissions`}
          className="btn btn-outline-light"
        >
          <FaArrowLeft className="me-2" />
          Back to Submissions
        </Link>
      </div>
    );
  }

  const student = submission.student;
  const assessment = submission.assessment;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Grade Assignment
          </h1>

          <p className="page-subtitle">
            Review the submission and enter marks
            and feedback.
          </p>
        </div>

        <Link
          to={`${basePath}/${id}/submissions`}
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
              <FaUserGraduate />
            </div>

            <h3 className="mt-3 mb-2">
              {student?.full_name ?? "Student"}
            </h3>

            <span className="stext">
              {student?.student_number ?? "-"}
            </span>

            <div className="mt-3">
              <span
                className={`badge ${
                  submission.status === "graded"
                    ? "bg-success"
                    : "bg-primary"
                }`}
              >
                {submission.status === "graded"
                  ? "Graded"
                  : "Submitted"}
              </span>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="dashboard-panel h-100">
            <h4 className="mb-4">
              Submission Information
            </h4>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Assessment</span>

                  <strong>
                    {assessment?.title ?? "-"}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Total Marks</span>

                  <strong>
                    {assessment?.total_marks ?? "-"}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Submitted At</span>

                  <strong>
                    {formatDateTime(
                      submission.submitted_at,
                    )}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Course</span>

                  <strong>
                    {student?.course ?? "-"}
                  </strong>
                </div>
              </div>

              <div className="col-12">
                <a
                  href={
                    submission.submission_file_url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-info"
                >
                  <FaDownload className="me-2" />
                  Open Submission File
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="content-card p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">
                    Marks
                    <span className="required-mark">
                      {" "}
                      *
                    </span>
                  </label>

                  <input
                    type="number"
                    name="marks"
                    min="0"
                    step="0.01"
                    max={
                      assessment?.total_marks
                    }
                    className={`form-control ${
                      fieldError("marks")
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formData.marks}
                    onChange={handleChange}
                    placeholder={`Maximum ${assessment?.total_marks}`}
                  />

                  <div className="invalid-feedback">
                    {fieldError("marks")}
                  </div>

                  <small className="page-subtitle">
                    Maximum marks:{" "}
                    {assessment?.total_marks}
                  </small>
                </div>

                <div className="col-md-8">
                  <label className="form-label">
                    Feedback
                  </label>

                  <textarea
                    name="feedback"
                    rows="5"
                    maxLength="5000"
                    className={`form-control ${
                      fieldError("feedback")
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formData.feedback}
                    onChange={handleChange}
                    placeholder="Enter feedback for the student"
                  />

                  <div className="invalid-feedback">
                    {fieldError("feedback")}
                  </div>
                </div>

                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-system px-4"
                    disabled={submitting}
                  >
                    <FaSave className="me-2" />

                    {submitting
                      ? "Saving Grade..."
                      : submission.status ===
                          "graded"
                        ? "Update Grade"
                        : "Save Grade"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default GradeAssignmentSubmission;