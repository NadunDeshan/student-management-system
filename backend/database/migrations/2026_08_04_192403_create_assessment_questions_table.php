<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessment_questions',function (Blueprint $table) {
                $table->id();
                $table->foreignId('assessment_id')
                    ->constrained('assessments')
                    ->cascadeOnDelete();
                $table->text('question_text');
                $table->unsignedInteger('marks')
                    ->default(1);
                $table->unsignedInteger('order_number')
                    ->default(1);
                $table->timestamps();
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'assessment_questions'
        );
    }
};
