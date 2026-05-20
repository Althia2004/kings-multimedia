import { Head, Link } from '@inertiajs/react';
import {
    Banknote,
    Camera,
    CheckCircle2,
    Clock3,
    CreditCard,
    Image,
    ImagePlus,
    Plus,
    UserPlus,
    Users,
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const statCards = [
    { key: 'totalBookings', label: 'Total Bookings', detail: 'All booking records', icon: Camera },
    { key: 'activeClients', label: 'Active Clients', detail: 'Client profiles', icon: Users },
    { key: 'monthlyRevenue', label: 'Monthly Revenue', detail: 'Paid this month', icon: Banknote },
    { key: 'pendingDeliveries', label: 'Pending Deliveries', detail: 'Photos not yet released', icon: Clock3 },
];

const clientStatCards = [
    { key: 'activeBookings', label: 'My Active Bookings', detail: 'Pending and approved sessions', icon: Camera },
    { key: 'pendingBalance', label: 'Pending Balance', detail: 'Remaining amount due', icon: Banknote },
    { key: 'photosReady', label: 'Photos Ready', detail: 'Released gallery files', icon: Image },
    { key: 'upcomingSession', label: 'Upcoming Session', detail: 'Next scheduled session', icon: Clock3 },
];

const quickActions = [
    { label: 'Add Booking', href: '/bookings', icon: Plus, external: false },
    { label: 'Upload Photos', href: '/files', icon: ImagePlus, external: false },
    { label: 'Add Client', href: '/clients', icon: UserPlus, external: false },
    { label: 'Create Reminder', href: '/notifications', icon: Clock3, external: false },
];

const clientQuickActions = [
    { label: 'Submit Booking', href: '/my-bookings', icon: Plus, external: false },
    { label: 'View Photos', href: '/my-photos', icon: Image, external: false },
    { label: 'Pay Balance', href: '/my-payments', icon: CreditCard, external: false },
    { label: 'Contact Studio', href: 'mailto:hello@thekingsvault.com', icon: Users, external: true },
];

const statusColors: Record<string, string> = {
    Pending: 'bg-amber-400',
    Approved: 'bg-emerald-400',
    Completed: 'bg-[#D4AF37]',
    Cancelled: 'bg-rose-400',
    Rejected: 'bg-red-400',
};

function money(value: number) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 0,
    }).format(value);
}

