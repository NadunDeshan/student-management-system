<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'subject_code' => $this->subject_code,
            'subject_name' => $this->subject_name,
            'description' => $this->description,
            'credits' => $this->credits,
            'semester' => $this->semester,
            'students_count' => $this->whenCounted('students'),

            'lecturer_id' => $this->lecturer_id,

            'lecturer' => $this->whenLoaded(
                'lecturer',
                function () {
                    return [
                        'id' => $this->lecturer->id,

                        'lecturer_number' =>
                            $this->lecturer->lecturer_number,

                        'first_name' =>
                            $this->lecturer->first_name,

                        'last_name' =>
                            $this->lecturer->last_name,

                        'full_name' => trim(
                            $this->lecturer->first_name
                            . ' '
                            . $this->lecturer->last_name
                        ),

                        'department' =>
                            $this->lecturer->department,

                        'specialization' =>
                            $this->lecturer->specialization,
                    ];
                }
            ),

            'created_at' =>
                $this->created_at?->toISOString(),

            'updated_at' =>
                $this->updated_at?->toISOString(),
        ];
    }
}