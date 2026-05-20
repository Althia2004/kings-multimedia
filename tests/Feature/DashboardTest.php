<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $user = User::factory()->create();
    $team = $user->currentTeam;

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $team = $user->currentTeam;

    $response = $this
        ->actingAs($user)
        ->get(route('dashboard'));

    $response->assertOk();
    expect($response->headers->get('Cache-Control'))->toContain('no-store');
    expect($response->headers->get('Cache-Control'))->toContain('no-cache');
    expect($response->headers->get('Cache-Control'))->toContain('must-revalidate');
    expect($response->headers->get('Cache-Control'))->toContain('max-age=0');
    $response->assertHeader('Pragma', 'no-cache');
    $response->assertHeader('Expires', '0');
});

test('auth check reports guests as unauthenticated', function () {
    $response = $this->getJson('/auth-check');

    $response
        ->assertUnauthorized()
        ->assertJson(['authenticated' => false]);
});

test('auth check reports logged in users as authenticated', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/auth-check');

    $response
        ->assertOk()
        ->assertJson(['authenticated' => true]);
});
