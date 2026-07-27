function LecturerForm({
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
                {/* Profile image preview */}
                <div className="col-12 text-center mb-3">
                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Lecturer preview"
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

                {/* Lecturer number */}
                <div className="col-md-6">
                    <label className="form-label">
                        Lecturer number
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="text"
                        name="lecturer_number"
                        className={`form-control ${
                            fieldError('lecturer_number')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.lecturer_number}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('lecturer_number')}
                    </div>
                </div>

                {/* Profile image */}
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

                    <small className="text-muted">
                        JPG, PNG or WEBP. Maximum size: 2 MB.
                    </small>
                </div>

                {/* First name */}
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

                {/* Last name */}
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

                {/* Email */}
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

                {/* Password */}
                <div className="col-md-6">
                    <label className="form-label">
                        Password
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="password"
                        name="password"
                        className={`form-control ${
                            fieldError('password')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.password ?? ''}
                        onChange={handleChange}
                        placeholder="Enter login password"
                        autoComplete="new-password"
                    />

                    <div className="invalid-feedback">
                        {fieldError('password')}
                    </div>
                </div>

                {/* Phone number */}
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

                {/* Department */}
                <div className="col-md-6">
                    <label className="form-label">
                        Department
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="text"
                        name="department"
                        className={`form-control ${
                            fieldError('department')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.department}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('department')}
                    </div>
                </div>

                {/* Specialization */}
                <div className="col-md-6">
                    <label className="form-label">
                        Specialization
                    </label>

                    <input
                        type="text"
                        name="specialization"
                        className={`form-control ${
                            fieldError('specialization')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.specialization}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('specialization')}
                    </div>
                </div>

                {/* Hire date */}
                <div className="col-md-6">
                    <label className="form-label">
                        Hire date
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="date"
                        name="hire_date"
                        className={`form-control ${
                            fieldError('hire_date')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.hire_date}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('hire_date')}
                    </div>
                </div>

                {/* Status */}
                <div className="col-md-6">
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

                {/* Address */}
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

                {/* Submit button */}
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

export default LecturerForm;