<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_id',
        'created_by',
        'title',
        'type',
        'description',
        'available_from',
        'due_date',
        'exam_date',
        'start_time',
        'duration_minutes',
        'location',
        'total_marks',
        'attachment',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'available_from' => 'datetime',
            'due_date' => 'datetime',
            'exam_date' => 'date',
        ];
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function creator()
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }
    public function submissions()
    {
        return $this->hasMany(
            AssignmentSubmission::class
        );
    }
    public function questions()
    {
        return $this->hasMany(
            AssessmentQuestion::class
        )->orderBy('order_number');
    }

    public function quizAttempts()
    {
        return $this->hasMany(
            QuizAttempt::class
        );
    }
}
