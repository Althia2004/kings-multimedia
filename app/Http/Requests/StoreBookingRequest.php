<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'client_id' => ['nullable', 'exists:clients,id'],
            'event_type' => ['required', 'string', 'max:255'],
            'session_date' => ['required', 'date'],
            'session_time' => ['required', 'date_format:H:i'],
            'location' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'amount_due' => ['nullable', 'numeric', 'min:0'],
        ];
    }

}
