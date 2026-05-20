<?php

namespace App\Support;

class PackagePricing
{
    /**
     * Resolve the standard Kings Media package price for a booking event type.
     */
    public static function priceFor(?string $eventType, float $fallback = 0): float
    {
        $normalized = strtolower(trim((string) $eventType));

        return match (true) {
            str_contains($normalized, 'graduation') => 2500,
            str_contains($normalized, 'wedding') => 15000,
            str_contains($normalized, 'portrait') => 1800,
            str_contains($normalized, 'birthday') => 3500,
            str_contains($normalized, 'corporate') => 8000,
            default => $fallback,
        };
    }
}
