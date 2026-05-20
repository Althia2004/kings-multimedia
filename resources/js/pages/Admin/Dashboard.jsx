import React from 'react';
import { Head } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import DashboardLayout from '@/layouts/DashboardLayout';
import { BarChart, LineChart } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
    const metrics = [
        { label: 'Total Bookings', value: 120 },
        { label: 'Pending Bookings', value: 15 },
        { label: 'Monthly Revenue', value: '$12,500' },
        { label: 'Total Clients', value: 45 },
        { label: 'Total Photos Uploaded', value: 320 },
        { label: 'Upcoming Sessions', value: 8 },
    ];

    const recentActivity = [
        'John booked Graduation Package',
        'Photos uploaded for Maria',
        'Payment received from Alex',
    ];

    const upcomingSchedules = [
        {
            client: 'Maria',
            event: 'Wedding',
            date: 'May 25, 2026',
            status: 'Confirmed',
        },
        {
            client: 'John',
            event: 'Graduation',
            date: 'May 28, 2026',
            status: 'Pending',
        },
        {
            client: 'Alex',
            event: 'Birthday',
            date: 'June 1, 2026',
            status: 'Confirmed',
        },
    ];

    return (
        <DashboardLayout
            breadcrumbs={[
                { label: 'Admin Dashboard', href: '/admin/dashboard' },
            ]}
        >
            <Head title="Admin Dashboard" />

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {metrics.map((metric) => (
                    <Card
                        key={metric.label}
                        className="bg-linear-to-br from-white/5 via-white/10 to-black/40"
                    >
                        <CardHeader>
                            <CardTitle className="text-white">
                                {metric.label}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                {metric.value}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Chart</CardTitle>
                        <CardDescription>Weekly income</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LineChart
                            data={{
                                labels: [
                                    'Mon',
                                    'Tue',
                                    'Wed',
                                    'Thu',
                                    'Fri',
                                    'Sat',
                                    'Sun',
                                ],
                                datasets: [
                                    {
                                        label: 'Revenue',
                                        data: [
                                            2000, 2500, 1800, 2200, 3000, 2800,
                                            3200,
                                        ],
                                        borderColor: '#facc15',
                                        backgroundColor:
                                            'rgba(250, 204, 21, 0.2)',
                                    },
                                ],
                            }}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Booking Chart</CardTitle>
                        <CardDescription>
                            Pending, Approved, Completed, Cancelled
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={{
                                labels: [
                                    'Pending',
                                    'Approved',
                                    'Completed',
                                    'Cancelled',
                                ],
                                datasets: [
                                    {
                                        label: 'Bookings',
                                        data: [15, 60, 40, 5],
                                        backgroundColor: [
                                            '#facc15',
                                            '#22c55e',
                                            '#3b82f6',
                                            '#ef4444',
                                        ],
                                    },
                                ],
                            }}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {recentActivity.map((activity, index) => (
                                <li
                                    key={index}
                                    className="text-sm text-muted-foreground"
                                >
                                    {activity}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Schedules</CardTitle>
                        <CardDescription>Client appointments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {upcomingSchedules.map((schedule, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{schedule.client}</TableCell>
                                        <TableCell>{schedule.event}</TableCell>
                                        <TableCell>{schedule.date}</TableCell>
                                        <TableCell>
                                            <Badge>{schedule.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Perform common tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <Button>Add Booking</Button>
                            <Button>Upload Photos</Button>
                            <Button>Add Client</Button>
                            <Button>Create Reminder</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
