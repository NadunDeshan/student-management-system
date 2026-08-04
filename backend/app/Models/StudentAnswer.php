<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_attempt_id',
        'question_id',
        'selected_option_id',
        'is_correct',
        'marks_awarded',
    ];

    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
            'marks_awarded' => 'decimal:2',
        ];
    }

    public function quizAttempt()
    {
        return $this->belongsTo(
            QuizAttempt::class,
            'quiz_attempt_id'
        );
    }

    public function question()
    {
        return $this->belongsTo(
            AssessmentQuestion::class,
            'question_id'
        );
    }

    public function selectedOption()
    {
        return $this->belongsTo(
            QuestionOption::class,
            'selected_option_id'
        );
    }
}