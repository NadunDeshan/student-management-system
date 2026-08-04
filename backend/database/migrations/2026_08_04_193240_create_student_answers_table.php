<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'student_answers',
            function (Blueprint $table) {
                $table->id();

                $table->foreignId('quiz_attempt_id')
                    ->constrained('quiz_attempts')
                    ->cascadeOnDelete();

                $table->foreignId('question_id')
                    ->constrained('assessment_questions')
                    ->cascadeOnDelete();

                $table->foreignId('selected_option_id')
                    ->nullable()
                    ->constrained('question_options')
                    ->nullOnDelete();

                $table->boolean('is_correct')
                    ->default(false);

                $table->decimal(
                    'marks_awarded',
                    8,
                    2
                )->default(0);

                $table->timestamps();

                /*
                 * One answer per question in one quiz attempt.
                 */
                $table->unique([
                    'quiz_attempt_id',
                    'question_id',
                ]);
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('student_answers');
    }
};