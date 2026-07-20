import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createStudent } from '../../api/studentApi';
import StudentForm from '../../components/StudentForm';
import DocumentTitle from "../../hooks/DocumentTitle.js";
import defaultAvatar from '../../assets/images/default-avatar.png';


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
    const navigate = useNavigate();  //Allows React to move the user to another route without refreshing the entire browser page.

    const [formData, setFormData] =  //formData contains the current values.  setFormData changes those values.
        useState(initialFormData);  //Stores the values currently entered in the form.   This information is temporary browser memory.

    const [imagePreview, setImagePreview] = useState(defaultAvatar); //Stores a temporary browser URL used to display the selected profile image before uploading it.
    const [errors, setErrors] = useState({});   //Stores validation errors returned from Laravel.
    const [submitting, setSubmitting] = useState(false); //Tracks whether the API request is currently running.

    const handleImageChange = (event) => {    //Runs when the user chooses an image file.
        const file = event.target.files[0] ?? null;

        setFormData((current) => ({  //Updates only the profile_image field while keeping all existing form values.
            ...current,   //copies all existing values. The spread operator:
            profile_image: file,
        }));

        if (file) {
            setImagePreview(URL.createObjectURL(file));  //Creates a temporary URL so the browser can display the chosen image.It only displays it locally.
        } else {
            setImagePreview(defaultAvatar);
        }
    };


    //Controls the complete form submission process.
    //
    // It:
    //
    // prevents page refresh
    // prepares data
    // calls the API
    // handles success
    // handles validation errors
    // handles other errors
    // updates loading state
    const handleSubmit = async (event) => {
        event.preventDefault();  //Without it, the browser would refresh the entire page after submission.

        try {  //Marks that the request has started.
            setSubmitting(true); //This is normally used to prevent the user from clicking the submit button multiple times.
            setErrors({});  //Removes validation errors from the previous submission. For example, an old email error should disappear before checking the new submission.

            //Preparing API data

            const data = new FormData(); //Creates a special request body that can contain:

            Object.entries(formData).forEach(([key, value]) => {  //Converts the form object into key-value pairs.
                // like this
                //[
                //     ['first_name', 'Nadun'],
                //     ['email', 'nadun@email.com']
                // ]

                if (  //Prevents empty values from being added to the request. Only values containing actual data are submitted.
                    value !== null &&
                    value !== undefined &&
                    value !== ''
                ) {
                    data.append(key, value); //Adds each field to the API request body.
                }
            });

            await createStudent(data);  //Sends the prepared data to the Laravel API. This line connects two layers: Frontend → API

            await Swal.fire({
                // title: 'Student created',
                // text: 'The student was created successfully.',
                // icon: 'success',
                // timer: 1600,
                // showConfirmButton: false,
                toast: true,
                position: "top-end",
                icon: "success",
                title: "The student was created successfully.",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: "rgb(135 227 169)",
                color: "#1f2937",
                iconColor: "rgb(7 117 48)",
                width: "350px",
            });

            navigate('/admin/students');  //Redirects the user to the student list after successful creation.

            //Error handling  Runs when the API request fails.
        } catch (requestError) {
            if (requestError.response?.status === 422) {  //Checks whether Laravel returned HTTP status 422.
                setErrors(
                    requestError.response.data.errors ?? {}  //Takes Laravel’s validation errors and stores them in React state.
                );

                return;
            }

            await Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Unable to create the student.",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: "#fee2e2",
                color: "#7f1d1d",
                iconColor: "#dc2626",
                width: "350px",
            });

        } finally {
            setSubmitting(false); //It resets the loading state.
        }
    };
    DocumentTitle('Add Student')

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

                <Link  //Navigates to the student list without a full page refresh.
                    to="/admin/students"
                    className="btn btn-outline-secondary stext "
                >
                    Back to Students
                </Link>
            </div>

            <div className="content-card p-4">
                <StudentForm   //Displays the actual reusable student form.
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