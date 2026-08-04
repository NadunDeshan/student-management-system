import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";

import {
  createAssessmentQuestion,
} from "../../api/questionApi";

import AssessmentQuestionForm
  from "../../components/AssessmentQuestionForm";

import DocumentTitle
  from "../../hooks/DocumentTitle.js";

const initialFormData = {
  question_text: "",
  marks: 1,
  order_number: "",
  options: [
    {
      id: null,
      option_text: "",
      is_correct: true,
      order_number: 1,
    },
    {
      id: null,
      option_text: "",
      is_correct: false,
      order_number: 2,
    },
  ],
};

function AssessmentQuestionCreate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    initialFormData,
  );

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] =
    useState(false);

  DocumentTitle("Add MCQ Question");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}",
  );

  const basePath =
    user.role === "lecturer"
      ? "/lecturer/assessments"
      : "/admin/assessments";

  const buildPayload = () => {
    return {
      question_text: formData.question_text,
      marks: Number(formData.marks),

      order_number:
        formData.order_number !== ""
          ? Number(formData.order_number)
          : null,

      options: formData.options.map(
        (option, index) => ({
          option_text: option.option_text,
          is_correct:
            Boolean(option.is_correct),

          order_number:
            option.order_number ??
            index + 1,
        }),
      ),
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setErrors({});

      const payload = buildPayload();

      const response =
        await createAssessmentQuestion(
          id,
          payload,
        );

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title:
          response.message ??
          "MCQ question created successfully.",
        showConfirmButton: false,
        timer: 1600,
        timerProgressBar: true,
        background: "rgb(135 227 169)",
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
          "Unable to create the MCQ question.",
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

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Add MCQ Question
          </h1>

          <p className="page-subtitle">
            Add a question, answer options,
            and select one correct answer.
          </p>
        </div>

        <Link
          to={`${basePath}/${id}/questions`}
          className="btn btn-outline-light"
        >
          <FaArrowLeft className="me-2" />
          Back to Questions
        </Link>
      </div>

      <div className="content-card p-4">
        <AssessmentQuestionForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitText="Create Question"
        />
      </div>
    </>
  );
}

export default AssessmentQuestionCreate;