<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('event_type');
            $table->date('session_date');
            $table->time('session_time');
            $table->string('location');
            $table->string('status')->default('Pending');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['session_date', 'session_time', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
