import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    createAssessment,
    getAssessmentSubjects,
} from '../../api/assessmentApi';

import AssessmentForm from "../../components/AssessmentForm";
import DocumentTitle from "../../hooks/DocumentTitle.js";

const initialFormData = {
  subject_id: "",
  title: "",
  type: "",
  description: "",
  available_from: "",
  due_date: "",
  exam_date: "",
  start_time: "",
  duration_minutes: "",
  location: "",
  total_marks: "",
  status: "draft",
  attachment: null,
};

function AssessmentCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);

  const [subjects, setSubjects] = useState([]);

  const [errors, setErrors] = useState({});

  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [loadError, setLoadError] = useState("");

  DocumentTitle("Create Assessment");

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoadingSubjects(true);
        setLoadError("");

        const result = await getAssessmentSubjects();

        setSubjects(result);

      } catch (requestError) {
        console.error(requestError);

        setLoadError("Unable to load subjects.");
      } finally {
        setLoadingSubjects(false);
      }
    };

    loadSubjects();
  }, []);

  const handleAttachmentChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    setFormData((current) => ({
      ...current,
      attachment: file,
    }));

    setErrors((current) => ({
      ...current,
      attachment: undefined,
    }));
  };

  const buildFormData = () => {
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "attachment") {
        if (value instanceof File) {
          data.append(key, value);
        }

        return;
      }

      if (value !== null && value !== undefined && value !== "") {
        data.append(key, value);
      }
    });

    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setErrors({});

      const data = buildFormData();

      await createAssessment(data);

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Assessment created successfully.",
        showConfirmButton: false,
        timer: 1600,
        timerProgressBar: true,
        background: "rgb(135 227 169)",
        color: "#1f2937",
        iconColor: "rgb(7 117 48)",
        width: "350px",
      });

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user.role === "lecturer") {
        navigate("/lecturer/assessments");
      } else {
        navigate("/admin/assessments");
      }
    } catch (requestError) {
      if (requestError.response?.status === 422) {
        setErrors(requestError.response.data.errors ?? {});

        return;
      }

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title:
          requestError.response?.data?.message ??
          "Unable to create the assessment.",
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

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const backPath =
    user.role === "lecturer" ? "/lecturer/assessments" : "/admin/assessments";

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Assessment</h1>

          <p className="page-subtitle">
            Create a written exam, assignment, or MCQ quiz.
          </p>
        </div>

        <Link to={backPath} className="btn btn-outline-light">
          Back to Assessments
        </Link>
      </div>

      <div className="content-card p-4">
        {loadError && <div className="alert alert-danger">{loadError}</div>}

        {loadingSubjects ? (
          <p className="stext mb-0">Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <div className="alert alert-warning mb-0">
            No subjects are available.
          </div>
        ) : (
          <AssessmentForm
            formData={formData}
            setFormData={setFormData}
            subjects={subjects}
            errors={errors}
            onAttachmentChange={handleAttachmentChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitText="Create Assessment"
          />
        )}
      </div>
    </>
  );
}

export default AssessmentCreate;
