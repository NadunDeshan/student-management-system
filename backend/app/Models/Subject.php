<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'lecturer_id',
        'subject_code',
        'subject_name',
        'description',
        'credits',
        'semester',
    ];

    public function lecturer()
    {
        return $this->belongsTo(Lecturer::class);
    }
}