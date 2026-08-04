import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  FaArrowLeft,
  FaBook,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaPaperPlane,
  FaQuestionCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";

import {
  startQuiz,
  submitQuiz,
} from "../../api/quizApi";

import Loading from "../../components/Loading";
import DocumentTitle from "../../hooks/DocumentTitle.js";

function StudentQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [selectedAnswers, setSelectedAnswers] =
    useState({});

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  DocumentTitle("MCQ Quiz");

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await startQuiz(id);

        setAssessment(result.assessment ?? null);
        setAttempt(result.attempt ?? null);
        setQuestions(result.questions ?? []);
      } catch (requestError) {
        console.error(requestError);

        if (
          requestError.response?.status === 422 &&
          requestError.response?.data?.attempt
        ) {
          navigate(
            `/student/quizzes/${id}/result`,
            {
              replace: true,
            },
          );

          return;
        }

        setError(
          requestError.response?.data?.message ??
            "Unable to start the quiz.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id, navigate]);

  const currentQuestion =
    questions[currentQuestionIndex] ?? null;

  const answeredCount = useMemo(() => {
    return Object.values(selectedAnswers).filter(
      (value) =>
        value !== null &&
        value !== undefined,
    ).length;
  }, [selectedAnswers]);

  const progressPercentage =
    questions.length > 0
      ? Math.round(
          ((currentQuestionIndex + 1) /
            questions.length) *
            100,
        )
      : 0;

  const handleOptionSelect = (
    questionId,
    optionId,
  ) => {
    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: optionId,
    }));
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((current) =>
      Math.max(0, current - 1),
    );
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((current) =>
      Math.min(
        questions.length - 1,
        current + 1,
      ),
    );
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    const unansweredCount =
      questions.length - answeredCount;

    const confirmation = await Swal.fire({
      title: "Submit quiz?",
      text:
        unansweredCount > 0
          ? `${unansweredCount} question(s) are unanswered. You can still submit.`
          : "All questions are answered.",
      icon:
        unansweredCount > 0
          ? "warning"
          : "question",
      showCancelButton: true,
      confirmButtonText: "Submit Quiz",
      cancelButtonText: "Continue Quiz",
      confirmButtonColor: "#198754",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      setSubmitting(true);

      const answers = questions.map(
        (question) => ({
          question_id: question.id,
          selected_option_id:
            selectedAnswers[question.id] ??
            null,
        }),
      );

      const result = await submitQuiz(
        id,
        answers,
      );

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title:
          result.message ??
          "Quiz submitted successfully.",
        showConfirmButton: false,
        timer: 1600,
        timerProgressBar: true,
        background: "rgb(135 227 169)",
        color: "#1f2937",
        iconColor: "rgb(7 117 48)",
        width: "350px",
      });

      navigate(
        `/student/quizzes/${id}/result`,
        {
          replace: true,
        },
      );
    } catch (requestError) {
      console.error(requestError);

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title:
          requestError.response?.data
            ?.message ??
          "Unable to submit the quiz.",
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

  if (loading) {
    return (
      <Loading message="Loading quiz..." />
    );
  }

  if (
    error ||
    !assessment ||
    !attempt ||
    questions.length === 0
  ) {
    return (
      <div className="content-card p-4">
        <div className="alert alert-danger mb-3">
          {error || "Quiz is not available."}
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
            {assessment.title}
          </h1>

          <p className="page-subtitle">
            {assessment.subject?.subject_code}
            {" - "}
            {assessment.subject?.subject_name}
          </p>
        </div>

        <Link
          to={`/student/assessments/${id}`}
          className="btn btn-outline-light"
        >
          <FaArrowLeft className="me-2" />
          Exit Quiz
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-xl-3">
          <div className="dashboard-panel h-100">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="stat-icon">
                <FaQuestionCircle />
              </div>

              <div>
                <h4 className="mb-1">
                  Quiz Progress
                </h4>

                <p className="stext mb-0">
                  {answeredCount} of{" "}
                  {questions.length} answered
                </p>
              </div>
            </div>

            <div className="progress mb-3">
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${progressPercentage}%`,
                }}
                aria-valuenow={
                  progressPercentage
                }
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {progressPercentage}%
              </div>
            </div>

            <div className="student-profile-field mb-3">
              <span>
                <FaBook className="me-2" />
                Total Marks
              </span>

              <strong>
                {assessment.total_marks}
              </strong>
            </div>

            <div className="student-profile-field mb-4">
              <span>
                <FaClock className="me-2" />
                Attempt Status
              </span>

              <strong className="text-capitalize">
                {attempt.status.replace(
                  "_",
                  " ",
                )}
              </strong>
            </div>

            <div className="quiz-question-navigation">
              {questions.map(
                (question, index) => {
                  const isAnswered =
                    selectedAnswers[
                      question.id
                    ] !== undefined;

                  const isCurrent =
                    currentQuestionIndex ===
                    index;

                  return (
                    <button
                      key={question.id}
                      type="button"
                      className={`quiz-question-nav-button ${
                        isCurrent
                          ? "current"
                          : ""
                      } ${
                        isAnswered
                          ? "answered"
                          : ""
                      }`}
                      onClick={() =>
                        goToQuestion(index)
                      }
                    >
                      {index + 1}

                      {isAnswered && (
                        <FaCheckCircle />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-9">
          <div className="content-card p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
              <div>
                <span className="student-subject-code">
                  Question{" "}
                  {currentQuestionIndex + 1} of{" "}
                  {questions.length}
                </span>

                <h3 className="quiz-question-title">
                  {
                    currentQuestion.question_text
                  }
                </h3>
              </div>

              <span className="badge bg-info text-dark align-self-start">
                {currentQuestion.marks}{" "}
                {Number(
                  currentQuestion.marks,
                ) === 1
                  ? "Mark"
                  : "Marks"}
              </span>
            </div>

            <div className="quiz-answer-options">
              {currentQuestion.options.map(
                (option, index) => {
                  const isSelected =
                    selectedAnswers[
                      currentQuestion.id
                    ] === option.id;

                  return (
                    <label
                      key={option.id}
                      className={`quiz-answer-option ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        className="form-check-input"
                        checked={isSelected}
                        onChange={() =>
                          handleOptionSelect(
                            currentQuestion.id,
                            option.id,
                          )
                        }
                      />

                      <div className="mcq-option-number">
                        {String.fromCharCode(
                          65 + index,
                        )}
                      </div>

                      <span>
                        {option.option_text}
                      </span>
                    </label>
                  );
                },
              )}
            </div>

            <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mt-4">
              <button
                type="button"
                className="btn btn-outline-light"
                disabled={
                  currentQuestionIndex === 0
                }
                onClick={
                  goToPreviousQuestion
                }
              >
                <FaChevronLeft className="me-2" />
                Previous
              </button>

              <div className="d-flex flex-column flex-sm-row gap-2">
                {currentQuestionIndex <
                questions.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-system"
                    onClick={
                      goToNextQuestion
                    }
                  >
                    Next
                    <FaChevronRight className="ms-2" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    <FaPaperPlane className="me-2" />

                    {submitting
                      ? "Submitting..."
                      : "Submit Quiz"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentQuiz;