<?php

namespace App\Console\Commands;

use App\Models\Client;
use App\Models\User;
use Illuminate\Console\Command;

class SyncClientProfiles extends Command
{
    protected $signature = 'sync:client-profiles';

    protected $description = 'Create missing client profiles for existing client users.';

    public function handle(): int
    {
        $created = 0;
        $normalized = User::query()
            ->where('role', 'client')
            ->update(['role' => 'Client']);

        User::query()
            ->where('role', 'Client')
            ->whereDoesntHave('client')
            ->chunkById(100, function ($users) use (&$created) {
                foreach ($users as $user) {
                    Client::create([
                        'user_id' => $user->id,
                        'contact_number' => null,
                        'address' => null,
                        'notes' => null,
                    ]);

                    $created++;
                }
            });

        $this->info("Synced {$created} missing client profile".($created === 1 ? '' : 's').'.');
        $this->info("Normalized {$normalized} client role".($normalized === 1 ? '' : 's').'.');

        return self::SUCCESS;
    }
}
