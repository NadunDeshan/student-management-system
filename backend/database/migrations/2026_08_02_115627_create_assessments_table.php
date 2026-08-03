<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('subject_id')
                ->constrained('subjects')
                ->cascadeOnDelete();

            /*
             * The user who created the assessment.
             * This can be an admin or lecturer.
             */
            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('title');

            $table->enum('type', [
                'written_exam',
                'assignment',
                'mcq',
            ]);

            $table->text('description')->nullable();

            $table->dateTime('available_from')->nullable();

            $table->dateTime('due_date')->nullable();

            /*
             * Written exam fields.
             * These remain nullable because assignments and MCQs
             * may not need all of them.
             */
            $table->date('exam_date')->nullable();
            $table->time('start_time')->nullable();

            $table->unsignedInteger('duration_minutes')
                ->nullable();

            $table->string('location')->nullable();

            $table->unsignedInteger('total_marks');

            /*
             * Stores the uploaded PDF path.
             */
            $table->string('attachment')->nullable();

            $table->enum('status', [
                'draft',
                'published',
                'closed',
                'cancelled',
            ])->default('draft');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};