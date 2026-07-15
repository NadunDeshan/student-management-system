import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function AdminLayout() {
    return (
        <div className="admin-layout">
            <Sidebar />

            <div className="admin-main">
                <Navbar />

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;