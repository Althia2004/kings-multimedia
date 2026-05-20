import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Bell, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function NotificationsPage({ notifications = [] }) {
    return (
        <>
            <Head title="Notifications" />

            <Card className="border-white/10 bg-white/5 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Bell className="size-5 text-[#D4AF37]" />
                        Notification Center
                    </CardTitle>
                    <CardDescription>
                        Booking approvals, payment reminders, upcoming sessions, and photo release alerts.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-start"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-semibold text-white">{notification.title}</p>
                                    <Badge variant={notification.isRead ? 'secondary' : 'success'}>
                                        {notification.isRead ? 'Read' : 'New'}
                                    </Badge>
                                </div>
                                <p className="mt-1 text-sm text-white/60">{notification.message}</p>
                                <p className="mt-2 text-xs text-white/35">
                                    {notification.user ? `${notification.user} - ` : ''}
                                    {notification.createdAt}
                                </p>
                            </div>
                            {!notification.isRead && (
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => router.patch(`/notifications/${notification.id}/read`, {}, { preserveScroll: true })}
                                >
                                    <Check className="size-4" />
                                    Mark read
                                </Button>
                            )}
                        </div>
                    ))}
                    {notifications.length === 0 && (
                        <p className="py-8 text-center text-sm text-white/45">
                            No notifications yet.
                        </p>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
