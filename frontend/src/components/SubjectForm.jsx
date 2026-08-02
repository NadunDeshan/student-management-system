function SubjectForm({
    formData,
    setFormData,
    lecturers,
    errors,
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
                {/* Subject code */}
                <div className="col-md-6">
                    <label className="form-label">
                        Subject Code
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="text"
                        name="subject_code"
                        className={`form-control ${
                            fieldError('subject_code')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.subject_code}
                        onChange={handleChange}
                        placeholder="Example: IT101"
                    />

                    <div className="invalid-feedback">
                        {fieldError('subject_code')}
                    </div>
                </div>

                {/* Subject name */}
                <div className="col-md-6">
                    <label className="form-label">
                        Subject Name
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="text"
                        name="subject_name"
                        className={`form-control ${
                            fieldError('subject_name')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.subject_name}
                        onChange={handleChange}
                        placeholder="Example: Web Development"
                    />

                    <div className="invalid-feedback">
                        {fieldError('subject_name')}
                    </div>
                </div>

                {/* Lecturer */}
                <div className="col-md-6">
                    <label className="form-label">
                        Assigned Lecturer
                        <span className="required-mark"> *</span>
                    </label>

                    <select
                        name="lecturer_id"
                        className={`form-select ${
                            fieldError('lecturer_id')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.lecturer_id}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select a lecturer
                        </option>

                        {lecturers.map((lecturer) => (
                            <option
                                key={lecturer.id}
                                value={lecturer.id}
                            >
                                {lecturer.lecturer_number}
                                {' - '}
                                {lecturer.first_name}
                                {' '}
                                {lecturer.last_name}
                            </option>
                        ))}
                    </select>

                    <div className="invalid-feedback">
                        {fieldError('lecturer_id')}
                    </div>
                </div>

                {/* Semester */}
                <div className="col-md-3">
                    <label className="form-label">
                        Semester
                        <span className="required-mark"> *</span>
                    </label>

                    <select
                        name="semester"
                        className={`form-select ${
                            fieldError('semester')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.semester}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select
                        </option>

                        {[1, 2, 3, 4, 5, 6, 7, 8].map(
                            (semester) => (
                                <option
                                    key={semester}
                                    value={semester}
                                >
                                    Semester {semester}
                                </option>
                            )
                        )}
                    </select>

                    <div className="invalid-feedback">
                        {fieldError('semester')}
                    </div>
                </div>

                {/* Credits */}
                <div className="col-md-3">
                    <label className="form-label">
                        Credits
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="number"
                        name="credits"
                        min="1"
                        max="10"
                        className={`form-control ${
                            fieldError('credits')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.credits}
                        onChange={handleChange}
                        placeholder="3"
                    />

                    <div className="invalid-feedback">
                        {fieldError('credits')}
                    </div>
                </div>

                {/* Description */}
                <div className="col-12">
                    <label className="form-label">
                        Description
                    </label>

                    <textarea
                        name="description"
                        rows="5"
                        className={`form-control ${
                            fieldError('description')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter a short description about the subject"
                    />

                    <div className="invalid-feedback">
                        {fieldError('description')}
                    </div>
                </div>

                {/* Submit */}
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

export default SubjectForm;