<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Notification;
use App\Models\Photo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PhotoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Files/index', [
            'files' => Photo::with('booking.client.user', 'booking.payment')
                ->latest()
                ->get()
                ->map(fn (Photo $photo) => $this->serialize($photo)),
            'bookings' => Booking::with('client.user', 'payment')
                ->whereIn('status', ['Approved', 'Completed'])
                ->latest('session_date')
                ->get()
                ->map(fn (Booking $booking) => [
                    'id' => $booking->id,
                    'label' => "{$booking->client?->user?->name} - {$booking->session_date?->toDateString()} - {$booking->event_type}",
                    'paymentStatus' => $booking->payment?->status ?? 'Unpaid',
                ]),
        ]);
    }

    public function mine(Request $request): Response
    {
        $client = $request->user()->client;

        return Inertia::render('User/Photos/index', [
            'photos' => $client
                ? Photo::with('booking.payment')
                    ->whereHas('booking', fn ($query) => $query->where('client_id', $client->id))
                    ->latest()
                    ->get()
                    ->map(fn (Photo $photo) => $this->serialize($photo))
                : [],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_if(! $request->user()?->isAdmin(), 403);

        $validated = $request->validate([
            'booking_id' => ['required', 'exists:bookings,id'],
            'photos' => ['required', 'array', 'min:1'],
            'photos.*' => ['file', 'image', 'max:10240'],
        ]);

        $booking = Booking::with('client.user')->findOrFail($validated['booking_id']);
        $directory = $this->directoryFor($booking);

        foreach ($request->file('photos', []) as $index => $file) {
            $extension = $file->getClientOriginalExtension() ?: 'jpg';
            $filename = $this->filenameFor($booking, $extension, $index + 1);
            $path = "{$directory}/{$filename}";

            if (Storage::disk('public')->exists($path) || Photo::where('path', $path)->exists()) {
                return back()->withErrors(['photos' => "Duplicate upload blocked for {$filename}."]);
            }

            $file->storeAs($directory, $filename, 'public');

            Photo::create([
                'booking_id' => $booking->id,
                'filename' => $filename,
                'path' => $path,
                'status' => 'Processing',
                'delivery_status' => 'Processing',
            ]);
        }

        return back()->with('success', 'Photos uploaded and organized.');
    }

    public function release(Photo $photo): RedirectResponse
    {
        abort_if(! request()->user()?->isAdmin(), 403);

        $photo->loadMissing('booking.payment', 'booking.client.user');

        if ($photo->booking?->payment?->status !== 'Paid') {
            return back()->withErrors(['photo' => 'Payment must be settled before photos can be released.']);
        }

        $photo->update([
            'status' => 'Released',
            'delivery_status' => 'Released',
        ]);

        Notification::create([
            'user_id' => $photo->booking->client->user_id,
            'title' => 'Photos ready',
            'message' => 'Your photos are ready for download.',
            'type' => 'photos_ready',
        ]);

        return back()->with('success', 'Photo released.');
    }

    public function download(Photo $photo): StreamedResponse|RedirectResponse
    {
        $photo->loadMissing('booking.client.user', 'booking.payment');
        $user = request()->user();

        abort_if(! $user, 403);
        abort_if(! $user->isAdmin() && $photo->booking?->client?->user_id !== $user->id, 403);

        if ($photo->booking?->payment?->status !== 'Paid' || $photo->status !== 'Released') {
            return back()->withErrors(['photo' => 'Payment required before release.']);
        }

        return Storage::disk('public')->download($photo->path, $photo->filename);
    }

    private function serialize(Photo $photo): array
    {
        return [
            'id' => $photo->id,
            'bookingId' => $photo->booking_id,
            'name' => $photo->filename,
            'client' => $photo->booking?->client?->user?->name,
            'sessionDate' => $photo->booking?->session_date?->toDateString(),
            'eventType' => $photo->booking?->event_type,
            'status' => $photo->status,
            'deliveryStatus' => $photo->delivery_status,
            'paymentStatus' => $photo->booking?->payment?->status ?? 'Unpaid',
            'preview' => $photo->url,
            'downloadUrl' => route('photos.download', $photo),
        ];
    }

    private function directoryFor(Booking $booking): string
    {
        $client = Str::slug($booking->client?->user?->name ?? 'client');

        return "photos/{$client}/{$booking->session_date?->toDateString()}";
    }

    private function filenameFor(Booking $booking, string $extension, int $sequence): string
    {
        $client = Str::studly($booking->client?->user?->name ?? 'Client');
        $eventType = Str::studly($booking->event_type);
        $suffix = $sequence > 1 ? "_{$sequence}" : '';

        return "{$client}_{$booking->session_date?->toDateString()}_{$eventType}{$suffix}.{$extension}";
    }
}
