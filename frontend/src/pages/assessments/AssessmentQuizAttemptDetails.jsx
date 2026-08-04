import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUserGraduate,
} from "react-icons/fa";

import api from "../../api/axios";
import Loading from "../../components/Loading";
import DocumentTitle from "../../hooks/DocumentTitle.js";

function AssessmentQuizAttemptDetails() {
  const { id, attemptId } = useParams();

  const [assessment, setAssessment] =
    useState(null);

  const [student, setStudent] =
    useState(null);

  const [attempt, setAttempt] =
    useState(null);

  const [answers, setAnswers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  DocumentTitle("Quiz Attempt Details");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}",
  );

  const basePath =
    user.role === "lecturer"
      ? "/lecturer/assessments"
      : "/admin/assessments";

  useEffect(() => {
    const loadAttempt = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/assessments/${id}/quiz-attempts/${attemptId}`,
        );

        setAssessment(
          response.data.assessment ?? null,
        );

        setStudent(
          response.data.student ?? null,
        );

        setAttempt(
          response.data.attempt ?? null,
        );

        setAnswers(
          response.data.answers ?? [],
        );
      } catch (requestError) {
        console.error(requestError);

        setError(
          requestError.response?.data?.message ??
            "Unable to load quiz attempt.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAttempt();
  }, [id, attemptId]);

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
      <Loading message="Loading quiz attempt..." />
    );
  }

  if (
    error ||
    !assessment ||
    !student ||
    !attempt
  ) {
    return (
      <div className="content-card p-4">
        <div className="alert alert-danger mb-3">
          {error || "Quiz attempt not found."}
        </div>

        <Link
          to={`${basePath}/${id}/quiz-attempts`}
          className="btn btn-outline-light"
        >
          <FaArrowLeft className="me-2" />
          Back to Quiz Results
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Quiz Attempt Details
          </h1>

          <p className="page-subtitle">
            {assessment.subject?.subject_code}
            {" - "}
            {assessment.title}
          </p>
        </div>

        <Link
          to={`${basePath}/${id}/quiz-attempts`}
          className="btn btn-outline-light"
        >
          <FaArrowLeft className="me-2" />
          Back
        </Link>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="stat-card h-100">
            <div className="stat-icon">
              <FaUserGraduate />
            </div>

            <h3 className="mt-3 mb-2">
              {student.full_name}
            </h3>

            <span className="stext">
              {student.student_number}
            </span>

            <div className="mt-3">
              <span className="badge bg-success">
                Submitted
              </span>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="dashboard-panel h-100">
            <h4 className="mb-4">
              Attempt Summary
            </h4>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Score</span>

                  <strong>
                    {attempt.score} /{" "}
                    {attempt.total_marks}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Percentage</span>

                  <strong>
                    {attempt.percentage}%
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Correct Answers</span>

                  <strong>
                    {attempt.correct_answers} /{" "}
                    {attempt.total_questions}
                  </strong>
                </div>
              </div>

              <div className="col-md-6">
                <div className="student-profile-field">
                  <span>Course</span>

                  <strong>
                    {student.course || "-"}
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
                      attempt.started_at,
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
                      attempt.submitted_at,
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h4 className="mb-4">
          Answer Review
        </h4>

        <div className="mcq-question-list">
          {answers.map(
            (answer, index) => (
              <div
                className="mcq-question-card"
                key={answer.id}
              >
                <div className="mcq-question-card-header">
                  <div className="d-flex align-items-start gap-3">
                    <div className="mcq-question-order">
                      {index + 1}
                    </div>

                    <div>
                      <h4 className="mcq-question-text mt-0">
                        {
                          answer.question
                            .question_text
                        }
                      </h4>

                      <span className="stext">
                        Question marks:{" "}
                        {answer.question.marks}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      answer.is_correct
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {answer.is_correct
                      ? "Correct"
                      : "Incorrect"}
                  </span>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="student-profile-field">
                      <span>
                        Student Answer
                      </span>

                      <strong>
                        {answer.selected_option
                          ?.option_text ??
                          "Not answered"}
                      </strong>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="student-profile-field">
                      <span>
                        Correct Answer
                      </span>

                      <strong>
                        {answer.correct_option
                          ?.option_text ??
                          "-"}
                      </strong>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="student-profile-field">
                      <span>
                        Marks Awarded
                      </span>

                      <strong>
                        {answer.marks_awarded} /{" "}
                        {answer.question.marks}
                      </strong>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="student-profile-field">
                      <span>Result</span>

                      <strong
                        className={
                          answer.is_correct
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {answer.is_correct ? (
                          <>
                            <FaCheckCircle className="me-2" />
                            Correct
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="me-2" />
                            Incorrect
                          </>
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </>
  );
}

export default AssessmentQuizAttemptDetails;