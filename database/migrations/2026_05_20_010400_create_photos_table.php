<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->string('filename');
            $table->string('path')->unique();
            $table->string('status')->default('Pending');
            $table->string('delivery_status')->default('Pending');
            $table->timestamps();

            $table->unique(['booking_id', 'filename']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photos');
    }
};
