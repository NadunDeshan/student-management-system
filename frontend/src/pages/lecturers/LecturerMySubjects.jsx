import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaEye, FaGraduationCap, FaUsers } from "react-icons/fa";

import api from "../../api/axios";
import Loading from "../../components/Loading";
import DocumentTitle from "../../hooks/DocumentTitle.js";

function LecturerMySubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  DocumentTitle("My Subjects");

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/lecturer/subjects");

        setSubjects(response.data.subjects ?? []);
      } catch (requestError) {
        console.error(requestError);

        setError(
          requestError.response?.data?.message ??
            "Unable to load your subjects.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  if (loading) {
    return <Loading message="Loading your subjects..." />;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Subjects</h1>

          <p className="page-subtitle">
            View subjects assigned to your lecturer account.
          </p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!error && subjects.length === 0 ? (
        <div className="content-card text-center py-5">
          <div className="stat-icon mx-auto mb-3">
            <FaBook />
          </div>

          <h4 className="stext">No subjects assigned</h4>

          <p className="page-subtitle mb-0">
            An administrator has not assigned any subjects to your account yet.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {subjects.map((subject) => (
            <div className="col-md-6 col-xl-4" key={subject.id}>
              <div className="student-subject-card">
                <div className="student-subject-header">
                  <div className="stat-icon">
                    <FaBook />
                  </div>

                  <span className="student-subject-code">
                    {subject.subject_code}
                  </span>
                </div>

                <h3 className="student-subject-name">{subject.subject_name}</h3>

                <p className="student-subject-description">
                  {subject.description || "No description available."}
                </p>

                <div className="student-subject-meta">
                  <div>
                    <FaGraduationCap />

                    <span>Semester {subject.semester}</span>
                  </div>

                  <div>
                    <FaBook />

                    <span>{subject.credits} Credits</span>
                  </div>

                  <div>
                    <FaUsers />

                    <span>
                      {subject.students_count ?? 0} Registered Students
                    </span>
                  </div>
                  <Link
                      to={`/lecturer/subjects/${subject.id}`}
                      className="btn btn-system w-100 mt-4"
                    >
                      <FaEye className="me-2" />
                      View Students
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default LecturerMySubjects;
