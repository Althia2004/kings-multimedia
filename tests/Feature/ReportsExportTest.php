<?php

use App\Models\User;

test('admin can download reports excel export', function () {
    $admin = User::factory()->create([
        'role' => 'Admin',
        'is_admin' => true,
    ]);

    $response = $this->actingAs($admin)->get(route('reports.export.excel', ['range' => 'monthly']));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect($response->getContent())->toStartWith('PK');
});

test('admin can download reports pdf export', function () {
    $admin = User::factory()->create([
        'role' => 'Admin',
        'is_admin' => true,
    ]);

    $response = $this->actingAs($admin)->get(route('reports.export.pdf', ['range' => 'monthly']));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/pdf');
    expect($response->getContent())->toStartWith('%PDF');
});
