<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('simulation_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('hash')->unique();
            $table->string('from_entity');
            $table->string('to_entity');
            $table->decimal('amount', 20, 2);
            $table->string('block_number');
            $table->integer('gas_used')->default(21000);
            $table->enum('status', ['success', 'pending', 'failed'])->default('success');
            $table->timestamp('transaction_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('simulation_transactions');
    }
};
