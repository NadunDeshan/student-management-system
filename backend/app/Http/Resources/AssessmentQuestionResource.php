<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentQuestionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'assessment_id' =>
                $this->assessment_id,

            'question_text' =>
                $this->question_text,

            'marks' =>
                $this->marks,

            'order_number' =>
                $this->order_number,

            'options' => $this->whenLoaded(
                'options',
                function () {
                    return $this->options->map(
                        function ($option) {
                            return [
                                'id' =>
                                    $option->id,

                                'option_text' =>
                                    $option->option_text,

                                'is_correct' =>
                                    $option->is_correct,

                                'order_number' =>
                                    $option->order_number,
                            ];
                        }
                    );
                }
            ),

            'created_at' =>
                $this->created_at?->toISOString(),

            'updated_at' =>
                $this->updated_at?->toISOString(),
        ];
    }
}