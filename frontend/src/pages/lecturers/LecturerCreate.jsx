import { useEffect, useState } from 'react';
import {Link, useNavigate,} from 'react-router-dom';
import Swal from 'sweetalert2';
import {createLecturer,} from '../../api/lecturerApi';
import LecturerForm from '../../components/LecturerForm';
import DocumentTitle from "../../hooks/DocumentTitle.js";
import defaultAvatar from '../../assets/images/default-avatar.png';

const initialFormData = {
    lecturer_number: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    department: '',
    specialization: '',
    hire_date: '',
    status: 'active',
    profile_image: null,
};

function LecturerCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] =
        useState(initialFormData);

    const [imagePreview, setImagePreview] =
        useState(defaultAvatar);

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] =
        useState(false);

    DocumentTitle('Add Lecturer');


    /**
     * Remove the generated image preview URL when
     * the component is removed.
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
     * Handle lecturer image selection.
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
        } else {
            setImagePreview(defaultAvatar);
        }
    };

    /**
     * Convert lecturer form values into FormData.
     */
    const buildFormData = () => {
        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            /*
             * Keep nullable text fields as empty strings.
             * Do not append a profile image when no file exists.
             */
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
     * Submit lecturer to Laravel.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setErrors({});

            const data = buildFormData();

            await createLecturer(data);

            await Swal.fire({
                // title: 'Lecturer created',
                // text: 'The lecturer was created successfully.',
                // icon: 'success',
                // timer: 1600,
                // showConfirmButton: false,
                toast: true,
                position: "top-end",
                icon: "success",
                title: "The lecturer was created successfully",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                background: "rgb(135 227 169)",
                color: "#1f2937",
                iconColor: "rgb(7 117 48)",
                width: "350px",
            });

            navigate('/admin/lecturers');
        } catch (requestError) {
            if (requestError.response?.status === 422) {
                setErrors(
                    requestError.response.data.errors ?? {}
                );

                return;
            }

            const message =
                requestError.response?.data?.message ??
                'Unable to create the lecturer.';

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Unable to create the Lecturer.",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                background: "#fee2e2",
                color: "#7f1d1d",
                iconColor: "#dc2626",
                width: "350px",
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
                        Add Lecturer
                    </h1>

                    <p className="page-subtitle">
                        Enter the new lecturer's information.
                    </p>
                </div>

                <Link
                    to="/admin/lecturers"
                    className="btn btn-outline-secondary stext"
                >
                    Back to Lecturers
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
                    submitText="Create Lecturer"
                />
            </div>
        </>
    );
}

export default LecturerCreate;