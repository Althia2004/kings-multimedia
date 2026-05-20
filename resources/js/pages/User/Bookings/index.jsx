import React, { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
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

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(`${date}T00:00:00`));
}

export default function UserBookingModule({ bookings = [], availableDates = [] }) {
    const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false);
    const [selectedSuggestedDate, setSelectedSuggestedDate] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm({
        event_type: 'Graduation',
        session_date: '',
        session_time: '',
        location: '',
        notes: '',
    });
    const inlineErrors = Object.entries(errors).filter(
        ([key]) => !(key === 'session_date' && availableDates.length > 0),
    );

    useEffect(() => {
        if (! errors.session_date || availableDates.length === 0) {
            return;
        }

        setSelectedSuggestedDate(availableDates[0]);
        setIsAvailabilityDialogOpen(true);
    }, [availableDates, errors.session_date]);

    const submit = (event) => {
        event.preventDefault();
        post('/bookings', {
            preserveScroll: true,
            onSuccess: () => reset('session_date', 'session_time', 'location', 'notes'),
        });
    };

    const chooseSuggestedDate = () => {
        if (! selectedSuggestedDate) return;

        setData('session_date', selectedSuggestedDate);
        setIsAvailabilityDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <Head title="My Bookings" />

            <Card className="border-white/10 bg-white/5 text-white">
                <CardHeader>
                    <CardTitle className="text-white">Submit a booking request</CardTitle>
                    <CardDescription>Admin approval is required before payment and photo release.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                        <Input value={data.event_type} onChange={(event) => setData('event_type', event.target.value)} placeholder="Event type" />
                        <Input type="date" value={data.session_date} onChange={(event) => setData('session_date', event.target.value)} />
                        <Input type="time" value={data.session_time} onChange={(event) => setData('session_time', event.target.value)} />
                        <Input value={data.location} onChange={(event) => setData('location', event.target.value)} placeholder="Location" />
                        <Input className="sm:col-span-2" value={data.notes} onChange={(event) => setData('notes', event.target.value)} placeholder="Notes" />
                        <Button disabled={processing} className="bg-[#D4AF37] text-black hover:bg-[#f1ce62]">
                            Submit Request
                        </Button>
                    </form>
                    {inlineErrors.length > 0 && (
                        <p className="mt-3 text-sm text-red-300">{inlineErrors[0][1]}</p>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isAvailabilityDialogOpen} onOpenChange={setIsAvailabilityDialogOpen}>
                <DialogContent className="border-white/10 bg-[#090909] text-white sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Selected Date Unavailable</DialogTitle>
                        <DialogDescription>
                            The selected session date has already been reserved.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <p className="text-sm font-medium text-white/70">Suggested available dates:</p>
                        <div className="grid gap-2">
                            {availableDates.map((date) => (
                                <label
                                    key={date}
                                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10"
                                >
                                    <input
                                        type="radio"
                                        name="available_date"
                                        value={date}
                                        checked={selectedSuggestedDate === date}
                                        onChange={(event) => setSelectedSuggestedDate(event.target.value)}
                                        className="accent-[#D4AF37]"
                                    />
                                    <span>{formatDate(date)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAvailabilityDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={chooseSuggestedDate}
                            disabled={!selectedSuggestedDate}
                            className="bg-[#D4AF37] text-black hover:bg-[#f1ce62]"
                        >
                            Choose Date
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card className="border-white/10 bg-white/5 text-white">
                <CardHeader>
                    <CardTitle className="text-white">Booking history</CardTitle>
                    <CardDescription>Recent bookings, payment status, and approval progress.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="max-h-105">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10">
                                    <TableHead>Booking ID</TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Approval Status</TableHead>
                                    <TableHead>Payment Status</TableHead>
                                    <TableHead>Session Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.map((booking) => (
                                    <TableRow key={booking.id} className="border-white/10">
                                        <TableCell>BK-{String(booking.id).padStart(4, '0')}</TableCell>
                                        <TableCell>{booking.eventType}</TableCell>
                                        <TableCell>{booking.date}</TableCell>
                                        <TableCell>{booking.time}</TableCell>
                                        <TableCell>{booking.location}</TableCell>
                                        <TableCell>
                                            <Badge variant={booking.bookingStatus === 'Approved' ? 'success' : booking.bookingStatus === 'Pending' ? 'warning' : 'secondary'}>
                                                {booking.bookingStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={booking.paymentStatus === 'Paid' ? 'success' : booking.paymentStatus === 'Partial' ? 'warning' : 'destructive'}>
                                                {booking.paymentStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={booking.bookingStatus === 'Completed' ? 'success' : booking.bookingStatus === 'Cancelled' ? 'destructive' : 'secondary'}>
                                                {booking.bookingStatus === 'Approved' ? 'Scheduled' : booking.bookingStatus}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {bookings.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-8 text-center text-white/45">
                                            No booking history yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
