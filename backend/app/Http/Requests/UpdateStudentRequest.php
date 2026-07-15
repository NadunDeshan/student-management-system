<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    /**
     * Allow this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for updating a student.
     */
    public function rules(): array
    {
        $student = $this->route('student');

        return [
            'student_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('students', 'student_number')
                    ->ignore($student),
            ],

            'first_name' => [
                'required',
                'string',
                'max:100',
            ],

            'last_name' => [
                'required',
                'string',
                'max:100',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('students', 'email')
                    ->ignore($student),
            ],

            'phone_number' => [
                'nullable',
                'string',
                'max:20',
            ],

            'date_of_birth' => [
                'required',
                'date',
                'before:today',
            ],

            'gender' => [
                'required',
                'in:male,female,other',
            ],

            'address' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'course' => [
                'required',
                'string',
                'max:150',
            ],

            'enrollment_date' => [
                'required',
                'date',
            ],

            'profile_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'status' => [
                'required',
                'in:active,inactive',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'student_number.required' =>
                'The student number is required.',

            'student_number.unique' =>
                'This student number belongs to another student.',

            'email.unique' =>
                'This email address belongs to another student.',

            'date_of_birth.before' =>
                'The date of birth must be before today.',

            'profile_image.image' =>
                'The uploaded file must be an image.',

            'profile_image.mimes' =>
                'The profile image must be JPG, JPEG, PNG or WEBP.',

            'profile_image.max' =>
                'The profile image must not be larger than 2 MB.',
        ];
    }
}