function RevenueChart({ revenue = [] }: { revenue?: Array<{ label: string; total: number | string }> }) {
    const rows = revenue.length ? revenue : [{ label: 'No data', total: 0 }];
    const max = Math.max(...rows.map((item) => Number(item.total)), 1);

    return (
        <div className="flex h-72 items-end gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">
            {rows.map((item) => (
                <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-3">
                    <div className="flex flex-1 items-end">
                        <div
                            className="w-full rounded-t-2xl bg-linear-to-t from-[#D4AF37] to-amber-100 shadow-[0_0_40px_rgba(212,175,55,0.18)]"
                            style={{ height: `${Math.max((Number(item.total) / max) * 100, 8)}%` }}
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-medium text-white">{item.label}</p>
                        <p className="text-[0.68rem] text-white/40">{money(Number(item.total))}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

type DashboardProps = {
    dashboardType?: 'admin' | 'client';
    stats?: Record<string, number | string>;
    upcomingSessions?: Array<{
        id: number;
        client: string;
        event: string;
        date: string;
        time: string;
        status: string;
    }>;
    recentActivities?: Array<{ label: string; createdAt: string }>;
    revenueChart?: Array<{ label: string; total: number | string }>;
    bookingStatusChart?: Array<{ label: string; value: number }>;
};

export default function Dashboard({
    dashboardType = 'admin',
    stats = {},
    upcomingSessions = [],
    recentActivities = [],
    revenueChart = [],
    bookingStatusChart = [],
}: DashboardProps) {
    const isClient = dashboardType === 'client';
    const visibleStats = isClient ? clientStatCards : statCards;
    const visibleActions = isClient ? clientQuickActions : quickActions;

    return (
        <>
            <Head title="Dashboard" />

            <main className="space-y-6">
                <section className="rounded-[2rem] border border-white/10 bg-linear-to-br from-white/10 via-white/5 to-black/40 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
                    <p className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase">
                        Today's overview
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">
                        Welcome back to TheKingsVault
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                        {isClient
                            ? 'Track your bookings, balances, upcoming sessions, and released photos in your private Kings Media portal.'
                            : 'Manage bookings, client galleries, payments, and photo delivery from one database-backed studio dashboard.'}
                    </p>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {visibleStats.map((stat) => {
                        const Icon = stat.icon;
                        const value =
                            stat.key === 'monthlyRevenue' || stat.key === 'pendingBalance'
                                ? money(Number(stats[stat.key] ?? 0))
                                : String(stats[stat.key] ?? 0);

                        return (
                            <Card key={stat.key} className="border-white/10 bg-white/5 text-white shadow-[0_20px_70px_rgba(0,0,0,0.24)]">
                                <CardHeader className="flex-row items-start justify-between gap-4">
                                    <div>
                                        <CardDescription className="text-white/45">{stat.label}</CardDescription>
                                        <CardTitle className="mt-3 text-3xl text-white">{value}</CardTitle>
                                    </div>
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37]">
                                        <Icon className="size-5" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-white/45">{stat.detail}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                    <Card className="border-white/10 bg-white/5 text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Upcoming Sessions</CardTitle>
                            <CardDescription className="text-white/45">Pending and approved sessions on the calendar.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        <TableHead className="text-white/45">Client</TableHead>
                                        <TableHead className="text-white/45">Event</TableHead>
                                        <TableHead className="text-white/45">Date</TableHead>
                                        <TableHead className="text-white/45">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {upcomingSessions.map((session) => (
                                        <TableRow key={session.id} className="border-white/10 hover:bg-white/5">
                                            <TableCell className="font-medium text-white">{session.client}</TableCell>
                                            <TableCell className="text-white/60">{session.event}</TableCell>
                                            <TableCell className="text-white/60">{session.date} at {session.time}</TableCell>
                                            <TableCell>
                                                <Badge variant={session.status === 'Approved' ? 'success' : 'warning'}>
                                                    {session.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {upcomingSessions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-8 text-center text-white/45">
                                                No upcoming sessions.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Quick Actions</CardTitle>
                            <CardDescription className="text-white/45">Common studio tasks.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            {visibleActions.map((action) => (
                                <Button key={action.label} asChild className="h-12 justify-start rounded-2xl bg-white/10 text-white hover:bg-[#D4AF37] hover:text-black">
                                    {action.external ? (
                                        <a href={action.href}>
                                            <action.icon className="size-4" />
                                            {action.label}
                                        </a>
                                    ) : (
                                        <Link href={action.href}>
                                            <action.icon className="size-4" />
                                            {action.label}
                                        </Link>
                                    )}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section className={isClient ? 'grid gap-6' : 'grid gap-6 xl:grid-cols-[1.35fr_0.85fr]'}>
                    {!isClient && (
                        <Card className="border-white/10 bg-white/5 text-white">
                            <CardHeader>
                                <CardTitle className="text-white">Revenue Chart</CardTitle>
                                <CardDescription className="text-white/45">Income trend for confirmed payments.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RevenueChart revenue={revenueChart} />
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-white/10 bg-white/5 text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Booking Status</CardTitle>
                            <CardDescription className="text-white/45">Current booking pipeline.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {bookingStatusChart.map((status) => (
                                <div key={status.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`size-3 rounded-full ${statusColors[status.label] ?? 'bg-white/40'}`} />
                                            <span className="text-white/75">{status.label}</span>
                                        </div>
                                        <span className="text-2xl font-semibold text-white">{status.value}</span>
                                    </div>
                                </div>
                            ))}
                            {bookingStatusChart.length === 0 && (
                                <p className="text-sm text-white/45">No booking status data yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </section>

                <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Activities</CardTitle>
                        <CardDescription className="text-white/45">Latest studio updates and client activity.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-2">
                        {recentActivities.map((activity) => (
                            <div key={`${activity.label}-${activity.createdAt}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                                <CheckCircle2 className="size-5 text-[#D4AF37]" />
                                <span className="text-sm text-white/75">{activity.label}</span>
                                <span className="ml-auto text-xs text-white/35">{activity.createdAt}</span>
                            </div>
                        ))}
                        {recentActivities.length === 0 && (
                            <p className="text-sm text-white/45">No recent activity yet.</p>
                        )}
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
