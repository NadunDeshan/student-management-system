<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAssessmentQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question_text' => [
                'required',
                'string',
                'max:5000',
            ],

            'marks' => [
                'required',
                'integer',
                'min:1',
                'max:100',
            ],

            'order_number' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'options' => [
                'required',
                'array',
                'min:2',
                'max:6',
            ],

            'options.*.id' => [
                'nullable',
                'integer',
                'exists:question_options,id',
            ],

            'options.*.option_text' => [
                'required',
                'string',
                'max:2000',
            ],

            'options.*.is_correct' => [
                'required',
                'boolean',
            ],

            'options.*.order_number' => [
                'nullable',
                'integer',
                'min:1',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'question_text.required' =>
                'The question text is required.',

            'marks.required' =>
                'The question marks are required.',

            'marks.min' =>
                'The question must have at least 1 mark.',

            'options.required' =>
                'Please add answer options.',

            'options.min' =>
                'Each question must contain at least 2 options.',

            'options.max' =>
                'A question cannot contain more than 6 options.',

            'options.*.id.exists' =>
                'One of the selected options does not exist.',

            'options.*.option_text.required' =>
                'Each option must contain answer text.',

            'options.*.is_correct.required' =>
                'Each option must specify whether it is correct.',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $options = $this->input('options', []);

            $correctOptionCount = collect($options)
                ->filter(function ($option) {
                    return filter_var(
                        $option['is_correct'] ?? false,
                        FILTER_VALIDATE_BOOLEAN
                    );
                })
                ->count();

            if ($correctOptionCount !== 1) {
                $validator->errors()->add(
                    'options',
                    'Each question must have exactly one correct answer.'
                );
            }
        });
    }
}