<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Client;
use App\Models\Payment;
use App\Models\Photo;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        if (! $request->user()?->isAdmin()) {
            return $this->clientDashboard($request);
        }

        $monthStart = now()->startOfMonth();

        $revenueByMonth = Payment::query()
            ->where('created_at', '>=', now()->subMonths(5)->startOfMonth())
            ->get()
            ->groupBy(fn (Payment $payment) => ($payment->payment_date ?? $payment->created_at)->format('M'))
            ->map(fn ($payments, string $label) => [
                'label' => $label,
                'total' => (float) $payments->sum('amount_paid'),
            ])
            ->values();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalBookings' => Booking::count(),
                'activeClients' => Client::count(),
                'monthlyRevenue' => (float) Payment::where('status', 'Paid')->where('payment_date', '>=', $monthStart)->sum('amount_paid'),
                'pendingDeliveries' => Photo::whereIn('status', ['Pending', 'Processing'])->count(),
            ],
            'upcomingSessions' => Booking::with('client.user')
                ->whereIn('status', ['Pending', 'Approved'])
                ->where('session_date', '>=', today())
                ->orderBy('session_date')
                ->orderBy('session_time')
                ->limit(6)
                ->get()
                ->map(fn (Booking $booking) => [
                    'id' => $booking->id,
                    'client' => $booking->client?->user?->name,
                    'event' => $booking->event_type,
                    'date' => $booking->session_date?->format('M d, Y'),
                    'time' => Carbon::parse($booking->session_time)->format('g:i A'),
                    'status' => $booking->status,
                ]),
            'recentActivities' => collect()
                ->merge(Booking::with('client.user')->latest()->limit(4)->get()->map(fn (Booking $booking) => [
                    'label' => "{$booking->status} booking for {$booking->client?->user?->name}",
                    'createdAt' => $booking->created_at?->diffForHumans(),
                ]))
                ->merge(Payment::with('booking.client.user')->latest()->limit(4)->get()->map(fn (Payment $payment) => [
                    'label' => 'Payment received from '.$payment->booking?->client?->user?->name,
                    'createdAt' => $payment->created_at?->diffForHumans(),
                ]))
                ->take(6)
                ->values(),
            'revenueChart' => $revenueByMonth,
            'bookingStatusChart' => Booking::query()
                ->selectRaw('status as label, COUNT(*) as value')
                ->groupBy('status')
                ->get(),
            'dashboardType' => 'admin',
        ]);
    }

    private function clientDashboard(Request $request): Response
    {
        $client = $request->user()->client;

        $bookings = $client
            ? Booking::with(['payment', 'photos'])
                ->where('client_id', $client->id)
                ->latest('session_date')
                ->get()
            : collect();

        $upcoming = $bookings
            ->whereIn('status', ['Pending', 'Approved'])
            ->filter(fn (Booking $booking) => $booking->session_date?->gte(today()))
            ->sortBy(['session_date', 'session_time'])
            ->first();

        return Inertia::render('dashboard', [
            'dashboardType' => 'client',
            'stats' => [
                'activeBookings' => $bookings->whereIn('status', ['Pending', 'Approved'])->count(),
                'pendingBalance' => (float) $bookings->pluck('payment')->filter()->sum('remaining_balance'),
                'photosReady' => $bookings->flatMap->photos->where('status', 'Released')->count(),
                'upcomingSession' => $upcoming
                    ? $upcoming->session_date?->format('M d, Y').' at '.Carbon::parse($upcoming->session_time)->format('g:i A')
                    : 'No upcoming session',
            ],
            'upcomingSessions' => $bookings
                ->whereIn('status', ['Pending', 'Approved'])
                ->filter(fn (Booking $booking) => $booking->session_date?->gte(today()))
                ->sortBy(['session_date', 'session_time'])
                ->take(6)
                ->values()
                ->map(fn (Booking $booking) => [
                    'id' => $booking->id,
                    'client' => $request->user()->name,
                    'event' => $booking->event_type,
                    'date' => $booking->session_date?->format('M d, Y'),
                    'time' => Carbon::parse($booking->session_time)->format('g:i A'),
                    'status' => $booking->status,
                ]),
            'recentActivities' => $bookings
                ->take(6)
                ->values()
                ->map(fn (Booking $booking) => [
                    'label' => "{$booking->status} {$booking->event_type} booking",
                    'createdAt' => $booking->updated_at?->diffForHumans(),
                ]),
            'revenueChart' => [],
            'bookingStatusChart' => $bookings
                ->groupBy('status')
                ->map(fn ($items, string $status) => [
                    'label' => $status,
                    'value' => $items->count(),
                ])
                ->values(),
        ]);
    }
}
