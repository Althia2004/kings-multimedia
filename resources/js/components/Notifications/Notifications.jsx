import React, { useEffect, useMemo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    CalendarClock,
    Check,
    CheckCheck,
    CreditCard,
    Image,
    Megaphone,
    Send,
    ShieldCheck,
} from 'lucide-react';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'kings-media-notifications';
const NOTIFICATIONS_CHANGED_EVENT = 'kings-media-notifications-changed';

export const NOTIFICATION_TYPES = [
    'Booking approved',
    'Payment reminder',
    'Upcoming schedule reminder',
    'Photos ready',
    'Custom notification',
];

const typeMeta = {
    'Booking approved': {
        icon: ShieldCheck,
        tone: 'text-emerald-500 bg-emerald-500/10',
    },
    'Payment reminder': {
        icon: CreditCard,
        tone: 'text-amber-500 bg-amber-500/10',
    },
    'Upcoming schedule reminder': {
        icon: CalendarClock,
        tone: 'text-sky-500 bg-sky-500/10',
    },
    'Photos ready': {
        icon: Image,
        tone: 'text-violet-500 bg-violet-500/10',
    },
    'Custom notification': {
        icon: Megaphone,
        tone: 'text-rose-500 bg-rose-500/10',
    },
};

const starterNotifications = [
    {
        id: 'booking-approved-1',
        type: 'Booking approved',
        title: 'Booking approved',
        message: 'Your portrait session has been approved for May 25, 2026.',
        audience: 'client',
        read: false,
        createdAt: '2026-05-20T08:30:00.000Z',
    },
    {
        id: 'payment-reminder-1',
        type: 'Payment reminder',
        title: 'Payment reminder',
        message: 'Your remaining balance is due before the scheduled shoot.',
        audience: 'client',
        read: false,
        createdAt: '2026-05-19T13:10:00.000Z',
    },
    {
        id: 'schedule-reminder-1',
        type: 'Upcoming schedule reminder',
        title: 'Upcoming schedule reminder',
        message: 'Your graduation session starts tomorrow at 3:00 PM.',
        audience: 'client',
        read: true,
        createdAt: '2026-05-18T09:00:00.000Z',
    },
    {
        id: 'photos-ready-1',
        type: 'Photos ready',
        title: 'Photos ready',
        message: 'Your edited gallery is ready for download in My Photos.',
        audience: 'client',
        read: false,
        createdAt: '2026-05-17T15:45:00.000Z',
    },
];

function readStoredNotifications() {
    if (typeof window === 'undefined') {
        return starterNotifications;
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : starterNotifications;
    } catch {
        return starterNotifications;
    }
}

function persistNotifications(notifications) {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    window.queueMicrotask(() => {
        window.dispatchEvent(
            new CustomEvent(NOTIFICATIONS_CHANGED_EVENT, {
                detail: notifications,
            }),
        );
    });
}

function useNotificationStore() {
    const [notifications, setNotificationsState] = useState(
        readStoredNotifications,
    );

    useEffect(() => {
        const syncNotifications = (event) => {
            setNotificationsState(event.detail || readStoredNotifications());
        };

        const syncStoredNotifications = (event) => {
            if (event.key === STORAGE_KEY) {
                setNotificationsState(readStoredNotifications());
            }
        };

        window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, syncNotifications);
        window.addEventListener('storage', syncStoredNotifications);

        return () => {
            window.removeEventListener(
                NOTIFICATIONS_CHANGED_EVENT,
                syncNotifications,
            );
            window.removeEventListener('storage', syncStoredNotifications);
        };
    }, []);

    const setNotifications = (updater) => {
        setNotificationsState((current) => {
            const next =
                typeof updater === 'function' ? updater(current) : updater;
            persistNotifications(next);
            return next;
        });
    };

    return [notifications, setNotifications];
}

function formatDate(value) {
    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
}

function NotificationIcon({ type }) {
    const meta = typeMeta[type] || typeMeta['Custom notification'];
    const Icon = meta.icon;

    return (
        <span
            className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-full',
                meta.tone,
            )}
        >
            <Icon className="size-5" />
        </span>
    );
}

