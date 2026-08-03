<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'subject_id' => $this->subject_id,
            'created_by' => $this->created_by,

            'title' => $this->title,
            'type' => $this->type,
            'description' => $this->description,

            'available_from' =>
                $this->available_from?->format('Y-m-d\TH:i'),

            'due_date' =>
                $this->due_date?->format('Y-m-d\TH:i'),

            'exam_date' =>
                $this->exam_date?->format('Y-m-d'),

            'start_time' => $this->start_time,

            'duration_minutes' =>
                $this->duration_minutes,

            'location' => $this->location,

            'total_marks' => $this->total_marks,

            'attachment' => $this->attachment,

            'attachment_url' => $this->attachment
                ? asset(
                    'storage/' .
                    ltrim($this->attachment, '/')
                )
                : null,

            'status' => $this->status,

            'subject' => $this->whenLoaded(
                'subject',
                function () {
                    return [
                        'id' => $this->subject->id,

                        'subject_code' =>
                            $this->subject->subject_code,

                        'subject_name' =>
                            $this->subject->subject_name,

                        'semester' =>
                            $this->subject->semester,

                        'credits' =>
                            $this->subject->credits,

                        'lecturer_id' =>
                            $this->subject->lecturer_id,
                    ];
                }
            ),

            'creator' => $this->whenLoaded(
                'creator',
                function () {
                    return [
                        'id' => $this->creator->id,
                        'name' => $this->creator->name,
                        'email' => $this->creator->email,
                        'role' => $this->creator->role,
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