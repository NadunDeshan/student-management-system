import { useEffect, useState } from 'react';
import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';
import Swal from 'sweetalert2';

import {
    getAssessment,
    getAssessmentSubjects,
    updateAssessment,
} from '../../api/assessmentApi';

import AssessmentForm from '../../components/AssessmentForm';
import Loading from '../../components/Loading';
import DocumentTitle from '../../hooks/DocumentTitle.js';

function AssessmentEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [errors, setErrors] = useState({});

    const [existingAttachmentUrl, setExistingAttachmentUrl] =
        useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [loadError, setLoadError] = useState('');

    DocumentTitle('Edit Assessment');

    const user = JSON.parse(
        localStorage.getItem('user') || '{}'
    );

    const basePath =
        user.role === 'lecturer'
            ? '/lecturer/assessments'
            : '/admin/assessments';

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setLoadError('');

                const [
                    assessmentResult,
                    subjectResult,
                ] = await Promise.all([
                    getAssessment(id),
                    getAssessmentSubjects(),
                ]);

                const assessment =
                    assessmentResult.data;

                setFormData({
                    subject_id:
                        assessment.subject_id ?? '',

                    title:
                        assessment.title ?? '',

                    type:
                        assessment.type ?? '',

                    description:
                        assessment.description ?? '',

                    available_from:
                        assessment.available_from ?? '',

                    due_date:
                        assessment.due_date ?? '',

                    exam_date:
                        assessment.exam_date ?? '',

                    start_time:
                        assessment.start_time ?? '',

                    duration_minutes:
                        assessment.duration_minutes ?? '',

                    location:
                        assessment.location ?? '',

                    total_marks:
                        assessment.total_marks ?? '',

                    status:
                        assessment.status ?? 'draft',

                    attachment: null,
                });

                setExistingAttachmentUrl(
                    assessment.attachment_url ?? null
                );

                setSubjects(subjectResult ?? []);
            } catch (requestError) {
                console.error(requestError);

                if (
                    requestError.response?.status === 404
                ) {
                    setLoadError(
                        'Assessment not found.'
                    );
                } else if (
                    requestError.response?.status === 403
                ) {
                    setLoadError(
                        requestError.response?.data?.message ??
                        'You cannot edit this assessment.'
                    );
                } else {
                    setLoadError(
                        'Unable to load the assessment.'
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleAttachmentChange = (event) => {
        const file =
            event.target.files?.[0] ?? null;

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

        Object.entries(formData).forEach(
            ([key, value]) => {
                if (key === 'attachment') {
                    if (value instanceof File) {
                        data.append(key, value);
                    }

                    return;
                }

                if (
                    value !== null &&
                    value !== undefined &&
                    value !== ''
                ) {
                    data.append(key, value);
                }
            }
        );

        return data;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setErrors({});

            const data = buildFormData();

            await updateAssessment(id, data);

            await Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title:
                    'Assessment updated successfully.',
                showConfirmButton: false,
                timer: 1600,
                timerProgressBar: true,
                background: 'rgb(135 227 169)',
                color: '#1f2937',
                iconColor: 'rgb(7 117 48)',
                width: '350px',
            });

            navigate(`${basePath}/${id}`);
        } catch (requestError) {
            if (
                requestError.response?.status === 422
            ) {
                setErrors(
                    requestError.response.data.errors ??
                    {}
                );

                return;
            }

            if (
                requestError.response?.status === 404
            ) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Assessment not found',
                    text:
                        'The assessment no longer exists.',
                });

                navigate(basePath);

                return;
            }

            await Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title:
                    requestError.response?.data?.message ??
                    'Unable to update the assessment.',
                showConfirmButton: false,
                timer: 1900,
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
            <Loading message="Loading assessment..." />
        );
    }

    if (loadError || !formData) {
        return (
            <div className="content-card p-4">
                <div className="alert alert-danger mb-3">
                    {loadError ||
                        'Assessment not found.'}
                </div>

                <Link
                    to={basePath}
                    className="btn btn-outline-light"
                >
                    Back to Assessments
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Edit Assessment
                    </h1>

                    <p className="page-subtitle">
                        Update the selected assessment
                        information.
                    </p>
                </div>

                <Link
                    to={`${basePath}/${id}`}
                    className="btn btn-outline-light"
                >
                    Cancel
                </Link>
            </div>

            <div className="content-card p-4">
                {subjects.length === 0 ? (
                    <div className="alert alert-warning mb-0">
                        No subjects are available.
                    </div>
                ) : (
                    <AssessmentForm
                        formData={formData}
                        setFormData={setFormData}
                        subjects={subjects}
                        errors={errors}
                        onAttachmentChange={
                            handleAttachmentChange
                        }
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        submitText="Update Assessment"
                        existingAttachmentUrl={
                            existingAttachmentUrl
                        }
                    />
                )}
            </div>
        </>
    );
}

export default AssessmentEdit;