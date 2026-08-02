import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { createSubject } from '../../api/subjectApi';
import { getLecturers } from '../../api/lecturerApi';

import SubjectForm from '../../components/SubjectForm';
import DocumentTitle from '../../hooks/DocumentTitle.js';

const initialFormData = {
    lecturer_id: '',
    subject_code: '',
    subject_name: '',
    description: '',
    credits: '',
    semester: '',
};

function SubjectCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialFormData);
    const [lecturers, setLecturers] = useState([]);
    const [errors, setErrors] = useState({});
    const [loadingLecturers, setLoadingLecturers] =
        useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [loadError, setLoadError] = useState('');

    DocumentTitle('Add Subject');

    useEffect(() => {
        const loadLecturers = async () => {
            try {
                setLoadingLecturers(true);
                setLoadError('');

                const result = await getLecturers();

                setLecturers(result.data ?? []);
            } catch (requestError) {
                console.error(requestError);

                setLoadError(
                    'Unable to load lecturers for the subject form.'
                );
            } finally {
                setLoadingLecturers(false);
            }
        };

        loadLecturers();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setErrors({});

            await createSubject(formData);

            await Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'The subject was created successfully.',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                background: 'rgb(135 227 169)',
                color: '#1f2937',
                iconColor: 'rgb(7 117 48)',
                width: '350px',
            });

            navigate('/admin/subjects');
        } catch (requestError) {
            if (requestError.response?.status === 422) {
                setErrors(
                    requestError.response.data.errors ?? {}
                );

                return;
            }

            await Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Unable to create the subject.',
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

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Add Subject
                    </h1>

                    <p className="page-subtitle">
                        Enter the subject information and assign a lecturer.
                    </p>
                </div>

                <Link
                    to="/admin/subjects"
                    className="btn btn-outline-secondary stext"
                >
                    Back to Subjects
                </Link>
            </div>

            <div className="content-card p-4">
                {loadError && (
                    <div className="alert alert-danger">
                        {loadError}
                    </div>
                )}

                {loadingLecturers ? (
                    <p className="stext mb-0">
                        Loading lecturers...
                    </p>
                ) : lecturers.length === 0 ? (
                    <div className="alert alert-warning mb-0">
                        No lecturers are available. Create a lecturer before
                        creating a subject.
                    </div>
                ) : (
                    <SubjectForm
                        formData={formData}
                        setFormData={setFormData}
                        lecturers={lecturers}
                        errors={errors}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        submitText="Create Subject"
                    />
                )}
            </div>
        </>
    );
}

export default SubjectCreate;