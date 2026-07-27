<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the students table.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();
            // A unique number used to identify the student.
            $table->string('student_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            // Every student must have a unique email address.
            $table->string('email')->unique();
            $table->string('phone_number', 20)->nullable();
            $table->date('date_of_birth');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->text('address')->nullable();
            $table->string('course');
            $table->date('enrollment_date');

            // Stores only the image path, not the image itself.
            $table->string('profile_image')->nullable();

            $table->enum('status', ['active', 'inactive','suspended',])
                ->default('active');

            $table->timestamps();
        });
    }

    /**
     * Remove the students table.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
