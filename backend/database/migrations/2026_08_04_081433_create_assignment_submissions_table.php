<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignment_submissions',
            function (Blueprint $table) {
                $table->id();
                $table->foreignId('assessment_id')
                    ->constrained('assessments')
                    ->cascadeOnDelete();
                $table->foreignId('student_id')
                    ->constrained('students')
                    ->cascadeOnDelete();
                $table->string('submission_file');
                $table->dateTime('submitted_at');
                $table->decimal('marks', 8, 2)->nullable();
                $table->text('feedback')->nullable();
                $table->enum('status', ['submitted', 'graded'])->default('submitted');
                $table->timestamps();

                /*
                 * One student can submit only one main
                 * submission for one assignment.
                 */
                $table->unique([
                    'assessment_id',
                    'student_id',
                ]);
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'assignment_submissions'
        );
    }
};