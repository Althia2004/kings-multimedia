<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Employee::class);

        return $this->renderIndex($request);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Employee::class);

        return $this->renderIndex($request, 'create');
    }

    public function store(CreateEmployeeRequest $request): RedirectResponse
    {
        $employee = DB::transaction(function () use ($request) {
            $user = User::create($request->safe()->only(['name', 'email', 'password', 'role']));

            return Employee::create([
                'user_id' => $user->id,
                'employee_id' => $this->nextEmployeeId(),
                'position' => $request->string('position')->toString(),
                'contact_number' => $request->string('contact_number')->toString(),
                'address' => $request->input('address'),
                'status' => 'Active',
            ]);
        });

        $this->notify($request->user(), 'Employee added', 'New employee account created', 'employee_added');

        return to_route('employees.index')->with('success', "Employee {$employee->employee_id} created.");
    }

    public function edit(Request $request, Employee $employee): Response
    {
        $this->authorize('viewAny', Employee::class);

        return $this->renderIndex($request, 'edit', $this->serialize($employee->load('user')));
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): RedirectResponse
    {
        $oldRole = $employee->user->role;

        DB::transaction(function () use ($request, $employee) {
            $userData = $request->safe()->only(['name', 'email', 'role']);

            if ($request->filled('password')) {
                $userData['password'] = $request->string('password');
            }

            $employee->user->update($userData);
            $employee->update($request->safe()->only(['position', 'contact_number', 'address', 'status']));
        });

        if ($oldRole !== $request->string('role')->toString()) {
            $this->notify($request->user(), 'Role changed', 'Employee role updated', 'employee_role_changed');
        }

        return to_route('employees.index')->with('success', 'Employee updated.');
    }

    public function destroy(Request $request, Employee $employee): RedirectResponse
    {
        $this->authorize('delete', $employee);

        $employee->user->delete();
        $this->notify($request->user(), 'Employee deleted', 'Employee account removed', 'employee_deleted');

        return to_route('employees.index')->with('success', 'Employee deleted.');
    }

    private function serialize(Employee $employee): array
    {
        $lastActivity = DB::table('sessions')
            ->where('user_id', $employee->user_id)
            ->max('last_activity');

        return [
            'id' => $employee->id,
            'userId' => $employee->user_id,
            'employeeId' => $employee->employee_id,
            'name' => $employee->user?->name,
            'email' => $employee->user?->email,
            'role' => $employee->user?->role,
            'position' => $employee->position,
            'contactNumber' => $employee->contact_number,
            'address' => $employee->address,
            'status' => $employee->status,
            'createdDate' => $employee->created_at?->format('M d, Y'),
            'activityStatus' => $lastActivity && $lastActivity >= now()->subMinutes(5)->timestamp ? 'Online' : 'Offline',
            'lastLogin' => $employee->user?->last_login_at?->diffForHumans() ?? 'No login recorded',
            'isSuperAdmin' => $employee->user?->isSuperAdmin() ?? false,
        ];
    }

    private function renderIndex(Request $request, ?string $mode = null, ?array $editingEmployee = null): Response
    {
        return Inertia::render('Admin/Employees', [
            'employees' => Employee::with('user')
                ->latest()
                ->get()
                ->map(fn (Employee $employee) => $this->serialize($employee)),
            'stats' => [
                'totalEmployees' => Employee::count(),
                'totalAdmins' => Employee::whereHas('user', fn ($query) => $query->whereIn('role', ['Super Admin', 'Admin', 'admin']))->count(),
                'photographers' => Employee::whereHas('user', fn ($query) => $query->where('role', 'Photographer'))->count(),
                'editors' => Employee::whereHas('user', fn ($query) => $query->where('role', 'Editor'))->count(),
            ],
            'canManageEmployees' => $request->user()->canManageEmployees(),
            'currentUserId' => $request->user()->id,
            'mode' => $mode,
            'editingEmployee' => $editingEmployee,
        ]);
    }

    private function nextEmployeeId(): string
    {
        $lastId = Employee::query()
            ->lockForUpdate()
            ->orderByDesc('id')
            ->value('employee_id');

        $next = $lastId ? ((int) str_replace('EMP-', '', $lastId)) + 1 : 1;

        return 'EMP-'.str_pad((string) $next, 4, '0', STR_PAD_LEFT);
    }

    private function notify(User $user, string $title, string $message, string $type): void
    {
        Notification::create([
            'user_id' => $user->id,
            'title' => $title,
            'message' => $message,
            'type' => $type,
        ]);
    }
}
