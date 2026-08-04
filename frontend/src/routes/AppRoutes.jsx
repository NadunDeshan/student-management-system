import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
import ComingSoon from "../pages/ComingSoon";
import Login from "../pages/Login";

import AdminDashboard from "../pages/dashboard/AdminDashboard";
import StudentDashboard from "../pages/dashboard/StudentDashboard";
import LecturerDashboard from "../pages/dashboard/LecturerDashboard";

import StudentCreate from "../pages/students/StudentCreate";
import StudentDetails from "../pages/students/StudentDetails";
import StudentEdit from "../pages/students/StudentEdit";
import StudentList from "../pages/students/StudentList";
import StudentProfile from "../pages/students/StudentProfile";

import LecturerList from "../pages/lecturers/LecturerList";
import LecturerCreate from "../pages/lecturers/LecturerCreate";
import LecturerEdit from "../pages/lecturers/LecturerEdit";
import LecturerDetails from "../pages/lecturers/LecturerDetails";

import SubjectList from "../pages/subjects/SubjectList";
import SubjectCreate from "../pages/subjects/SubjectCreate";
import SubjectDetails from "../pages/subjects/SubjectDetails";
import SubjectEdit from "../pages/subjects/SubjectEdit";

import StudentSubjects from "../pages/students/StudentSubjects";
import StudentMySubjects from "../pages/students/StudentMySubjects";
import LecturerMySubjects from "../pages/lecturers/LecturerMySubjects";
import LecturerSubjectStudents from "../pages/lecturers/LecturerSubjectStudents";

import AssessmentList from "../pages/assessments/AssessmentList";
import AssessmentCreate from "../pages/assessments/AssessmentCreate";
import AssessmentDetails from "../pages/assessments/AssessmentDetails";
import AssessmentEdit from "../pages/assessments/AssessmentEdit";
import AssignmentSubmissions from "../pages/assessments/AssignmentSubmissions";
import GradeAssignmentSubmission from "../pages/assessments/GradeAssignmentSubmission";
import AssessmentQuestionList from "../pages/assessments/AssessmentQuestionList";
import AssessmentQuestionCreate from "../pages/assessments/AssessmentQuestionCreate";
import AssessmentQuestionEdit from "../pages/assessments/AssessmentQuestionEdit";
import StudentQuiz from "../pages/students/StudentQuiz";
import StudentQuizResult from "../pages/students/StudentQuizResult";
import AssessmentQuizAttempts from "../pages/assessments/AssessmentQuizAttempts";
import StudentMyAssessments from "../pages/students/StudentMyAssessments";
import StudentAssessmentDetails from "../pages/students/StudentAssessmentDetails";
import AssessmentQuizAttemptDetails from "../pages/assessments/AssessmentQuizAttemptDetails";

function getCurrentUser() {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return null;
  }
}
// function AdminRoute({ children }) {
//     const token = localStorage.getItem('token');
//     const user = getCurrentUser();
//
//     if (!token || !user) {
//         return <Navigate to="/login" replace />;
//     }
//
//     if (user.role !== 'admin') {
//         return <Navigate to={`/${user.role}/dashboard`} replace />;
//     }
//
//     return children;
// }
function RoleRoute({ allowedRole, children }) {
  const token = localStorage.getItem("token");
  const user = getCurrentUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
}
function HomeRedirect() {
  const token = localStorage.getItem("token");
  const user = getCurrentUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/${user.role}/dashboard`} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <RoleRoute allowedRole="admin">
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="students" element={<StudentList />} />
        <Route path="students/create" element={<StudentCreate />} />
        <Route path="students/:id/subjects" element={<StudentSubjects />} />
        <Route path="students/:id" element={<StudentDetails />} />
        <Route path="students/:id/edit" element={<StudentEdit />} />

        <Route path="lecturers" element={<LecturerList />} />
        <Route path="lecturers/create" element={<LecturerCreate />} />
        <Route path="lecturers/:id" element={<LecturerDetails />} />
        <Route path="lecturers/:id/edit" element={<LecturerEdit />} />

        <Route path="subjects" element={<SubjectList />} />
        <Route path="subjects/create" element={<SubjectCreate />} />
        <Route path="subjects/:id" element={<SubjectDetails />} />
        <Route path="subjects/:id/edit" element={<SubjectEdit />} />

        <Route path="assessments" element={<AssessmentList />} />
        <Route path="assessments/create" element={<AssessmentCreate />} />
        <Route path="assessments/:id" element={<AssessmentDetails />} />
        <Route path="assessments/:id/edit" element={<AssessmentEdit />} />
        <Route
          path="assessments/:id/quiz-attempts"
          element={<AssessmentQuizAttempts />}
        />
        <Route
          path="assessments/:id/questions"
          element={<AssessmentQuestionList />}
        />
        <Route
          path="assessments/:id/questions/create"
          element={<AssessmentQuestionCreate />}
        />
        <Route
          path="assessments/:id/submissions/:submissionId/grade"
          element={<GradeAssignmentSubmission />}
        />
        <Route
          path="assessments/:id/submissions"
          element={<AssignmentSubmissions />}
        />
        <Route
          path="assessments/:id/questions/:questionId/edit"
          element={<AssessmentQuestionEdit />}
        />
        <Route
          path="assessments/:id/quiz-attempts/:attemptId"
          element={<AssessmentQuizAttemptDetails />}
        />
      </Route>

      <Route
        path="/student"
        element={
          <RoleRoute allowedRole="student">
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />

        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="subjects" element={<StudentMySubjects />} />
        <Route path="assessments" element={<StudentMyAssessments />} />
        <Route path="assessments/:id" element={<StudentAssessmentDetails />} />
        <Route path="quizzes/:id" element={<StudentQuiz />} />
        <Route path="quizzes/:id/result" element={<StudentQuizResult />} />
      </Route>

      <Route
        path="/lecturer"
        element={
          <RoleRoute allowedRole="lecturer">
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/lecturer/dashboard" replace />} />
        <Route path="dashboard" element={<LecturerDashboard />} />

        <Route path="profile" element={<ComingSoon title="My Profile" />} />
        <Route path="subjects" element={<LecturerMySubjects />} />
        <Route path="subjects/:id" element={<LecturerSubjectStudents />} />

        <Route path="assessments" element={<AssessmentList />} />
        <Route path="assessments/create" element={<AssessmentCreate />} />
        <Route path="assessments/:id" element={<AssessmentDetails />} />
        <Route path="assessments/:id/edit" element={<AssessmentEdit />} />
        <Route
          path="assessments/:id/questions"
          element={<AssessmentQuestionList />}
        />
        <Route
          path="assessments/:id/questions/create"
          element={<AssessmentQuestionCreate />}
        />
        <Route
          path="assessments/:id/submissions/:submissionId/grade"
          element={<GradeAssignmentSubmission />}
        />
        <Route
          path="assessments/:id/submissions"
          element={<AssignmentSubmissions />}
        />
        <Route
          path="assessments/:id/questions/:questionId/edit"
          element={<AssessmentQuestionEdit />}
        />
        <Route
          path="assessments/:id/quiz-attempts"
          element={<AssessmentQuizAttempts />}
        />
        <Route
          path="assessments/:id/quiz-attempts/:attemptId"
          element={<AssessmentQuizAttemptDetails />}
        />

        <Route path="students" element={<ComingSoon title="My Students" />} />
        <Route path="exams" element={<ComingSoon title="Examinations" />} />
      </Route>

      <Route
        path="*"
        element={
          <div className="container py-5">
            <div className="alert alert-warning">Page not found.</div>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
