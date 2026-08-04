<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'assessment_id',
        'question_text',
        'marks',
        'order_number',
    ];

    protected function casts(): array
    {
        return [
            'marks' => 'integer',
            'order_number' => 'integer',
        ];
    }

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function options()
    {
        return $this->hasMany(
            QuestionOption::class,
            'question_id'
        )->orderBy('order_number');
    }

    public function studentAnswers()
    {
        return $this->hasMany(
            StudentAnswer::class,
            'question_id'
        );
    }
}