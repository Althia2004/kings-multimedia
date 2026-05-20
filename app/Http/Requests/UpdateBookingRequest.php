<?php

namespace App\Http\Requests;

use App\Models\Booking;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'event_type' => ['required', 'string', 'max:255'],
            'session_date' => ['required', 'date'],
            'session_time' => ['required', 'date_format:H:i'],
            'location' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'])],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                if (! in_array($this->input('status'), ['Pending', 'Approved'], true)) {
                    return;
                }

                $booking = $this->route('booking');

                $exists = Booking::query()
                    ->whereKeyNot($booking?->id)
                    ->whereDate('session_date', $this->date('session_date')?->toDateString())
                    ->whereIn('status', ['Pending', 'Approved'])
                    ->exists();

                if ($exists) {
                    $validator->errors()->add('session_date', 'Selected date is unavailable.');
                }
            },
        ];
    }
}
