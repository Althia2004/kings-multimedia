import React, { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { CalendarCheck, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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

const statusBadge = {
    Approved: 'success',
    Pending: 'warning',
    Rejected: 'destructive',
    Completed: 'success',
    Cancelled: 'destructive',
};

const paymentBadge = {
    Paid: 'success',
    Partial: 'warning',
    Unpaid: 'destructive',
};

export default function AdminBookingManagement({ bookings = [], clients = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterEvent, setFilterEvent] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm({
        client_id: clients[0]?.id ?? '',
        event_type: 'Graduation',
        session_date: '',
        session_time: '',
        location: '',
        notes: '',
        amount_due: '',
    });

    const eventTypes = [...new Set(bookings.map((booking) => booking.eventType))];

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const matchesSearch =
                searchQuery === '' ||
                booking.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(booking.id).includes(searchQuery);
            const matchesDate = filterDate === '' || booking.date === filterDate;
            const matchesStatus = filterStatus === '' || booking.bookingStatus === filterStatus;
            const matchesEvent = filterEvent === '' || booking.eventType === filterEvent;

            return matchesSearch && matchesDate && matchesStatus && matchesEvent;
        });
    }, [bookings, searchQuery, filterDate, filterStatus, filterEvent]);

    const submitBooking = (event) => {
        event.preventDefault();
        post('/bookings', {
            preserveScroll: true,
            onSuccess: () => reset('session_date', 'session_time', 'location', 'notes', 'amount_due'),
        });
    };

    return (
        <>
            <Head title="Booking Management" />

            <div className="space-y-6">
                <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <CalendarCheck className="size-5 text-[#D4AF37]" />
                            New Booking
                        </CardTitle>
                        <CardDescription>
                            Bookings are created with payment records and checked against approved schedules.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitBooking} className="grid gap-4 lg:grid-cols-6">
                            <select
                                value={data.client_id}
                                onChange={(event) => setData('client_id', event.target.value)}
                                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                            >
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                            <Input value={data.event_type} onChange={(event) => setData('event_type', event.target.value)} placeholder="Event type" />
                            <Input type="date" value={data.session_date} onChange={(event) => setData('session_date', event.target.value)} />
                            <Input type="time" value={data.session_time} onChange={(event) => setData('session_time', event.target.value)} />
                            <Input value={data.location} onChange={(event) => setData('location', event.target.value)} placeholder="Location" />
                            <Input type="number" min="0" value={data.amount_due} onChange={(event) => setData('amount_due', event.target.value)} placeholder="Amount due" />
                            <Input className="lg:col-span-5" value={data.notes} onChange={(event) => setData('notes', event.target.value)} placeholder="Notes" />
                            <Button disabled={processing} className="bg-[#D4AF37] text-black hover:bg-[#f1ce62]">
                                Save Booking
                            </Button>
                        </form>
                        {Object.keys(errors).length > 0 && (
                            <p className="mt-3 text-sm text-red-300">
                                {Object.values(errors)[0]}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Search className="size-5 text-[#D4AF37]" />
                            Booking Management
                        </CardTitle>
                        <CardDescription>View, search, filter, approve, reject, reschedule, and delete bookings.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 lg:grid-cols-4">
                        <Input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Client name or booking ID" />
                        <Input type="date" value={filterDate} onChange={(event) => setFilterDate(event.target.value)} />
                        <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white">
                            <option value="">All statuses</option>
                            {['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'].map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <select value={filterEvent} onChange={(event) => setFilterEvent(event.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white">
                            <option value="">All event types</option>
                            {eventTypes.map((eventType) => (
                                <option key={eventType} value={eventType}>{eventType}</option>
                            ))}
                        </select>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Booking requests</CardTitle>
                        <CardDescription>Admin approval controls enforce no double booking for approved sessions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="max-h-[520px]">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead>Booking ID</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBookings.map((booking) => (
                                        <TableRow key={booking.id} className="border-white/10">
                                            <TableCell>BK-{String(booking.id).padStart(4, '0')}</TableCell>
                                            <TableCell>{booking.client}</TableCell>
                                            <TableCell>{booking.eventType}</TableCell>
                                            <TableCell>{booking.date}</TableCell>
                                            <TableCell>{booking.time}</TableCell>
                                            <TableCell>{booking.location}</TableCell>
                                            <TableCell>
                                                <Badge variant={paymentBadge[booking.paymentStatus] ?? 'secondary'}>{booking.paymentStatus}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={statusBadge[booking.bookingStatus] ?? 'secondary'}>{booking.bookingStatus}</Badge>
                                            </TableCell>
                                            <TableCell className="flex flex-wrap gap-2">
                                                <Button size="sm" onClick={() => router.patch(`/bookings/${booking.id}/approve`, {}, { preserveScroll: true })}>Approve</Button>
                                                <Button size="sm" variant="destructive" onClick={() => router.patch(`/bookings/${booking.id}/reject`, {}, { preserveScroll: true })}>Reject</Button>
                                                <Button size="sm" variant="secondary" onClick={() => router.patch(`/bookings/${booking.id}`, { ...booking, event_type: booking.eventType, session_date: booking.date, session_time: booking.time, status: 'Pending' }, { preserveScroll: true })}>Reschedule</Button>
                                                <Button size="sm" variant="outline" onClick={() => router.delete(`/bookings/${booking.id}`, { preserveScroll: true })}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredBookings.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={9} className="py-8 text-center text-white/45">
                                                No bookings match your filters.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
