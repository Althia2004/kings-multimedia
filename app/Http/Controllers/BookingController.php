<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\Client;
use App\Models\Notification;
use App\Support\PackagePricing;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Bookings/index', [
            'bookings' => Booking::with(['client.user', 'payment'])
                ->latest('session_date')
                ->get()
                ->map(fn (Booking $booking) => $this->serialize($booking)),
            'clients' => Client::with('user')->orderBy('id')->get()->map(fn (Client $client) => [
                'id' => $client->id,
                'name' => $client->user?->name,
            ]),
        ]);
    }

    public function mine(Request $request): Response
    {
        $client = $request->user()->client;

        return Inertia::render('User/Bookings/index', [
            'bookings' => $client
                ? $client->bookings()->with('payment')->latest('session_date')->get()->map(fn (Booking $booking) => $this->serialize($booking))
                : [],
        ]);
    }

    public function store(StoreBookingRequest $request): RedirectResponse|JsonResponse
    {
        if ($this->dateIsReserved($request->date('session_date')?->toDateString())) {
            $availableDates = $this->getAvailableDates();

            if ($request->expectsJson()) {
                return response()->json([
                    'available_dates' => $availableDates,
                    'message' => 'Selected date is unavailable.',
                ], 422);
            }

            return back()
                ->withErrors(['session_date' => 'Selected date is unavailable.'])
                ->with('available_dates', $availableDates);
        }

        $client = $request->user()->client;

        if (! $request->user()->isAdmin() && ! $client) {
            $client = Client::create([
                'user_id' => $request->user()->id,
            ]);
        }

        $clientId = $request->user()->isAdmin()
            ? $request->integer('client_id')
            : $client?->id;

        abort_if(! $clientId, 422, 'A client profile is required before booking.');

        $booking = Booking::create([
            ...$request->safe()->only(['event_type', 'session_date', 'session_time', 'location', 'notes']),
            'client_id' => $clientId,
            'status' => 'Pending',
        ]);

        $amountDue = PackagePricing::priceFor(
            $booking->event_type,
            (float) $request->input('amount_due', 0),
        );

        $booking->payment()->create([
            'amount_due' => $amountDue,
            'amount_paid' => 0,
            'remaining_balance' => $amountDue,
            'status' => 'Unpaid',
        ]);

        return back()->with('success', 'Booking request submitted.');
    }

    public function update(UpdateBookingRequest $request, Booking $booking): RedirectResponse
    {
        $previousStatus = $booking->status;

        $booking->update($request->validated());

        if ($previousStatus !== $booking->status) {
            $this->notifyStatusChange($booking);
        }

        return back()->with('success', 'Booking updated.');
    }

    public function approve(Booking $booking): RedirectResponse
    {
        abort_if(! request()->user()?->isAdmin(), 403);

        $conflict = Booking::query()
            ->whereKeyNot($booking->id)
            ->whereDate('session_date', $booking->session_date?->toDateString())
            ->whereIn('status', ['Pending', 'Approved'])
            ->exists();

        if ($conflict) {
            return back()
                ->withErrors(['session_date' => 'Selected date is unavailable.'])
                ->with('available_dates', $this->getAvailableDates($booking->id));
        }

        $booking->update(['status' => 'Approved']);
        $this->notifyStatusChange($booking);

        return back()->with('success', 'Booking approved.');
    }

    public function reject(Booking $booking): RedirectResponse
    {
        abort_if(! request()->user()?->isAdmin(), 403);

        $booking->update(['status' => 'Rejected']);
        $this->notifyStatusChange($booking);

        return back()->with('success', 'Booking rejected.');
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        abort_if(! request()->user()?->isAdmin(), 403);

        $booking->delete();

        return back()->with('success', 'Booking deleted.');
    }

    private function serialize(Booking $booking): array
    {
        return [
            'id' => $booking->id,
            'client' => $booking->client?->user?->name,
            'eventType' => $booking->event_type,
            'date' => $booking->session_date?->toDateString(),
            'time' => substr((string) $booking->session_time, 0, 5),
            'location' => $booking->location,
            'paymentStatus' => $booking->payment?->status ?? 'Unpaid',
            'bookingStatus' => $booking->status,
            'notes' => $booking->notes,
        ];
    }

    private function notifyStatusChange(Booking $booking): void
    {
        $booking->loadMissing('client.user');

        $message = match ($booking->status) {
            'Approved' => 'Your booking has been approved.',
            'Rejected' => 'Your booking has been rejected.',
            default => null,
        };

        if (! $message || ! $booking->client?->user_id) {
            return;
        }

        Notification::create([
            'user_id' => $booking->client->user_id,
            'title' => "Booking {$booking->status}",
            'message' => $message,
            'type' => "booking_".strtolower($booking->status),
        ]);
    }

    private function dateIsReserved(?string $date, ?int $ignoreBookingId = null): bool
    {
        if (! $date) {
            return false;
        }

        return Booking::query()
            ->when($ignoreBookingId, fn ($query) => $query->whereKeyNot($ignoreBookingId))
            ->whereDate('session_date', $date)
            ->whereIn('status', ['Pending', 'Approved'])
            ->exists();
    }

    /**
     * @return array<int, string>
     */
    private function getAvailableDates(?int $ignoreBookingId = null): array
    {
        $period = CarbonPeriod::create(today(), today()->addDays(30));
        $availableDates = [];

        foreach ($period as $date) {
            if ($this->dateIsReserved($date->toDateString(), $ignoreBookingId)) {
                continue;
            }

            $availableDates[] = $date->toDateString();

            if (count($availableDates) === 5) {
                break;
            }
        }

        return $availableDates;
    }
}
