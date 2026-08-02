<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $subject = $this->route('subject');

        return [
            'lecturer_id' => [
                'required',
                'exists:lecturers,id',
            ],

            'subject_code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('subjects', 'subject_code')
                    ->ignore($subject),
            ],

            'subject_name' => [
                'required',
                'string',
                'max:150',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'credits' => [
                'required',
                'integer',
                'min:1',
                'max:10',
            ],

            'semester' => [
                'required',
                'integer',
                'min:1',
                'max:8',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'lecturer_id.required' =>
                'Please select a lecturer.',

            'lecturer_id.exists' =>
                'The selected lecturer does not exist.',

            'subject_code.required' =>
                'The subject code is required.',

            'subject_code.unique' =>
                'This subject code belongs to another subject.',

            'subject_name.required' =>
                'The subject name is required.',

            'credits.required' =>
                'Credits are required.',

            'credits.min' =>
                'Credits must be at least 1.',

            'credits.max' =>
                'Credits cannot exceed 10.',

            'semester.required' =>
                'Semester is required.',

            'semester.min' =>
                'Semester must be at least 1.',

            'semester.max' =>
                'Semester cannot exceed 8.',
        ];
    }
}