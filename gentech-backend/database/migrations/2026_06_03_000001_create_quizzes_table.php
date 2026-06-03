<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('difficulty', ['Pemula', 'Menengah', 'Lanjutan'])->default('Pemula');
            $table->integer('estimated_minutes')->default(5);
            $table->string('icon')->default('brain'); // brain | shield | search
            $table->string('color')->default('from-indigo-500 to-indigo-600');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
