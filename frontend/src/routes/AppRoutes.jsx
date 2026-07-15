import {
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import ComingSoon from '../pages/ComingSoon';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import StudentCreate from '../pages/students/StudentCreate';
import StudentDetails from '../pages/students/StudentDetails';
import StudentEdit from '../pages/students/StudentEdit';
import StudentList from '../pages/students/StudentList';

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate
                        to="/admin/dashboard"
                        replace
                    />
                }
            />

            <Route path="/admin" element={<AdminLayout />}>
                <Route
                    index
                    element={
                        <Navigate
                            to="/admin/dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="students"
                    element={<StudentList />}
                />

                <Route
                    path="students/create"
                    element={<StudentCreate />}
                />

                <Route
                    path="students/:id"
                    element={<StudentDetails />}
                />

                <Route
                    path="students/:id/edit"
                    element={<StudentEdit />}
                />

                <Route
                    path="lecturers"
                    element={<ComingSoon title="Lecturers" />}
                />

                <Route
                    path="subjects"
                    element={<ComingSoon title="Subjects" />}
                />

                <Route
                    path="exams"
                    element={<ComingSoon title="Exams" />}
                />
            </Route>

            <Route
                path="*"
                element={
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