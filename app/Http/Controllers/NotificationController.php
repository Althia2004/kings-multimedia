<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Notification::with('user')->latest();

        if (! $request->user()?->isAdmin()) {
            $query->where('user_id', $request->user()->id);
        }

        return Inertia::render('Notifications', [
            'notifications' => $query->get()->map(fn (Notification $notification) => [
                'id' => $notification->id,
                'title' => $notification->title,
                'message' => $notification->message,
                'type' => $notification->type,
                'isRead' => $notification->is_read,
                'user' => $notification->user?->name,
                'createdAt' => $notification->created_at?->diffForHumans(),
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_if(! $request->user()?->isAdmin(), 403);

        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'type' => ['required', 'string', 'max:255'],
        ]);

        Notification::create($validated);

        return back()->with('success', 'Notification sent.');
    }

    public function markAsRead(Notification $notification): RedirectResponse
    {
        abort_if(! request()->user()?->isAdmin() && $notification->user_id !== request()->user()?->id, 403);

        $notification->update(['is_read' => true]);

        return back();
    }
}
