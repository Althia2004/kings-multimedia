<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Calendar', [
            'bookings' => Booking::with('client.user')
                ->whereIn('status', ['Pending', 'Approved'])
                ->orderBy('session_date')
                ->orderBy('session_time')
                ->get()
                ->map(fn (Booking $booking) => [
                    'id' => $booking->id,
                    'client' => $booking->client?->user?->name,
                    'eventType' => $booking->event_type,
                    'date' => $booking->session_date?->toDateString(),
                    'time' => substr((string) $booking->session_time, 0, 5),
                    'status' => $booking->status,
                    'location' => $booking->location,
                ]),
        ]);
    }
}
