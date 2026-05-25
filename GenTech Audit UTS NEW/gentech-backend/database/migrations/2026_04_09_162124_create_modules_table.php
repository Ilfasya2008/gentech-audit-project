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
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('duration')->nullable(); // Ditambahkan untuk durasi (contoh: "15 menit")
            $table->string('status')->default('draft'); // Tetap pake default draft punya kamu
            $table->json('topics')->nullable(); // Ditambahkan tipe JSON untuk simpan array kumpulan topik
            $table->json('content')->nullable(); // Ditambahkan tipe JSON untuk simpan isi bab/konten modul
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};