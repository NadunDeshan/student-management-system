function AssessmentForm({
    formData,
    setFormData,
    subjects,
    errors,
    onAttachmentChange,
    onSubmit,
    submitting,
    submitText,
    existingAttachmentUrl = null,
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

    const isWrittenExam =
        formData.type === 'written_exam';

    const isAssignment =
        formData.type === 'assignment';

    const isMcq =
        formData.type === 'mcq';

    return (
        <form onSubmit={onSubmit}>
            <div className="row g-3">
                {/* Subject */}
                <div className="col-md-6">
                    <label className="form-label">
                        Subject
                        <span className="required-mark"> *</span>
                    </label>

                    <select
                        name="subject_id"
                        className={`form-select ${
                            fieldError('subject_id')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.subject_id}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select a subject
                        </option>

                        {subjects.map((subject) => (
                            <option
                                key={subject.id}
                                value={subject.id}
                            >
                                {subject.subject_code}
                                {' - '}
                                {subject.subject_name}
                            </option>
                        ))}
                    </select>

                    <div className="invalid-feedback">
                        {fieldError('subject_id')}
                    </div>
                </div>

                {/* Type */}
                <div className="col-md-6">
                    <label className="form-label">
                        Assessment Type
                        <span className="required-mark"> *</span>
                    </label>

                    <select
                        name="type"
                        className={`form-select ${
                            fieldError('type')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select assessment type
                        </option>

                        <option value="written_exam">
                            Written Exam
                        </option>

                        <option value="assignment">
                            Assignment
                        </option>

                        <option value="mcq">
                            MCQ Quiz
                        </option>
                    </select>

                    <div className="invalid-feedback">
                        {fieldError('type')}
                    </div>
                </div>

                {/* Title */}
                <div className="col-md-8">
                    <label className="form-label">
                        Assessment Title
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="text"
                        name="title"
                        className={`form-control ${
                            fieldError('title')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Example: Laravel Assignment 01"
                    />

                    <div className="invalid-feedback">
                        {fieldError('title')}
                    </div>
                </div>

                {/* Total marks */}
                <div className="col-md-4">
                    <label className="form-label">
                        Total Marks
                        <span className="required-mark"> *</span>
                    </label>

                    <input
                        type="number"
                        name="total_marks"
                        min="1"
                        max="1000"
                        className={`form-control ${
                            fieldError('total_marks')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.total_marks}
                        onChange={handleChange}
                        placeholder="100"
                    />

                    <div className="invalid-feedback">
                        {fieldError('total_marks')}
                    </div>
                </div>

                {/* Description */}
                <div className="col-12">
                    <label className="form-label">
                        Description
                    </label>

                    <textarea
                        name="description"
                        rows="4"
                        className={`form-control ${
                            fieldError('description')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter assessment instructions"
                    />

                    <div className="invalid-feedback">
                        {fieldError('description')}
                    </div>
                </div>

                {/* Available from */}
                <div className="col-md-6">
                    <label className="form-label">
                        Available From
                    </label>

                    <input
                        type="datetime-local"
                        name="available_from"
                        className={`form-control ${
                            fieldError('available_from')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.available_from}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('available_from')}
                    </div>
                </div>

                {/* Due date */}
                <div className="col-md-6">
                    <label className="form-label">
                        Due Date
                    </label>

                    <input
                        type="datetime-local"
                        name="due_date"
                        className={`form-control ${
                            fieldError('due_date')
                                ? 'is-invalid'
                                : ''
                        }`}
                        value={formData.due_date}
                        onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                        {fieldError('due_date')}
                    </div>
                </div>

                {/* Written exam section */}
                {isWrittenExam && (
                    <>
                        <div className="col-12">
                            <div className="assessment-section-title">
                                Written Exam Details
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">
                                Exam Date
                                <span className="required-mark"> *</span>
                            </label>

                            <input
                                type="date"
                                name="exam_date"
                                className={`form-control ${
                                    fieldError('exam_date')
                                        ? 'is-invalid'
                                        : ''
                                }`}
                                value={formData.exam_date}
                                onChange={handleChange}
                            />

                            <div className="invalid-feedback">
                                {fieldError('exam_date')}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">
                                Start Time
                                <span className="required-mark"> *</span>
                            </label>

                            <input
                                type="time"
                                name="start_time"
                                className={`form-control ${
                                    fieldError('start_time')
                                        ? 'is-invalid'
                                        : ''
                                }`}
                                value={formData.start_time}
                                onChange={handleChange}
                            />

                            <div className="invalid-feedback">
                                {fieldError('start_time')}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">
                                Duration in Minutes
                                <span className="required-mark"> *</span>
                            </label>

                            <input
                                type="number"
                                name="duration_minutes"
                                min="1"
                                max="600"
                                className={`form-control ${
                                    fieldError('duration_minutes')
                                        ? 'is-invalid'
                                        : ''
                                }`}
                                value={formData.duration_minutes}
                                onChange={handleChange}
                                placeholder="120"
                            />

                            <div className="invalid-feedback">
                                {fieldError('duration_minutes')}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">
                                Location
                                <span className="required-mark"> *</span>
                            </label>

                            <input
                                type="text"
                                name="location"
                                className={`form-control ${
                                    fieldError('location')
                                        ? 'is-invalid'
                                        : ''
                                }`}
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Example: Examination Hall A"
                            />

                            <div className="invalid-feedback">
                                {fieldError('location')}
                            </div>
                        </div>
                    </>
                )}

                {/* Assignment section */}
                {isAssignment && (
                    <div className="col-12">
                        <div className="assessment-section-title">
                            Assignment Details
                        </div>

                        <p className="page-subtitle mb-0">
                            Add instructions, due date, marks and an optional
                            PDF attachment.
                        </p>
                    </div>
                )}

                {/* MCQ section */}
                {isMcq && (
                    <div className="col-12">
                        <div className="assessment-section-title">
                            MCQ Quiz Details
                        </div>

                        <p className="page-subtitle mb-0">
                            {/* Save the main quiz details first. Questions and
                            answer options will be added in the next module. */}
                        </p>
                    </div>
                )}

                {/* Attachment */}
                {(isWrittenExam || isAssignment) && (
                    <div className="col-md-8">
                        <label className="form-label">
                            PDF Attachment
                        </label>

                        <input
                            type="file"
                            name="attachment"
                            accept="application/pdf"
                            className={`form-control ${
                                fieldError('attachment')
                                    ? 'is-invalid'
                                    : ''
                            }`}
                            onChange={onAttachmentChange}
                        />

                        <div className="invalid-feedback">
                            {fieldError('attachment')}
                        </div>

                        <small className="page-subtitle">
                            PDF only. Maximum size 10 MB.
                        </small>

                        {existingAttachmentUrl && (
                            <div className="mt-2">
                                <a
                                    href={existingAttachmentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm btn-outline-info"
                                >
                                    View Current PDF
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {/* Status */}
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
                        <option value="draft">
                            Draft
                        </option>

                        <option value="published">
                            Published
                        </option>

                        <option value="closed">
                            Closed
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>
                    </select>

                    <div className="invalid-feedback">
                        {fieldError('status')}
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

export default AssessmentForm;