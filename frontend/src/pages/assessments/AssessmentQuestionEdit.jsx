import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";

import {
  getAssessmentQuestion,
  updateAssessmentQuestion,
} from "../../api/questionApi";

import AssessmentQuestionForm
  from "../../components/AssessmentQuestionForm";

import Loading
  from "../../components/Loading";

import DocumentTitle
  from "../../hooks/DocumentTitle.js";

function AssessmentQuestionEdit() {
  const {
    id,
    questionId,
  } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState(null);

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [loadError, setLoadError] =
    useState("");

  DocumentTitle("Edit MCQ Question");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}",
  );

  const basePath =
    user.role === "lecturer"
      ? "/lecturer/assessments"
      : "/admin/assessments";

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const result =
          await getAssessmentQuestion(
            id,
            questionId,
          );

        const question =
          result.data;

        setFormData({
          question_text:
            question.question_text ?? "",

          marks:
            question.marks ?? 1,

          order_number:
            question.order_number ?? "",

          options:
            (question.options ?? []).map(
              (option, index) => ({
                id:
                  option.id ?? null,

                option_text:
                  option.option_text ?? "",

                is_correct:
                  Boolean(
                    option.is_correct,
                  ),

                order_number:
                  option.order_number ??
                  index + 1,
              }),
            ),
        });
      } catch (requestError) {
        console.error(requestError);

        if (
          requestError.response?.status ===
          404
        ) {
          setLoadError(
            "MCQ question not found.",
          );
        } else if (
          requestError.response?.status ===
          403
        ) {
          setLoadError(
            requestError.response?.data
              ?.message ??
              "You cannot edit this question.",
          );
        } else if (
          requestError.response?.status ===
          422
        ) {
          setLoadError(
            requestError.response?.data
              ?.message ??
              "This assessment is not an MCQ quiz.",
          );
        } else {
          setLoadError(
            "Unable to load the MCQ question.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [id, questionId]);

  const buildPayload = () => {
    return {
      question_text:
        formData.question_text,

      marks:
        Number(formData.marks),

      order_number:
        formData.order_number !== ""
          ? Number(
              formData.order_number,
            )
          : null,

      options:
        formData.options.map(
          (option, index) => {
            const optionData = {
              option_text:
                option.option_text,

              is_correct:
                Boolean(
                  option.is_correct,
                ),

              order_number:
                option.order_number ??
                index + 1,
            };

            if (option.id) {
              optionData.id = option.id;
            }

            return optionData;
          },
        ),
    };
  };

  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setErrors({});

      const payload =
        buildPayload();

      const response =
        await updateAssessmentQuestion(
          id,
          questionId,
          payload,
        );

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title:
          response.message ??
          "MCQ question updated successfully.",
        showConfirmButton: false,
        timer: 1600,
        timerProgressBar: true,
        background:
          "rgb(135 227 169)",
        color: "#1f2937",
        iconColor: "rgb(7 117 48)",
        width: "350px",
      });

      navigate(
        `${basePath}/${id}/questions`,
      );
    } catch (requestError) {
      console.error(requestError);

      if (
        requestError.response?.status ===
        422
      ) {
        setErrors(
          requestError.response.data
            .errors ?? {},
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
          "Unable to update the MCQ question.",
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
      <Loading message="Loading MCQ question..." />
    );
  }

  if (
    loadError ||
    !formData
  ) {
    return (
      <div className="content-card p-4">
        <div className="alert alert-danger mb-3">
          {loadError ||
            "MCQ question not found."}
        </div>

        <Link
          to={`${basePath}/${id}/questions`}
          className="btn btn-outline-light"
        >
          <FaArrowLeft className="me-2" />
          Back to Questions
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Edit MCQ Question
          </h1>

          <p className="page-subtitle">
            Update the question,
            options, marks, and correct
            answer.
          </p>
        </div>

        <Link
          to={`${basePath}/${id}/questions`}
          className="btn btn-outline-light"
        >
          <FaArrowLeft className="me-2" />
          Cancel
        </Link>
      </div>

      <div className="content-card p-4">
        <AssessmentQuestionForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitText="Update Question"
        />
      </div>
    </>
  );
}

export default AssessmentQuestionEdit;