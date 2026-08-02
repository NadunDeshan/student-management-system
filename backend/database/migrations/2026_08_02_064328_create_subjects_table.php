<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            
            $table->id();
            $table->foreignId('lecturer_id')
                ->constrained('lecturers')
                ->cascadeOnDelete();
            $table->string('subject_code')->unique();
            $table->string('subject_name');
            $table->text('description')->nullable();
            $table->unsignedTinyInteger('credits');
            $table->unsignedTinyInteger('semester');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