function NotificationList({ notifications, onMarkRead, compact = false }) {
    if (!notifications.length) {
        return (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No notifications yet.
            </div>
        );
    }

    return (
        <div
            className={cn(
                'space-y-3',
                compact && 'max-h-96 overflow-y-auto pr-1',
            )}
        >
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={cn(
                        'flex gap-3 rounded-lg border p-3 transition',
                        notification.read
                            ? 'bg-background'
                            : 'border-primary/30 bg-primary/5',
                    )}
                >
                    <NotificationIcon type={notification.type} />
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{notification.title}</p>
                            {!notification.read && (
                                <Badge
                                    className="bg-primary/15 text-primary"
                                    variant="secondary"
                                >
                                    New
                                </Badge>
                            )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                            {formatDate(notification.createdAt)}
                        </p>
                    </div>
                    {!notification.read && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 shrink-0"
                            onClick={() => onMarkRead(notification.id)}
                            aria-label="Mark notification as read"
                        >
                            <Check className="size-4" />
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
}

function AdminNotificationForm({ onSend }) {
    const [type, setType] = useState('Custom notification');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const submit = (event) => {
        event.preventDefault();

        if (!title.trim() || !message.trim()) {
            return;
        }

        onSend({
            id: `custom-${Date.now()}`,
            type,
            title: title.trim(),
            message: message.trim(),
            audience: 'client',
            read: false,
            createdAt: new Date().toISOString(),
        });

        setType('Custom notification');
        setTitle('');
        setMessage('');
    };

    return (
        <form
            onSubmit={submit}
            className="space-y-4 rounded-lg border bg-muted/20 p-4"
        >
            <div>
                <p className="font-medium">Send custom notification</p>
                <p className="text-sm text-muted-foreground">
                    Create a client alert for bookings, payments, schedules, or
                    delivered photos.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="notification-type">Type</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger
                            id="notification-type"
                            className="w-full"
                        >
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {NOTIFICATION_TYPES.map((notificationType) => (
                                <SelectItem
                                    key={notificationType}
                                    value={notificationType}
                                >
                                    {notificationType}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notification-title">Title</Label>
                    <Input
                        id="notification-title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Payment due soon"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notification-message">Message</Label>
                <textarea
                    id="notification-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Write the notification details for the client."
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
            </div>

            <Button type="submit" className="w-full sm:w-auto">
                <Send className="size-4" />
                Send notification
            </Button>
        </form>
    );
}

function NotificationsPanel({
    fullPage = false,
    notifications,
    setNotifications,
}) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const isAdmin = Boolean(
        ['Super Admin', 'Admin', 'admin'].includes(user?.role) ||
            user?.isAdmin ||
            user?.is_admin,
    );

    const visibleNotifications = useMemo(() => {
        return notifications
            .filter(
                (notification) => isAdmin || notification.audience !== 'admin',
            )
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [isAdmin, notifications]);

    const unreadCount = visibleNotifications.filter(
        (notification) => !notification.read,
    ).length;

    const markAsRead = (id) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification,
            ),
        );
    };

    const markAllAsRead = () => {
        setNotifications((current) =>
            current.map((notification) =>
                visibleNotifications.some(
                    (visible) => visible.id === notification.id,
                )
                    ? { ...notification, read: true }
                    : notification,
            ),
        );
    };

    const addNotification = (notification) => {
        setNotifications((current) => [notification, ...current]);
    };

    return (
        <div
            className={cn('space-y-4', fullPage && 'mx-auto w-full max-w-4xl')}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2
                        className={cn(
                            'font-semibold',
                            fullPage ? 'text-2xl' : 'text-lg',
                        )}
                    >
                        Notifications
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {unreadCount
                            ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}`
                            : 'All caught up'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={markAllAsRead}
                    >
                        <CheckCheck className="size-4" />
                        Mark all read
                    </Button>
                )}
            </div>

            {isAdmin && <AdminNotificationForm onSend={addNotification} />}

            <NotificationList
                notifications={visibleNotifications}
                onMarkRead={markAsRead}
                compact={!fullPage}
            />

            {!fullPage && (
                <Button asChild variant="ghost" className="w-full">
                    <Link href="/notifications">View all notifications</Link>
                </Button>
            )}
        </div>
    );
}

export default function Notifications({ variant = 'dropdown' }) {
    const [notifications, setNotifications] = useNotificationStore();
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const isAdmin = Boolean(
        ['Super Admin', 'Admin', 'admin'].includes(user?.role) ||
            user?.isAdmin ||
            user?.is_admin,
    );

    const unreadCount = notifications.filter((notification) => {
        return (
            !notification.read && (isAdmin || notification.audience !== 'admin')
        );
    }).length;

    if (variant === 'page') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Notification Center</CardTitle>
                    <CardDescription>
                        Client reminders and studio updates for bookings,
                        payments, schedules, and photo delivery.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <NotificationsPanel
                        fullPage
                        notifications={notifications}
                        setNotifications={setNotifications}
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                    aria-label="Open notifications"
                >
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[min(24rem,calc(100vw-2rem))] p-4"
            >
                <NotificationsPanel
                    notifications={notifications}
                    setNotifications={setNotifications}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
