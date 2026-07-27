import {
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import AdminLayout from '../components/AdminLayout';
import ComingSoon from '../pages/ComingSoon';
import Login from '../pages/Login';

import AdminDashboard from '../pages/dashboard/AdminDashboard';
import StudentDashboard from '../pages/dashboard/StudentDashboard';
import LecturerDashboard from '../pages/dashboard/LecturerDashboard';

import StudentCreate from '../pages/students/StudentCreate';
import StudentDetails from '../pages/students/StudentDetails';
import StudentEdit from '../pages/students/StudentEdit';
import StudentList from '../pages/students/StudentList';
import StudentProfile from "../pages/students/StudentProfile";

import LecturerList from '../pages/lecturers/LecturerList';
import LecturerCreate from '../pages/lecturers/LecturerCreate';
import LecturerEdit from '../pages/lecturers/LecturerEdit';
import LecturerDetails from '../pages/lecturers/LecturerDetails';

function getCurrentUser() {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
        return null;
    }

    try {
        return JSON.parse(savedUser);
    } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');

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
    const token = localStorage.getItem('token');
    const user = getCurrentUser();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== allowedRole) {
        return (
            <Navigate
                to={`/${user.role}/dashboard`}
                replace
            />
        );
    }

    return children;
}

function HomeRedirect() {
    const token = localStorage.getItem('token');
    const user = getCurrentUser();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Navigate
            to={`/${user.role}/dashboard`}
            replace
        />
    );
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomeRedirect />}/>
            <Route path="/login" element={<Login />}/>

            <Route path="/admin" element={
                <RoleRoute allowedRole="admin"><AdminLayout /></RoleRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace/>}/>
                <Route path="dashboard" element={<AdminDashboard />}/>
                <Route path="students" element={<StudentList />}/>
                <Route path="students/create" element={<StudentCreate />}/>
                <Route path="students/:id" element={<StudentDetails />}/>
                <Route path="students/:id/edit" element={<StudentEdit />}/>
                <Route path="lecturers" element={<LecturerList />}/>
                <Route path="lecturers/create" element={<LecturerCreate />}/>
                <Route path="lecturers/:id" element={<LecturerDetails />}/>
                <Route path="lecturers/:id/edit" element={<LecturerEdit />}/>
                <Route path="subjects" element={<ComingSoon title="Subjects" />}/>
                <Route path="exams" element={<ComingSoon title="Exams" />}/>
            </Route>

            <Route path="/student" element={
                    <RoleRoute allowedRole="student"><AdminLayout /></RoleRoute>}>
                <Route index element={<Navigate to="/student/dashboard" replace/>}/>

                <Route path="dashboard" element={<StudentDashboard />}/>
                <Route path="profile" element={<StudentProfile />} />
                <Route path="subjects" element={<ComingSoon title="My Subjects" />}/>
                <Route path="exams" element={<ComingSoon title="My Exams" />}/>
            </Route>

            <Route path="/lecturer" element={
                    <RoleRoute allowedRole="lecturer"><AdminLayout /></RoleRoute>}>
                <Route index element={<Navigate to="/lecturer/dashboard" replace/>}/>
                <Route path="dashboard" element={<LecturerDashboard />}/>

                <Route path="profile" element={<ComingSoon title="My Profile" />}/>
                <Route path="subjects" element={<ComingSoon title="My Subjects" />}/>
                <Route path="students" element={<ComingSoon title="My Students" />}/>
                <Route path="exams" element={<ComingSoon title="Examinations" />}/>
            </Route>

            <Route path="*" element={
                    <div className="container py-5">
                        <div className="alert alert-warning">
                            Page not found.
                        </div>
                    </div>
                }
            />
        </Routes>
    );
}

export default AppRoutes;