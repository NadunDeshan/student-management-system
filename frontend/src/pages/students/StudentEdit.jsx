import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    getStudent,
    updateStudent,
} from '../../api/studentApi';
import Loading from '../../components/Loading';
import StudentForm from '../../components/StudentForm';

function StudentEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        const loadStudent = async () => {
            try {
                const result = await getStudent(id);
                const student = result.data;

                setFormData({
                    student_number:
                        student.student_number ?? '',
                    first_name: student.first_name ?? '',
                    last_name: student.last_name ?? '',
                    email: student.email ?? '',
                    phone_number:
                        student.phone_number ?? '',
                    date_of_birth:
                        student.date_of_birth ?? '',
                    gender: student.gender ?? '',
                    address: student.address ?? '',
                    course: student.course ?? '',
                    enrollment_date:
                        student.enrollment_date ?? '',
                    status: student.status ?? 'active',
                    profile_image: null,
                });

                setImagePreview(
                    student.profile_image_url ?? ''
                );
            } catch (requestError) {
                console.error(requestError);

                setLoadError('Student could not be loaded.');
            } finally {
                setLoading(false);
            }
        };

        loadStudent();
    }, [id]);

    const handleImageChange = (event) => {
        const file = event.target.files[0] ?? null;

        setFormData((current) => ({
            ...current,
            profile_image: file,
        }));

        if (file) {
            setImagePreview(URL.createObjectURL(file));
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

            await updateStudent(id, data);

            await Swal.fire({
                title: 'Student updated',
                text: 'The student was updated successfully.',
                icon: 'success',
                timer: 1600,
                showConfirmButton: false,
            });

            navigate(`/admin/students/${id}`);
        } catch (requestError) {
            if (requestError.response?.status === 422) {
                setErrors(
                    requestError.response.data.errors ?? {}
                );

                return;
            }

            Swal.fire(
                'Update failed',
                'Unable to update the student.',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loading message="Loading student..." />;
    }

    if (loadError || !formData) {
        return (
            <div className="alert alert-danger">
                {loadError || 'Student not found.'}
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Edit Student
                    </h1>

                    <p className="page-subtitle">
                        Update the selected student's information.
                    </p>
                </div>

                <Link
                    to={`/admin/students/${id}`}
                    className="btn btn-outline-secondary"
                >
                    Cancel
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
                    submitText="Update Student"
                />
            </div>
        </>
    );
}

export default StudentEdit;