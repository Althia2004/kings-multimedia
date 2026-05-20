<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Booking;
use App\Models\Client;
use App\Models\Employee;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\Photo;
use App\Support\PackagePricing;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = $this->seedUser([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => 'Super Admin',
            'is_admin' => true,
        ]);

        $this->seedEmployee($admin, [
            'employee_id' => 'EMP-0001',
            'position' => 'Main Administrator',
            'contact_number' => '+63 917 555 0100',
            'address' => 'Kings Media Operations',
            'status' => 'Active',
        ]);

        $clientUser = $this->seedUser([
            'name' => 'Client User',
            'email' => 'client@example.com',
            'password' => 'password',
            'role' => 'Client',
            'is_admin' => false,
        ]);

        $sophia = $this->seedClient($clientUser, [
            'contact_number' => '+63 917 555 0148',
            'address' => 'Quezon City, Metro Manila',
            'notes' => 'Graduation and family portrait client.',
        ]);

        $marcusUser = $this->seedUser([
            'name' => 'Marcus Lee',
            'email' => 'marcus@example.com',
            'password' => 'password',
            'role' => 'Client',
            'is_admin' => false,
        ]);

        $marcus = $this->seedClient($marcusUser, [
            'contact_number' => '+63 917 555 0199',
            'address' => 'Makati City',
            'notes' => 'Portrait package inquiry.',
        ]);

        $photographer = $this->seedUser([
            'name' => 'Reyes Cruz',
            'email' => 'photographer@example.com',
            'password' => 'password',
            'role' => 'Photographer',
            'is_admin' => false,
        ]);

        $this->seedEmployee($photographer, [
            'employee_id' => 'EMP-0002',
            'position' => 'Lead Photographer',
            'contact_number' => '+63 917 555 0111',
            'address' => 'Mobile field team',
            'status' => 'Active',
        ]);

        $editor = $this->seedUser([
            'name' => 'Mika Santos',
            'email' => 'editor@example.com',
            'password' => 'password',
            'role' => 'Editor',
            'is_admin' => false,
        ]);

        $this->seedEmployee($editor, [
            'employee_id' => 'EMP-0003',
            'position' => 'Photo Editor',
            'contact_number' => '+63 917 555 0122',
            'address' => 'Remote editing team',
            'status' => 'Active',
        ]);

        $this->seedBooking($sophia, [
            'event_type' => 'Graduation',
            'session_date' => now()->addDays(3)->toDateString(),
            'session_time' => '09:00',
            'location' => 'Client campus',
            'status' => 'Approved',
            'notes' => 'Bring gold backdrop and two softboxes.',
            'amount_due' => 2500,
            'amount_paid' => 2500,
            'photo_status' => 'Released',
        ]);

        $this->seedBooking($marcus, [
            'event_type' => 'Portrait',
            'session_date' => now()->addDays(6)->toDateString(),
            'session_time' => '14:30',
            'location' => 'Client residence',
            'status' => 'Pending',
            'notes' => 'Outdoor portrait preference.',
            'amount_due' => 1800,
            'amount_paid' => 500,
            'photo_status' => 'Processing',
        ]);

        Notification::updateOrCreate(
            ['user_id' => $clientUser->id, 'type' => 'booking_approved'],
            [
                'title' => 'Booking approved',
                'message' => 'Your booking has been approved.',
                'is_read' => false,
            ],
        );

        Notification::updateOrCreate(
            ['user_id' => $admin->id, 'type' => 'upcoming_session'],
            [
                'title' => 'Upcoming session',
                'message' => 'Reminder: Client User has a session soon.',
                'is_read' => false,
            ],
        );
    }

    /**
     * Create stable test users without failing when the seeder is run again.
     *
     * @param  array{name: string, email: string, password: string, role: string, is_admin: bool}  $attributes
     */
    private function seedUser(array $attributes): User
    {
        $user = User::query()->where('email', $attributes['email'])->first();

        if ($user) {
            $user->forceFill($attributes)->save();

            return $user;
        }

        return User::factory()->create($attributes);
    }

    private function seedClient(User $user, array $attributes): Client
    {
        return Client::updateOrCreate(
            ['user_id' => $user->id],
            $attributes,
        );
    }

    private function seedEmployee(User $user, array $attributes): Employee
    {
        return Employee::updateOrCreate(
            ['user_id' => $user->id],
            $attributes,
        );
    }

    private function seedBooking(Client $client, array $attributes): Booking
    {
        $booking = Booking::updateOrCreate(
            [
                'client_id' => $client->id,
                'session_date' => $attributes['session_date'],
                'session_time' => $attributes['session_time'],
            ],
            [
                'event_type' => $attributes['event_type'],
                'location' => $attributes['location'],
                'status' => $attributes['status'],
                'notes' => $attributes['notes'],
            ],
        );

        $amountDue = PackagePricing::priceFor($attributes['event_type'], (float) $attributes['amount_due']);
        $amountPaid = (float) $attributes['amount_paid'];
        $remaining = max($amountDue - $amountPaid, 0);

        Payment::updateOrCreate(
            ['booking_id' => $booking->id],
            [
                'amount_due' => $amountDue,
                'amount_paid' => $amountPaid,
                'remaining_balance' => $remaining,
                'status' => Payment::statusFor($amountDue, $amountPaid),
                'payment_date' => $amountPaid > 0 ? now()->toDateString() : null,
            ],
        );

        $filename = str($client->user->name)->studly()."_{$attributes['session_date']}_".str($attributes['event_type'])->studly().'.jpg';
        $path = 'photos/'.str($client->user->name)->slug()."/{$attributes['session_date']}/{$filename}";

        Photo::updateOrCreate(
            ['path' => $path],
            [
                'booking_id' => $booking->id,
                'filename' => $filename,
                'status' => $attributes['photo_status'],
                'delivery_status' => $attributes['photo_status'],
            ],
        );

        return $booking;
    }
}
