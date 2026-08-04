<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLecturerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $lecturer = $this->route('lecturer');

        return [
            'lecturer_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('lecturers', 'lecturer_number')
                    ->ignore($lecturer),
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
                Rule::unique('users', 'email')
                    ->ignore($lecturer->user_id),
            ],

            'password' => [
                'nullable',
                'string',
                'min:4',
            ],

            'phone_number' => [
                'nullable',
                'string',
                'max:20',
            ],

            'address' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'department' => [
                'required',
                'string',
                'max:150',
            ],

            'specialization' => [
                'nullable',
                'string',
                'max:150',
            ],

            'hire_date' => [
                'required',
                'date',
                'before_or_equal:today',
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
            'lecturer_number.unique' =>
                'This lecturer number belongs to another lecturer.',

            'email.unique' =>
                'This email address belongs to another account.',

            'password.min' =>
                'The password must contain at least 4 characters.',

            'hire_date.before_or_equal' =>
                'The hire date cannot be in the future.',

            'profile_image.mimes' =>
                'The image must be JPG, JPEG, PNG or WEBP.',

            'profile_image.max' =>
                'The image must not be larger than 2 MB.',
        ];
    }
}
