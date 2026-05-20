<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/auth-check', function () {
    return auth()->check()
        ? response()->json(['authenticated' => true])
        : response()->json(['authenticated' => false], 401);
})->middleware('web');

Route::middleware(['auth', 'prevent-back-history'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications');
    Route::post('notifications', [NotificationController::class, 'store'])->name('notifications.store');
    Route::patch('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');

    Route::get('calendar', CalendarController::class)->name('calendar');
    Route::get('clients', [ClientController::class, 'index'])->name('clients');

    Route::get('bookings', [BookingController::class, 'index'])->name('bookings');
    Route::post('bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::patch('bookings/{booking}', [BookingController::class, 'update'])->name('bookings.update');
    Route::patch('bookings/{booking}/approve', [BookingController::class, 'approve'])->name('bookings.approve');
    Route::patch('bookings/{booking}/reject', [BookingController::class, 'reject'])->name('bookings.reject');
    Route::delete('bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');

    Route::get('files', [PhotoController::class, 'index'])->name('files');
    Route::post('photos', [PhotoController::class, 'store'])->name('photos.store');
    Route::patch('photos/{photo}/release', [PhotoController::class, 'release'])->name('photos.release');
    Route::get('photos/{photo}/download', [PhotoController::class, 'download'])->name('photos.download');

    Route::get('payments', [PaymentController::class, 'index'])->name('payments');
    Route::patch('payments/{payment}', [PaymentController::class, 'update'])->name('payments.update');
    Route::post('payments/{payment}/simulate', [PaymentController::class, 'simulate'])->name('payments.simulate');

    Route::get('my-bookings', [BookingController::class, 'mine'])->name('my-bookings');
    Route::get('my-photos', [PhotoController::class, 'mine'])->name('my-photos');
    Route::get('my-payments', [PaymentController::class, 'mine'])->name('my-payments');
});

Route::middleware(['auth', 'prevent-back-history', 'admin'])->group(function () {
    Route::get('reports', [ReportController::class, 'index'])->name('reports');
    Route::get('reports/export/excel', [ReportController::class, 'exportExcel'])->name('reports.export.excel');
    Route::get('reports/export/pdf', [ReportController::class, 'exportPdf'])->name('reports.export.pdf');

    Route::resource('employees', EmployeeController::class)->except('show');
});

require __DIR__.'/settings.php';
