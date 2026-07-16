import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createStudent } from '../../api/studentApi';
import StudentForm from '../../components/StudentForm';

const initialFormData = {
    student_number: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    address: '',
    course: '',
    enrollment_date: '',
    status: 'active',
    profile_image: null,
};

function StudentCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] =
        useState(initialFormData);

    const [imagePreview, setImagePreview] = useState('');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleImageChange = (event) => {
        const file = event.target.files[0] ?? null;

        setFormData((current) => ({
            ...current,
            profile_image: file,
        }));

        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setErrors({});

            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (
                    value !== null &&
                    value !== undefined &&
                    value !== ''
                ) {
                    data.append(key, value);
                }
            });

            await createStudent(data);

            await Swal.fire({
                title: 'Student created',
                text: 'The student was created successfully.',
                icon: 'success',
                timer: 1600,
                showConfirmButton: false,
            });

            navigate('/admin/students');
        } catch (requestError) {
            if (requestError.response?.status === 422) {
                setErrors(
                    requestError.response.data.errors ?? {}
                );

                return;
            }

            Swal.fire(
                'Creation failed',
                'Unable to create the student.',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Add Student
                    </h1>

                    <p className="page-subtitle">
                        Enter the new student's information.
                    </p>
                </div>

                <Link
                    to="/admin/students"
                    className="btn btn-outline-secondary stext "
                >
                    Back to Students
                </Link>
            </div>

            <div className="content-card p-4">
                <StudentForm
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    imagePreview={imagePreview}
                    onImageChange={handleImageChange}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    submitText="Create Student"
                />
            </div>
        </>
    );
}

export default StudentCreate;