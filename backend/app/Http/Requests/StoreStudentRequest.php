<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
{
    /**
     * Allow this request.
     *
     * Authentication and admin authorization will be added later.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for creating a student.
     */
    public function rules(): array
    {
        return [
            'student_number' => [
                'required',
                'string',
                'max:50',
                'unique:students,student_number',
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
                'unique:students,email',
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

    /**
     * Beginner-friendly validation messages.
     */
    public function messages(): array
    {
        return [
            'student_number.required' =>
                'The student number is required.',

            'student_number.unique' =>
                'This student number is already registered.',

            'email.unique' =>
                'This email address is already registered.',

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
