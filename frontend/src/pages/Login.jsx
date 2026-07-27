import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setMessage('');

        try {
            const response = await api.post('/login', formData);

            const token = response.data.token;
            const user = response.data.user;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'student') {
                navigate('/student/dashboard');
            } else if (user.role === 'lecturer') {
                navigate('/lecturer/dashboard');
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message ??
                'Unable to log in. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card ">
                <div className="login-brand">
                    <div className="login-brand-icon">
                        SMS
                    </div>

                    <div>
                        <h1>Student Management</h1>
                        <p>Secure system access</p>
                    </div>
                </div>

                <div className="login-heading">
                    <h2>Welcome Back</h2>
                    <p>
                        Enter your account details to continue.
                    </p>
                </div>

                {message && (
                    <div className="login-error">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label
                            htmlFor="email"
                            className="form-label"
                        >
                            Email address
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control login-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="form-label"
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control login-input"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-system login-button"
                        disabled={loading}
                    >
                        {loading
                            ? 'Logging in...'
                            : 'Login to Dashboard'}
                    </button>
                </form>

                <p className="login-footer">
                    Admin, student and lecturer accounts use the
                    same login page.
                </p>
            </div>
        </div>
    );
}

export default Login;