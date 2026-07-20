import {useEffect, useState,} from 'react';
import {Link, useNavigate, useParams,} from 'react-router-dom';
import Swal from 'sweetalert2';
import {getLecturer, updateLecturer,} from '../../api/lecturerApi';
import Loading from '../../components/Loading';
import LecturerForm from '../../components/LecturerForm';
import DocumentTitle from "../../hooks/DocumentTitle.js";

function LecturerEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] =
        useState(null);

    const [imagePreview, setImagePreview] =
        useState('');

    const [errors, setErrors] =
        useState({});

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [loadError, setLoadError] =
        useState('');

    DocumentTitle('Edit Lecturer');

    /**
     * Load the lecturer from Laravel.
     */
    useEffect(() => {
        let ignore = false;

        const loadLecturer = async () => {
            try {
                setLoading(true);
                setLoadError('');

                const result = await getLecturer(id);
                const lecturer = result.data;

                if (ignore) {
                    return;
                }

                setFormData({
                    lecturer_number:
                        lecturer.lecturer_number ?? '',

                    first_name:
                        lecturer.first_name ?? '',

                    last_name:
                        lecturer.last_name ?? '',

                    email:
                        lecturer.email ?? '',

                    phone_number:
                        lecturer.phone_number ?? '',

                    address:
                        lecturer.address ?? '',

                    department:
                        lecturer.department ?? '',

                    specialization:
                        lecturer.specialization ?? '',

                    hire_date:
                        lecturer.hire_date ?? '',

                    status:
                        lecturer.status ?? 'active',

                    profile_image: null,
                });

                setImagePreview(
                    lecturer.profile_image_url ?? ''
                );
            } catch (requestError) {
                console.error(requestError);

                if (!ignore) {
                    setLoadError(
                        requestError.response?.status === 404
                            ? 'Lecturer not found.'
                            : 'Lecturer could not be loaded.'
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadLecturer();

        return () => {
            ignore = true;
        };
    }, [id]);

    /**
     * Clean up local image preview URLs.
     */
    useEffect(() => {
        return () => {
            if (
                imagePreview &&
                imagePreview.startsWith('blob:')
            ) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    /**
     * Select a new profile image.
     */
    const handleImageChange = (event) => {
        const file = event.target.files?.[0] ?? null;

        setFormData((current) => ({
            ...current,
            profile_image: file,
        }));

        setErrors((current) => ({
            ...current,
            profile_image: undefined,
        }));

        if (imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }

        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    /**
     * Create multipart data for Laravel.
     */
    const buildFormData = () => {
        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'profile_image') {
                if (value instanceof File) {
                    data.append(key, value);
                }

                return;
            }

            data.append(key, value ?? '');
        });

        return data;
    };

    /**
     * Submit updated lecturer values.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setErrors({});

            const data = buildFormData();

            await updateLecturer(id, data);

            await Swal.fire({
                // toast: true,
                // position: "top-end",
                // title: 'Lecturer updated',
                // text: 'The lecturer was updated successfully.',
                // icon: 'success',
                // timerProgressBar: true,
                // timer: 1600,
                // showConfirmButton: false,
                // iconColor: "rgb(7 117 48)",
                // width: "460px",
                toast: true,
                position: "top-end",
                icon: "success",
                title: "The lecturer was created successfully.",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: "rgb(135 227 169)",
                color: "#1f2937",
                iconColor: "rgb(7 117 48)",
                width: "350px",
            });


            navigate(`/admin/lecturers/${id}`);
        } catch (requestError) {
            if (requestError.response?.status === 422) {
                setErrors(
                    requestError.response.data.errors ?? {}
                );

                return;
            }

            if (requestError.response?.status === 404) {
                Swal.fire(
                    'Not found',
                    'The lecturer no longer exists.',
                    'error'
                );



                return;
            }

            const message =
                requestError.response?.data?.message ??
                'Unable to update the lecturer.';

            Swal.fire(
                'Update failed',
                message,
                'error'
            );

        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Loading message="Loading lecturer..." />
        );
    }

    if (loadError || !formData) {
        return (
            <div className="content-card p-4">
                <div className="alert alert-danger mb-3">
                    {loadError || 'Lecturer not found.'}
                </div>

                <Link
                    to="/admin/lecturers"
                    className="btn btn-outline-secondary"
                >
                    Back to Lecturers
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Edit Lecturer
                    </h1>

                    <p className="page-subtitle">
                        Update the selected lecturer's
                        information.
                    </p>
                </div>

                <Link
                    to={`/admin/lecturers/${id}`}
                    className="btn btn-outline-secondary"
                >
                    Cancel
                </Link>
            </div>

            <div className="content-card p-4">
                <LecturerForm
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    imagePreview={imagePreview}
                    onImageChange={handleImageChange}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    submitText="Update Lecturer"
                />
            </div>
        </>
    );
}

export default LecturerEdit;