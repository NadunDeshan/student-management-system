<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssignmentSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'submission_file' => [
                'required',
                'file',
                'mimes:pdf,doc,docx,zip',
                'max:20480',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'submission_file.required' =>
                'Please select a file to submit.',

            'submission_file.file' =>
                'The selected submission must be a valid file.',

            'submission_file.mimes' =>
                'The submission must be a PDF, DOC, DOCX, or ZIP file.',

            'submission_file.max' =>
                'The submission file must not be larger than 20 MB.',
        ];
    }
}