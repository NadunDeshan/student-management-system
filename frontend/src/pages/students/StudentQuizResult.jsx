import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBook,
  FaCheckCircle,
  FaClock,
  FaMedal,
  FaPercentage,
} from "react-icons/fa";

import { getQuizResult } from "../../api/quizApi";
import Loading from "../../components/Loading";
import DocumentTitle from "../../hooks/DocumentTitle.js";

function StudentQuizResult() {
  const { id } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  DocumentTitle("Quiz Result");

  useEffect(() => {
    const loadResult = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getQuizResult(id);

        setResult(response.result ?? null);
      } catch (requestError) {
        console.error(requestError);

        if (
          requestError.response?.status === 404
        ) {
          setError(
            requestError.response?.data?.message ??
              "Quiz result not found.",
          );
        } else if (
          requestError.response?.status === 403
        ) {
          setError(
            requestError.response?.data?.message ??
              "You cannot view this quiz result.",
          );
        } else {
          setError(
            "Unable to load the quiz result.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [id]);

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

  const getResultClass = (percentage) => {
    if (percentage >= 75) {
      return "quiz-result-excellent";
    }

    if (percentage >= 50) {
      return "quiz-result-pass";
    }

    return "quiz-result-fail";
  };

  const getResultLabel = (percentage) => {
    if (percentage >= 75) {
      return "Excellent";
    }

    if (percentage >= 50) {
      return "Passed";
    }

    return "Needs Improvement";
  };

  if (loading) {
    return (
      <Loading message="Loading quiz result..." />
    );
  }

  if (error || !result) {
    return (
      <div className="content-card p-4">
        <div className="alert alert-danger mb-3">
          {error || "Quiz result not found."}
        </div>

        <Link
          to={`/student/assessments/${id}`}
          className="btn btn-outline-light"
        >
          <FaArrowLeft className="me-2" />
          Back to Assessment
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Quiz Result
          </h1>

          <p className="page-subtitle">
            View your automatically calculated
            MCQ quiz result.
          </p>
        </div>

        <Link
          to={`/student/assessments/${id}`}
          className="btn btn-outline-light"
        >
          <FaArrowLeft className="me-2" />
          Back
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div
            className={`quiz-result-summary ${getResultClass(
              Number(result.percentage),
            )}`}
          >
            <div className="quiz-result-icon">
              <FaMedal />
            </div>

            <h2 className="quiz-result-score">
              {result.score} /{" "}
              {result.total_marks}
            </h2>

            <p className="quiz-result-percentage">
              {result.percentage}%
            </p>

            <span className="quiz-result-label">
              {getResultLabel(
                Number(result.percentage),
              )}
            </span>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="dashboard-panel h-100">
            <h4 className="mb-4">
              Quiz Information
            </h4>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Quiz Title</span>

                  <strong>
                    {result.title ?? "-"}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>
                    <FaBook className="me-2" />
                    Subject
                  </span>

                  <strong>
                    {result.subject
                      ?.subject_code ?? "-"}
                    {" - "}
                    {result.subject
                      ?.subject_name ?? "-"}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>
                    <FaCheckCircle className="me-2" />
                    Correct Answers
                  </span>

                  <strong>
                    {result.correct_answers} /{" "}
                    {result.total_questions}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>
                    <FaPercentage className="me-2" />
                    Percentage
                  </span>

                  <strong>
                    {result.percentage}%
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>
                    <FaClock className="me-2" />
                    Started At
                  </span>

                  <strong>
                    {formatDateTime(
                      result.started_at,
                    )}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>
                    <FaClock className="me-2" />
                    Submitted At
                  </span>

                  <strong>
                    {formatDateTime(
                      result.submitted_at,
                    )}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Status</span>

                  <strong className="text-capitalize">
                    {result.status ?? "-"}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Attempt ID</span>

                  <strong>
                    {result.attempt_id ?? "-"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentQuizResult;