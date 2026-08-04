<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'option_text',
        'is_correct',
        'order_number',
    ];

    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
            'order_number' => 'integer',
        ];
    }

    public function question()
    {
        return $this->belongsTo(
            AssessmentQuestion::class,
            'question_id'
        );
    }

    public function studentAnswers()
    {
        return $this->hasMany(
            StudentAnswer::class,
            'selected_option_id'
        );
    }
}