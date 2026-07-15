<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lecturer extends Model
{
    use HasFactory;

    protected $fillable = [
        'lecturer_number',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'address',
        'department',
        'specialization',
        'hire_date',
        'profile_image',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'hire_date' => 'date',
        ];
    }
}
