import { useEffect, useState } from 'react';
import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';
import Swal from 'sweetalert2';

import {
    getSubject,
    updateSubject,
} from '../../api/subjectApi';

import { getLecturers } from '../../api/lecturerApi';

import Loading from '../../components/Loading';
import SubjectForm from '../../components/SubjectForm';
import DocumentTitle from '../../hooks/DocumentTitle.js';

function SubjectEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [lecturers, setLecturers] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [loadError, setLoadError] = useState('');

    DocumentTitle('Edit Subject');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setLoadError('');

                const [
                    subjectResult,
                    lecturerResult,
                ] = await Promise.all([
                    getSubject(id),
                    getLecturers(),
                ]);

                const subject = subjectResult.data;

                setFormData({
                    lecturer_id:
                        subject.lecturer_id ?? '',

                    subject_code:
                        subject.subject_code ?? '',

                    subject_name:
                        subject.subject_name ?? '',

                    description:
                        subject.description ?? '',

                    credits:
                        subject.credits ?? '',

                    semester:
                        subject.semester ?? '',
                });

                setLecturers(
                    lecturerResult.data ?? []
                );
            } catch (requestError) {
                console.error(requestError);

                if (
                    requestError.response?.status === 404
                ) {
                    setLoadError('Subject not found.');
                } else {
                    setLoadError(
                        'Unable to load the subject.'
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setErrors({});

            await updateSubject(id, formData);

            await Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'The subject was updated successfully.',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                background: 'rgb(135 227 169)',
                color: '#1f2937',
                iconColor: 'rgb(7 117 48)',
                width: '350px',
            });

            navigate(`/admin/subjects/${id}`);
        } catch (requestError) {
            if (
                requestError.response?.status === 422
            ) {
                setErrors(
                    requestError.response.data.errors ?? {}
                );

                return;
            }

            if (
                requestError.response?.status === 404
            ) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Subject not found',
                    text: 'The subject no longer exists.',
                });

                navigate('/admin/subjects');

                return;
            }

            await Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Unable to update the subject.',
                showConfirmButton: false,
                timer: 1800,
                timerProgressBar: true,
                background: '#fee2e2',
                color: '#7f1d1d',
                iconColor: '#dc2626',
                width: '350px',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Loading message="Loading subject..." />
        );
    }

    if (loadError || !formData) {
        return (
            <div className="content-card p-4">
                <div className="alert alert-danger mb-3">
                    {loadError || 'Subject not found.'}
                </div>

                <Link
                    to="/admin/subjects"
                    className="btn btn-outline-light"
                >
                    Back to Subjects
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Edit Subject
                    </h1>

                    <p className="page-subtitle">
                        Update the selected subject information.
                    </p>
                </div>

                <Link
                    to={`/admin/subjects/${id}`}
                    className="btn btn-outline-light"
                >
                    Cancel
                </Link>
            </div>

            <div className="content-card p-4">
                {lecturers.length === 0 ? (
                    <div className="alert alert-warning mb-0">
                        No lecturers are available.
                    </div>
                ) : (
                    <SubjectForm
                        formData={formData}
                        setFormData={setFormData}
                        lecturers={lecturers}
                        errors={errors}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        submitText="Update Subject"
                    />
                )}
            </div>
        </>
    );
}

export default SubjectEdit;