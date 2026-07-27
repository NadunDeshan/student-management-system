<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLecturerRequest extends FormRequest
{
    public function authorize(): bool   //This means the method must return a Boolean value:
    {
        return true;  //Allow this request. Every user who reaches this endpoint is allowed to submit the lecturer form.
    }

    public function rules(): array  //This method contains all validation rules.
    {
        return [

            //'field_name' => [
            //    'rule1',
            //    'rule2',
            //]

            'lecturer_number' => [
                'required',
                'string',
                'max:50',
                'unique:lecturers,lecturer_number',
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
                'unique:users,email',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
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
            'lecturer_number.required' =>
                'The lecturer number is required.',

            'lecturer_number.unique' =>
                'This lecturer number is already registered.',

            'email.unique' =>
                'This email address is already registered.',

            'password.required' =>
                'The password is required.',

            'password.min' =>
                'The password must contain at least 8 characters.',

            'hire_date.before_or_equal' =>
                'The hire date cannot be in the future.',

            'profile_image.image' =>
                'The uploaded file must be an image.',

            'profile_image.mimes' =>
                'The image must be JPG, JPEG, PNG or WEBP.',

            'profile_image.max' =>
                'The image must not be larger than 2 MB.',
        ];
    }
}
