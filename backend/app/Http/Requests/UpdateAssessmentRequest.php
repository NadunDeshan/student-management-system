<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssessmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject_id' => [
                'required',
                'integer',
                'exists:subjects,id',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'type' => [
                'required',
                Rule::in([
                    'written_exam',
                    'assignment',
                    'mcq',
                ]),
            ],

            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'available_from' => [
                'nullable',
                'date',
            ],

            'due_date' => [
                'nullable',
                'date',
                'after_or_equal:available_from',
            ],

            'exam_date' => [
                'nullable',
                'required_if:type,written_exam',
                'date',
            ],

            'start_time' => [
                'nullable',
                'required_if:type,written_exam',
                'date_format:H:i',
            ],

            'duration_minutes' => [
                'nullable',
                'required_if:type,written_exam',
                'integer',
                'min:1',
                'max:600',
            ],

            'location' => [
                'nullable',
                'required_if:type,written_exam',
                'string',
                'max:255',
            ],

            'total_marks' => [
                'required',
                'integer',
                'min:1',
                'max:1000',
            ],

            /*
             * Optional during update.
             * When no new PDF is uploaded,
             * the existing attachment remains unchanged.
             */
            'attachment' => [
                'nullable',
                'file',
                'mimes:pdf',
                'max:10240',
            ],

            'status' => [
                'required',
                Rule::in([
                    'draft',
                    'published',
                    'closed',
                    'cancelled',
                ]),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'subject_id.required' =>
                'Please select a subject.',

            'subject_id.exists' =>
                'The selected subject does not exist.',

            'title.required' =>
                'The assessment title is required.',

            'type.required' =>
                'Please select an assessment type.',

            'type.in' =>
                'The selected assessment type is invalid.',

            'due_date.after_or_equal' =>
                'The due date must be after or equal to the available date.',

            'exam_date.required_if' =>
                'The exam date is required for a written exam.',

            'start_time.required_if' =>
                'The start time is required for a written exam.',

            'start_time.date_format' =>
                'The start time must use the HH:MM format.',

            'duration_minutes.required_if' =>
                'The duration is required for a written exam.',

            'duration_minutes.min' =>
                'The duration must be at least 1 minute.',

            'duration_minutes.max' =>
                'The duration cannot exceed 600 minutes.',

            'location.required_if' =>
                'The location is required for a written exam.',

            'total_marks.required' =>
                'The total marks field is required.',

            'total_marks.min' =>
                'Total marks must be at least 1.',

            'attachment.mimes' =>
                'The attachment must be a PDF file.',

            'attachment.max' =>
                'The PDF must not be larger than 10 MB.',

            'status.required' =>
                'Please select an assessment status.',

            'status.in' =>
                'The selected assessment status is invalid.',
        ];
    }
}