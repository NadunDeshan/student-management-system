import {
  FaPlus,
  FaTrash,
} from "react-icons/fa";

function AssessmentQuestionForm({
  formData,
  setFormData,
  errors,
  onSubmit,
  submitting,
  submitText,
}) {
  const handleQuestionChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleOptionTextChange = (
    index,
    value,
  ) => {
    setFormData((current) => ({
      ...current,
      options: current.options.map(
        (option, optionIndex) =>
          optionIndex === index
            ? {
                ...option,
                option_text: value,
              }
            : option,
      ),
    }));
  };

  const handleCorrectOptionChange = (index) => {
    setFormData((current) => ({
      ...current,
      options: current.options.map(
        (option, optionIndex) => ({
          ...option,
          is_correct: optionIndex === index,
        }),
      ),
    }));
  };

  const addOption = () => {
    setFormData((current) => {
      if (current.options.length >= 6) {
        return current;
      }

      return {
        ...current,
        options: [
          ...current.options,
          {
            id: null,
            option_text: "",
            is_correct: false,
            order_number:
              current.options.length + 1,
          },
        ],
      };
    });
  };

  const removeOption = (index) => {
    setFormData((current) => {
      if (current.options.length <= 2) {
        return current;
      }

      const updatedOptions =
        current.options
          .filter(
            (_, optionIndex) =>
              optionIndex !== index,
          )
          .map((option, optionIndex) => ({
            ...option,
            order_number:
              optionIndex + 1,
          }));

      /*
       * If the removed option was correct,
       * no option remains selected.
       */
      return {
        ...current,
        options: updatedOptions,
      };
    });
  };

  const fieldError = (fieldName) => {
    return errors[fieldName]?.[0] ?? "";
  };

  const optionError = (
    index,
    fieldName,
  ) => {
    return (
      errors[
        `options.${index}.${fieldName}`
      ]?.[0] ?? ""
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">
            Question
            <span className="required-mark">
              {" "}
              *
            </span>
          </label>

          <textarea
            name="question_text"
            rows="4"
            className={`form-control ${
              fieldError("question_text")
                ? "is-invalid"
                : ""
            }`}
            value={formData.question_text}
            onChange={handleQuestionChange}
            placeholder="Enter the MCQ question"
          />

          <div className="invalid-feedback">
            {fieldError("question_text")}
          </div>
        </div>

        <div className="col-md-4">
          <label className="form-label">
            Marks
            <span className="required-mark">
              {" "}
              *
            </span>
          </label>

          <input
            type="number"
            name="marks"
            min="1"
            max="100"
            className={`form-control ${
              fieldError("marks")
                ? "is-invalid"
                : ""
            }`}
            value={formData.marks}
            onChange={handleQuestionChange}
            placeholder="1"
          />

          <div className="invalid-feedback">
            {fieldError("marks")}
          </div>
        </div>

        <div className="col-md-4">
          <label className="form-label">
            Question Order
          </label>

          <input
            type="number"
            name="order_number"
            min="1"
            className={`form-control ${
              fieldError("order_number")
                ? "is-invalid"
                : ""
            }`}
            value={formData.order_number}
            onChange={handleQuestionChange}
            placeholder="Automatic"
          />

          <div className="invalid-feedback">
            {fieldError("order_number")}
          </div>
        </div>

        <div className="col-md-4 d-flex align-items-end">
          <button
            type="button"
            className="btn btn-outline-info w-100"
            onClick={addOption}
            disabled={
              formData.options.length >= 6
            }
          >
            <FaPlus className="me-2" />
            Add Option
          </button>
        </div>

        <div className="col-12">
          <div className="assessment-section-title">
            Answer Options
          </div>

          <p className="page-subtitle mb-0">
            Add between 2 and 6 options and
            select exactly one correct answer.
          </p>
        </div>

        {fieldError("options") && (
          <div className="col-12">
            <div className="alert alert-danger mb-0">
              {fieldError("options")}
            </div>
          </div>
        )}

        {formData.options.map(
          (option, index) => (
            <div
              className="col-12"
              key={option.id ?? index}
            >
              <div
                className={`mcq-option-editor ${
                  option.is_correct
                    ? "correct-option"
                    : ""
                }`}
              >
                <div className="mcq-option-number">
                  {String.fromCharCode(
                    65 + index,
                  )}
                </div>

                <div className="mcq-option-input">
                  <label className="form-label">
                    Option {index + 1}
                  </label>

                  <input
                    type="text"
                    className={`form-control ${
                      optionError(
                        index,
                        "option_text",
                      )
                        ? "is-invalid"
                        : ""
                    }`}
                    value={
                      option.option_text
                    }
                    onChange={(event) =>
                      handleOptionTextChange(
                        index,
                        event.target.value,
                      )
                    }
                    placeholder={`Enter option ${String.fromCharCode(
                      65 + index,
                    )}`}
                  />

                  <div className="invalid-feedback">
                    {optionError(
                      index,
                      "option_text",
                    )}
                  </div>
                </div>

                <div className="mcq-correct-option">
                  <label className="form-check-label">
                    <input
                      type="radio"
                      name="correct_option"
                      className="form-check-input me-2"
                      checked={
                        option.is_correct
                      }
                      onChange={() =>
                        handleCorrectOptionChange(
                          index,
                        )
                      }
                    />

                    Correct
                  </label>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() =>
                    removeOption(index)
                  }
                  disabled={
                    formData.options.length <= 2
                  }
                  title="Remove option"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ),
        )}

        <div className="col-12 mt-4">
          <button
            type="submit"
            className="btn btn-system px-4"
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : submitText}
          </button>
        </div>
      </div>
    </form>
  );
}

export default AssessmentQuestionForm;