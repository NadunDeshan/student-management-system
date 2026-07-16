const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

function StudentForm({
                         formData,
                         setFormData,
                         errors,
                         imagePreview,
                         onImageChange,
                         onSubmit,
                         submitting,
                         submitText,
                     }) {
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const fieldError = (fieldName) => {
        return errors[fieldName]?.[0] ?? '';
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="row g-3">
                <div className="col-12 text-center mb-3">
                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Student preview"
                            className="profile-preview"
                        />
                    ) : (
                        <div
                            className="student-image-placeholder mx-auto"
                            style={{
                                width: '110px',
                                height: '110px',
                                fontSize: '25px',
                            }}
                        >
                            IMG
                        </div>
                    )}
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                        Student number
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="text"
                        name="student_number"
                        className={`form-control ${
                            fieldError('student_number')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.student_number}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('student_number')}
                    </div>
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                        Profile image
                    </label>

                    <input
                        type="file"
                        className={`form-control ${
                            fieldError('profile_image')
                                ? 'is-invalid'
                                : ''
                        }`}
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={onImageChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('profile_image')}
                    </div>

                    <small className="stext">
                        JPG, PNG or WEBP. Maximum size: 2 MB.
                    </small>
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                        First name
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="text"
                        name="first_name"
                        className={`form-control ${
                            fieldError('first_name')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.first_name}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('first_name')}
                    </div>
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                        Last name
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="text"
                        name="last_name"
                        className={`form-control ${
                            fieldError('last_name')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.last_name}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('last_name')}
                    </div>
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                        Email
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="email"
                        name="email"
                        className={`form-control ${
                            fieldError('email')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('email')}
                    </div>
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                        Phone number
                    </label>

                    <input
                        type="text"
                        name="phone_number"
                        className={`form-control ${
                            fieldError('phone_number')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.phone_number}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('phone_number')}
                    </div>
                </div>

                <div className="col-md-4">
                    <label className="form-label">
                        Date of birth
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="date"
                        name="date_of_birth"
                        className={`form-control ${
                            fieldError('date_of_birth')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.date_of_birth}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('date_of_birth')}
                    </div>
                </div>

                <div className="col-md-4">
                    <label className="form-label">
                        Gender
                        <span className="required-mark"> *</span>
                    </label>

                    <select
                        name="gender"
                        className={`form-select ${
                            fieldError('gender')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select gender</option>

                        {genderOptions.map((option) => (
                            <option
                                value={option.value}
                                key={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <div className="invalid-feedback">
                        {fieldError('gender')}
                    </div>
                </div>

                <div className="col-md-4">
                    <label className="form-label">
                        Status
                        <span className="required-mark"> *</span>
                    </label>

                    <select
                        name="status"
                        className={`form-select ${
                            fieldError('status')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <div className="invalid-feedback">
                        {fieldError('status')}
                    </div>
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                        Course
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="text"
                        name="course"
                        className={`form-control ${
                            fieldError('course')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.course}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('course')}
                    </div>
                </div>

                <div className="col-md-6">
                    <label className="form-label">
                        Enrollment date
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="date"
                        name="enrollment_date"
                        className={`form-control ${
                            fieldError('enrollment_date')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.enrollment_date}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('enrollment_date')}
                    </div>
                </div>

                <div className="col-12">
                    <label className="form-label">
                        Address
                    </label>

                    <textarea
                        name="address"
                        rows="3"
                        className={`form-control ${
                            fieldError('address')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.address}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('address')}
                    </div>
                </div>

                <div className="col-12 mt-4">
                    <button
                        type="submit"
                        className="btn btn-system px-4"
                        disabled={submitting}
                    >
                        {submitting
                            ? 'Please wait...'
                            : submitText}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default StudentForm;