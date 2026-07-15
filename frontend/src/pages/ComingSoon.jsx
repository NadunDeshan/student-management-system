import { Link } from 'react-router-dom';

function ComingSoon({ title }) {
    return (
        <div className="content-card p-5 text-center">
            <h2>{title}</h2>

            <p className="text-muted">
                This section will be implemented after the
                Student CRUD is complete.
            </p>

            <Link
                to="/admin/dashboard"
                className="btn btn-system"
            >
                Return to Dashboard
            </Link>
        </div>
    );
}

export default ComingSoon;