import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit, Power, Search, Trash2, UserPlus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const roles = ['Super Admin', 'Admin', 'Photographer', 'Editor', 'Staff'];
const statuses = ['Active', 'Inactive'];

const statCards = [
    { key: 'totalEmployees', label: 'Total Employees' },
    { key: 'totalAdmins', label: 'Total Admins' },
    { key: 'photographers', label: 'Photographers' },
    { key: 'editors', label: 'Editors' },
];

function emptyForm() {
    return {
        name: '',
        email: '',
        password: '',
        role: 'Staff',
        position: '',
        contact_number: '',
        address: '',
        status: 'Active',
    };
}

export default function Employees({
    employees = [],
    stats = {},
    canManageEmployees = false,
    currentUserId,
    mode,
    editingEmployee,
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const employeeForm = useForm(emptyForm());
    const isModalOpen = mode === 'create' || mode === 'edit';
    const isEditing = mode === 'edit' && editingEmployee;

    useEffect(() => {
        if (isEditing) {
            employeeForm.setData({
                name: editingEmployee.name ?? '',
                email: editingEmployee.email ?? '',
                password: '',
                role: editingEmployee.role ?? 'Staff',
                position: editingEmployee.position ?? '',
                contact_number: editingEmployee.contactNumber ?? '',
                address: editingEmployee.address ?? '',
                status: editingEmployee.status ?? 'Active',
            });
            return;
        }

        if (mode === 'create') {
            employeeForm.setData(emptyForm());
        }
    }, [mode, editingEmployee?.id]);

    const filteredEmployees = useMemo(() => {
        return employees.filter((employee) => {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                !query ||
                employee.employeeId?.toLowerCase().includes(query) ||
                employee.name?.toLowerCase().includes(query) ||
                employee.email?.toLowerCase().includes(query) ||
                employee.position?.toLowerCase().includes(query);
            const matchesRole = !roleFilter || employee.role === roleFilter;
            const matchesStatus = !statusFilter || employee.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [employees, searchQuery, roleFilter, statusFilter]);

    const closeModal = () => {
        employeeForm.clearErrors();
        router.get('/employees', {}, { preserveScroll: true });
    };

    const saveEmployee = (event) => {
        event.preventDefault();

        if (isEditing) {
            employeeForm.patch(`/employees/${editingEmployee.id}`, {
                preserveScroll: true,
                onSuccess: closeModal,
            });
            return;
        }

        employeeForm.post('/employees', {
            preserveScroll: true,
            onSuccess: closeModal,
        });
    };

    const toggleStatus = (employee) => {
        router.patch(
            `/employees/${employee.id}`,
            {
                name: employee.name,
                email: employee.email,
                role: employee.role,
                position: employee.position,
                contact_number: employee.contactNumber,
                address: employee.address,
                status: employee.status === 'Active' ? 'Inactive' : 'Active',
            },
            { preserveScroll: true },
        );
    };

    const deleteEmployee = () => {
        if (!employeeToDelete) return;

        router.delete(`/employees/${employeeToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setEmployeeToDelete(null),
        });
    };

    return (
        <>
            <Head title="Employee Management" />

            <div className="space-y-6">
                <Card className="border-white/10 bg-linear-to-br from-white/10 via-white/5 to-black/30 text-white">
                    <CardHeader className="gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-2xl text-white">
                                <Users className="size-6 text-[#D4AF37]" />
                                Employee Management
                            </CardTitle>
                            <CardDescription>
                                Manage Kings Media team members and staff access.
                            </CardDescription>
                        </div>
                        {canManageEmployees && (
                            <Button asChild className="bg-[#D4AF37] text-black hover:bg-[#f1ce62]">
                                <Link href="/employees/create">
                                    <UserPlus className="size-4" />
                                    Add Employee
                                </Link>
                            </Button>
                        )}
                    </CardHeader>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((stat) => (
                        <Card key={stat.key} className="border-white/10 bg-white/5 text-white">
                            <CardHeader>
                                <CardDescription>{stat.label}</CardDescription>
                                <CardTitle className="text-3xl text-white">
                                    {stats[stat.key] ?? 0}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <Card className="border-white/10 bg-white/5 text-white">
                    <CardContent className="grid gap-4 pt-6 lg:grid-cols-[1fr_220px_220px]">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
                            <Input
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search employee..."
                                className="pl-9"
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(event) => setRoleFilter(event.target.value)}
                            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                        >
                            <option value="">All roles</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                        >
                            <option value="">All statuses</option>
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Team members</CardTitle>
                        <CardDescription>
                            Super Admins can create, edit, delete, and activate staff. Admins can view employees.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="max-h-[620px]">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead>Employee ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Position</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Activity</TableHead>
                                        <TableHead>Created Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEmployees.map((employee) => {
                                        const canDelete =
                                            canManageEmployees &&
                                            employee.userId !== currentUserId &&
                                            !employee.isSuperAdmin;
                                        const canModify =
                                            canManageEmployees &&
                                            (!employee.isSuperAdmin || employee.userId === currentUserId);

                                        return (
                                            <TableRow key={employee.id} className="border-white/10">
                                                <TableCell className="font-medium text-white">
                                                    {employee.employeeId}
                                                </TableCell>
                                                <TableCell>{employee.name}</TableCell>
                                                <TableCell>{employee.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={employee.role === 'Super Admin' ? 'success' : 'secondary'}>
                                                        {employee.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{employee.position}</TableCell>
                                                <TableCell>
                                                    <Badge variant={employee.status === 'Active' ? 'success' : 'destructive'}>
                                                        {employee.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <Badge variant={employee.activityStatus === 'Online' ? 'success' : 'secondary'}>
                                                            {employee.activityStatus}
                                                        </Badge>
                                                        <p className="text-xs text-white/45">{employee.lastLogin}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{employee.createdDate}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Button asChild size="sm" variant="secondary" disabled={!canModify}>
                                                            <Link href={`/employees/${employee.id}/edit`}>
                                                                <Edit className="size-4" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={!canModify}
                                                            onClick={() => toggleStatus(employee)}
                                                        >
                                                            <Power className="size-4" />
                                                            {employee.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            disabled={!canDelete}
                                                            onClick={() => setEmployeeToDelete(employee)}
                                                        >
                                                            <Trash2 className="size-4" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {filteredEmployees.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={9} className="py-8 text-center text-white/45">
                                                No employees match your filters.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="border-white/10 bg-[#090909] text-white sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit employee' : 'Add employee'}</DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Update staff access and profile details.' : 'Create a new internal Kings Media staff account.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={saveEmployee} className="grid gap-4 sm:grid-cols-2">
                        <Input value={employeeForm.data.name} onChange={(event) => employeeForm.setData('name', event.target.value)} placeholder="Name" />
                        <Input value={employeeForm.data.email} onChange={(event) => employeeForm.setData('email', event.target.value)} placeholder="Email" />
                        <Input type="password" value={employeeForm.data.password} onChange={(event) => employeeForm.setData('password', event.target.value)} placeholder={isEditing ? 'New password (optional)' : 'Password'} />
                        <select value={employeeForm.data.role} onChange={(event) => employeeForm.setData('role', event.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white">
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                        <Input value={employeeForm.data.position} onChange={(event) => employeeForm.setData('position', event.target.value)} placeholder="Position" />
                        <Input value={employeeForm.data.contact_number} onChange={(event) => employeeForm.setData('contact_number', event.target.value)} placeholder="Contact Number" />
                        {isEditing && (
                            <select value={employeeForm.data.status} onChange={(event) => employeeForm.setData('status', event.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white sm:col-span-2">
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        )}
                        <textarea
                            value={employeeForm.data.address}
                            onChange={(event) => employeeForm.setData('address', event.target.value)}
                            placeholder="Address"
                            rows={3}
                            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/35 sm:col-span-2"
                        />
                        {Object.keys(employeeForm.errors).length > 0 && (
                            <p className="text-sm text-red-300 sm:col-span-2">
                                {Object.values(employeeForm.errors)[0]}
                            </p>
                        )}
                        <DialogFooter className="sm:col-span-2">
                            <Button type="button" variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button disabled={employeeForm.processing} className="bg-[#D4AF37] text-black hover:bg-[#f1ce62]">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(employeeToDelete)} onOpenChange={(open) => !open && setEmployeeToDelete(null)}>
                <DialogContent className="border-white/10 bg-[#090909] text-white">
                    <DialogHeader>
                        <DialogTitle>Delete this employee?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEmployeeToDelete(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={deleteEmployee}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
