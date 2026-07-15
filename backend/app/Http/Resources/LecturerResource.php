<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LecturerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'lecturer_number' => $this->lecturer_number,

            'first_name' => $this->first_name,
            'last_name' => $this->last_name,

            'full_name' => trim(
                $this->first_name . ' ' . $this->last_name
            ),

            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'address' => $this->address,

            'department' => $this->department,
            'specialization' => $this->specialization,

            'hire_date' =>
                $this->hire_date?->format('Y-m-d'),

            'profile_image' => $this->profile_image,

            'profile_image_url' => $this->profile_image
                ? asset('storage/' . $this->profile_image)
                : null,

            'status' => $this->status,

            'created_at' =>
                $this->created_at?->toISOString(),

            'updated_at' =>
                $this->updated_at?->toISOString(),
        ];
    }
}
