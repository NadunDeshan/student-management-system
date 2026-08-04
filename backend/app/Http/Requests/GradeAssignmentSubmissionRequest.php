<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GradeAssignmentSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'marks' => [
                'required',
                'numeric',
                'min:0',
            ],

            'feedback' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'marks.required' =>
                'Please enter the marks.',

            'marks.numeric' =>
                'The marks must be a valid number.',

            'marks.min' =>
                'The marks cannot be less than 0.',

            'feedback.max' =>
                'The feedback cannot exceed 5000 characters.',
        ];
    }
}