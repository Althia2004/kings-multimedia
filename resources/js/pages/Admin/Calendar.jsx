import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { CalendarDays, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const statusVariant = {
    Approved: 'destructive',
    Pending: 'warning',
    Available: 'success',
};

function buildCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1);
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        return date;
    });
}

export default function AdminCalendar({ bookings = [] }) {
    const displayDate = new Date();
    const days = useMemo(
        () => buildCalendarDays(displayDate.getFullYear(), displayDate.getMonth()),
        [displayDate],
    );

    return (
        <>
            <Head title="Calendar" />

            <Card className="border-white/10 bg-white/5">
                <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <CalendarDays className="size-5 text-[#D4AF37]" />
                            Calendar Scheduling
                        </CardTitle>
                        <CardDescription>Approved sessions are treated as booked slots. Pending sessions are shown for review.</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/bookings">
                            <Plus className="size-4" />
                            Add Session
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">
                            {displayDate.toLocaleString('en', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="destructive">Booked</Badge>
                            <Badge variant="warning">Pending</Badge>
                            <Badge variant="success">Available</Badge>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-white/10">
                        <div className="min-w-[840px]">
                            <div className="grid grid-cols-7 bg-white/10 text-center text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div key={day} className="border-r border-white/10 px-3 py-3 last:border-r-0">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7">
                                {days.map((day) => {
                                    const isoDate = day.toISOString().slice(0, 10);
                                    const dayEvents = bookings.filter((booking) => booking.date === isoDate);
                                    const muted = day.getMonth() !== displayDate.getMonth();

                                    return (
                                        <div key={isoDate} className="min-h-32 border-t border-r border-white/10 p-3 last:border-r-0">
                                            <span className={muted ? 'text-muted-foreground' : 'font-medium text-white'}>
                                                {day.getDate()}
                                            </span>
                                            <div className="mt-3 space-y-2">
                                                {dayEvents.map((event) => (
                                                    <div key={event.id} className="rounded-lg bg-white/10 p-2">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="truncate text-xs font-medium text-white">{event.client} - {event.eventType}</p>
                                                            <Badge variant={statusVariant[event.status] ?? 'secondary'}>
                                                                {event.status === 'Approved' ? 'Booked' : event.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {event.time} - {event.location}
                                                        </p>
                                                    </div>
                                                ))}
                                                {dayEvents.length === 0 && !muted && (
                                                    <Badge variant="success">Available</Badge>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
