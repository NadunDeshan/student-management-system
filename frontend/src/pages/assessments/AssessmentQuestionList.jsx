import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaQuestionCircle,
  FaTrash,
} from "react-icons/fa";
import Swal from "sweetalert2";

import {
  deleteAssessmentQuestion,
  getAssessmentQuestions,
} from "../../api/questionApi";

import { getAssessment } from "../../api/assessmentApi";

import Loading from "../../components/Loading";
import DocumentTitle from "../../hooks/DocumentTitle.js";

function AssessmentQuestionList() {
  const { id } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  DocumentTitle("MCQ Questions");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}",
  );

  const basePath =
    user.role === "lecturer"
      ? "/lecturer/assessments"
      : "/admin/assessments";

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        assessmentResult,
        questionResult,
      ] = await Promise.all([
        getAssessment(id),
        getAssessmentQuestions(id),
      ]);

      setAssessment(
        assessmentResult.data ?? null,
      );

      setQuestions(
        questionResult.data ?? [],
      );
    } catch (requestError) {
      console.error(requestError);

      if (
        requestError.response?.status === 404
      ) {
        setError(
          "Assessment or questions not found.",
        );
      } else if (
        requestError.response?.status === 403
      ) {
        setError(
          requestError.response?.data?.message ??
            "You cannot manage these questions.",
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
          "Unable to load MCQ questions.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [id]);

  const handleDelete = async (question) => {
    const result = await Swal.fire({
      title: "Delete question?",
      text: question.question_text,
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
      await deleteAssessmentQuestion(
        id,
        question.id,
      );

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title:
          "MCQ question deleted successfully.",
        showConfirmButton: false,
        timer: 1600,
        timerProgressBar: true,
        background: "rgb(135 227 169)",
        color: "#1f2937",
        iconColor: "rgb(7 117 48)",
        width: "350px",
      });

      loadQuestions();
    } catch (requestError) {
      console.error(requestError);

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title:
          requestError.response?.data?.message ??
          "Unable to delete the question.",
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

  const calculateQuestionMarks = () => {
    return questions.reduce(
      (total, question) =>
        total + Number(question.marks || 0),
      0,
    );
  };

  if (loading) {
    return (
      <Loading message="Loading MCQ questions..." />
    );
  }

  if (error || !assessment) {
    return (
      <div className="content-card p-4">
        <div className="alert alert-danger mb-3">
          {error || "Assessment not found."}
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
            MCQ Questions
          </h1>

          <p className="page-subtitle">
            {assessment.subject?.subject_code}
            {" - "}
            {assessment.title}
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link
            to={`${basePath}/${id}`}
            className="btn btn-outline-light"
          >
            <FaArrowLeft className="me-2" />
            Back
          </Link>

          
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-4">
          <div className="stat-card">
            <div className="stat-icon">
              <FaQuestionCircle />
            </div>

            <h3 className="stat-number">
              {questions.length}
            </h3>

            <span className="stext">
              Total Questions
            </span>
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="stat-card">
            <div className="stat-icon">
              <FaCheckCircle />
            </div>

            <h3 className="stat-number">
              {calculateQuestionMarks()}
            </h3>

            <span className="stext">
              Question Marks
            </span>
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="stat-card">
            <div className="stat-icon">
              <FaQuestionCircle />
            </div>

            <h3 className="stat-number">
              {assessment.total_marks ?? 0}
            </h3>

            <span className="stext">
              Assessment Total Marks
            </span>
          </div>
        </div>
      </div>

      {calculateQuestionMarks() !==
        Number(assessment.total_marks) && (
        <div className="alert alert-warning">
          Question marks currently total{" "}
          <strong>
            {calculateQuestionMarks()}
          </strong>
          , but the assessment total is{" "}
          <strong>
            {assessment.total_marks}
          </strong>
          .
        </div>
      )}

      <div className="content-card">
          

        {questions.length === 0 ? (
          <div className="text-center py-5">
            <div className="stat-icon mx-auto mb-3">
              <FaQuestionCircle />
            </div>

            <h4 className="stext">
              No questions added
            </h4>

            <p className="page-subtitle">
              Add the first question to this MCQ
              assessment.
            </p>

            <Link
              to={`${basePath}/${id}/questions/create`}
              className="btn btn-system"
            >
              <FaPlus className="me-2" />
              Add First Question
            </Link>
          </div>
        ) : (
          <div className="mcq-question-list">
            {questions.map(
              (question, questionIndex) => (
                <div
                  className="mcq-question-card"
                  key={question.id}
                >
                  <div className="mcq-question-card-header">
                    <div className="d-flex align-items-center gap-3">
                      <div className="mcq-question-order">
                        {questionIndex + 1}
                      </div>

                      <div>
                        <span className="student-subject-code">
                          Question{" "}
                          {question.order_number}
                        </span>

                        <h4 className="mcq-question-text">
                          {question.question_text}
                        </h4>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-info text-dark">
                        {question.marks}{" "}
                        {Number(question.marks) === 1
                          ? "Mark"
                          : "Marks"}
                      </span>

                      <Link
                        to={`${basePath}/${id}/questions/${question.id}/edit`}
                        className="btn btn-sm btn-outline-warning"
                        title="Edit question"
                      >
                        <FaEdit />
                      </Link>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        title="Delete question"
                        onClick={() =>
                          handleDelete(question)
                        }
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="mcq-question-options">
                    {question.options?.map(
                      (option, optionIndex) => (
                        <div
                          key={option.id}
                          className={`mcq-question-option ${
                            option.is_correct
                              ? "correct"
                              : ""
                          }`}
                        >
                          <div className="mcq-option-number">
                            {String.fromCharCode(
                              65 + optionIndex,
                            )}
                          </div>

                          <span>
                            {option.option_text}
                          </span>

                          {option.is_correct && (
                            <span className="mcq-correct-badge">
                              <FaCheckCircle />
                              Correct Answer
                            </span>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
        <Link
            to={`${basePath}/${id}/questions/create`}
            className="btn btn-system me-2 mb-3 mt-3 justify-content-center d-flex align-items-center " 
          >
            <FaPlus className="me-2" />
            Add Next Question
          </Link>
      </div>
    </>
  );
}

export default AssessmentQuestionList;