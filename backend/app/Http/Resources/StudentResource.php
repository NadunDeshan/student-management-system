<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Convert a Student model into an API response array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_number' => $this->student_number,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,

            'full_name' => trim(
                $this->first_name . ' ' . $this->last_name
            ),

            'email' => $this->email,
            'phone_number' => $this->phone_number,

            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),

            'gender' => $this->gender,
            'address' => $this->address,
            'course' => $this->course,

            'enrollment_date' =>
                $this->enrollment_date?->format('Y-m-d'),

            'profile_image' => $this->profile_image,

            'profile_image_url' => $this->profile_image
                ? asset('storage/' . $this->profile_image)
                : null,

            'status' => $this->status,

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
