<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lecturers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('lecturer_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone_number', 20)->nullable();
            $table->text('address')->nullable();
            $table->string('department');
            $table->string('specialization')->nullable();
            $table->date('hire_date');
            // Stores the uploaded image path.
            $table->string('profile_image')->nullable();

            $table->enum('status', [
                'active',
                'inactive',
                'suspended',
            ])->default('active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lecturers');
    }
};
