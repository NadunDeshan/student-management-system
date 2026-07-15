<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    /**
     * Fields that may be inserted or updated using mass assignment.
     */
    protected $fillable = [
        'student_number',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'date_of_birth',
        'gender',
        'address',
        'course',
        'enrollment_date',
        'profile_image',
        'status',
    ];

    /**
     * Convert database values into appropriate PHP types.
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'enrollment_date' => 'date',
        ];
    }
}
