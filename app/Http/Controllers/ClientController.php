<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Clients', [
            'clients' => Client::with(['user', 'bookings.photos'])
                ->withCount('bookings')
                ->latest()
                ->get()
                ->map(fn (Client $client) => [
                    'id' => $client->id,
                    'name' => $client->user?->name,
                    'email' => $client->user?->email,
                    'phone' => $client->contact_number,
                    'address' => $client->address,
                    'notes' => $client->notes,
                    'bookings' => $client->bookings_count,
                    'deliveryStatus' => $client->bookings->flatMap->photos->contains(fn ($photo) => $photo->status !== 'Released')
                        ? 'In progress'
                        : 'Released',
                ]),
        ]);
    }
}
