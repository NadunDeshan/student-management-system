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
  FaPen,
  FaUser,
  FaUsers,
} from "react-icons/fa";

import { getAssessment } from "../../api/assessmentApi";
import Loading from "../../components/Loading";
import DocumentTitle from "../../hooks/DocumentTitle.js";

function AssessmentDetails() {
  const { id } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  DocumentTitle("Assessment Details");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const basePath =
    user.role === "lecturer" ? "/lecturer/assessments" : "/admin/assessments";

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getAssessment(id);

        setAssessment(result.data);
      } catch (requestError) {
        console.error(requestError);

        if (requestError.response?.status === 404) {
          setError("Assessment not found.");
        } else if (requestError.response?.status === 403) {
          setError(
            requestError.response.data.message ??
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

    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      draft: "bg-secondary",
      published: "bg-success",
      closed: "bg-dark",
      cancelled: "bg-danger",
    };

    return classes[status] ?? "bg-secondary";
  };

  if (loading) {
    return <Loading message="Loading assessment..." />;
  }

  if (error || !assessment) {
    return (
      <div className="content-card p-4">
        <div className="alert alert-danger mb-3">
          {error || "Assessment not found."}
        </div>

        <Link to={basePath} className="btn btn-outline-light">
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
          <h1 className="page-title">Assessment Details</h1>

          <p className="page-subtitle">
            View the complete assessment information.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to={basePath} className="btn btn-outline-light">
            <FaArrowLeft className="me-2" />
            Back
          </Link>


          <Link
            to={`${basePath}/${assessment.id}/edit`}
            className="btn btn-system"
          >
            <FaPen className="me-2" />
            Edit
          </Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="stat-card h-100">
            <div className="stat-icon">
              <FaFileAlt />
            </div>

            <h3 className="mt-3 mb-2">{assessment.title}</h3>

            <span className="stext">{formatType(assessment.type)}</span>

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
            <h4 className="mb-4">Main Information</h4>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Assessment Type</span>

                  <strong>{formatType(assessment.type)}</strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Total Marks</span>

                  <strong>{assessment.total_marks ?? 0}</strong>
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

                  <strong>{assessment.creator?.name ?? "-"}</strong>
                </div>
              </div>

              <div className="col-12">
                <div className="student-profile-field">
                  <span>Description</span>

                  <strong>{assessment.description || "-"}</strong>
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
                <h4 className="mb-1">Subject Information</h4>

                <p className="stext mb-0">
                  Subject connected to this assessment.
                </p>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <div className="student-profile-field">
                  <span>Subject Code</span>

                  <strong>{assessment.subject?.subject_code ?? "-"}</strong>
                </div>
              </div>

              <div className="col-md-4">
                <div className="student-profile-field">
                  <span>Subject Name</span>

                  <strong>{assessment.subject?.subject_name ?? "-"}</strong>
                </div>
              </div>

              <div className="col-md-4">
                <div className="student-profile-field">
                  <span>Semester</span>

                  <strong>
                    Semester {assessment.subject?.semester ?? "-"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="dashboard-panel">
            <h4 className="mb-4">Schedule and Availability</h4>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>
                    <FaCalendarAlt className="me-2" />
                    Available From
                  </span>

                  <strong>{formatDateTime(assessment.available_from)}</strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>
                    <FaCalendarAlt className="me-2" />
                    Due Date
                  </span>

                  <strong>{formatDateTime(assessment.due_date)}</strong>
                </div>
              </div>

              {assessment.type === "written_exam" && (
                <>
                  <div className="col-md-6">
                    <div className="student-profile-field">
                      <span>
                        <FaCalendarAlt className="me-2" />
                        Exam Date
                      </span>

                      <strong>{formatDate(assessment.exam_date)}</strong>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="student-profile-field">
                      <span>
                        <FaClock className="me-2" />
                        Start Time
                      </span>

                      <strong>{assessment.start_time || "-"}</strong>
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

                      <strong>{assessment.location || "-"}</strong>
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
                  <h4 className="mb-1">PDF Attachment</h4>

                  <p className="stext mb-0">
                    Open or download the attached assessment PDF.
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
      </div>
    </>
  );
}

export default AssessmentDetails;
