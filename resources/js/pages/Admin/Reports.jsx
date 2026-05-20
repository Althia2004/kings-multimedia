import React, { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    BarChart3,
    CalendarDays,
    Download,
    FileSpreadsheet,
    FileText,
    Package,
    TrendingUp,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const rangeLabels = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
};

function currency(value) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

function SimpleBarChart({ data, valuePrefix = '', valueFormatter }) {
    const maxValue = Math.max(...data.map((item) => Number(item.value)), 1);

    return (
        <div className="space-y-4">
            {data.map((item) => {
                const numericValue = Number(item.value);
                const width = `${Math.max((numericValue / maxValue) * 100, 8)}%`;
                const displayValue = valueFormatter
                    ? valueFormatter(numericValue)
                    : `${valuePrefix}${numericValue.toLocaleString()}`;

                return (
                    <div key={item.label} className="grid gap-2">
                        <div className="flex items-center justify-between gap-4 text-sm">
                            <span className="font-medium text-white/90">
                                {item.label}
                            </span>
                            <span className="text-muted-foreground">
                                {displayValue}
                            </span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-white/10">
                            <div
                                className="bg-gold h-full rounded-full"
                                style={{ width }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function PopularPackageChart({ data }) {
    const rows =
        data.length > 0
            ? data
            : [{ label: 'No bookings yet', value: 0, percentage: 0 }];
    const maxValue = Math.max(...rows.map((item) => Number(item.value)), 1);

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {rows.map((item) => (
                <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-white">
                                {item.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {Number(item.percentage || 0)}% of bookings
                            </p>
                        </div>
                        <Badge variant="secondary">{item.value}</Badge>
                    </div>
                    <div className="mt-4 h-24 rounded-xl bg-white/5 p-3">
                        <div className="flex h-full items-end">
                            <div
                                className="from-gold w-full rounded-t-xl bg-linear-to-t to-amber-200"
                                style={{
                                    height: `${Math.max((Number(item.value) / maxValue) * 100, 18)}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ReportTable({ rows }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
            <div className="min-w-[760px]">
                <div className="grid grid-cols-5 gap-3 bg-white/10 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    <span>Client</span>
                    <span>Bookings</span>
                    <span>Revenue</span>
                    <span>Popular Package</span>
                    <span>Status</span>
                </div>
                {rows.map((row) => (
                    <div
                        key={row.client}
                        className="grid grid-cols-5 gap-3 border-t border-white/10 px-4 py-4 text-sm"
                    >
                        <span className="font-medium text-white">
                            {row.client}
                        </span>
                        <span className="text-muted-foreground">
                            {row.bookings}
                        </span>
                        <span className="text-muted-foreground">
                            {currency(row.revenue)}
                        </span>
                        <span className="text-muted-foreground">
                            {row.favoritePackage}
                        </span>
                        <span>
                            <Badge
                                variant={
                                    row.status === 'Active'
                                        ? 'secondary'
                                        : 'outline'
                                }
                            >
                                {row.status}
                            </Badge>
                        </span>
                    </div>
                ))}
                {rows.length === 0 && (
                    <div className="border-t border-white/10 px-4 py-8 text-center text-sm text-white/45">
                        No clients found for this range.
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Reports({
    range: initialRange = 'monthly',
    reports = {},
    monthlyIncome = [],
    bookingsPerMonth = [],
    popularPackages = [],
    clientRows = [],
}) {
    const [range, setRange] = useState(initialRange);
    const reportLabel = rangeLabels[range] ?? 'Monthly';

    const metrics = useMemo(
        () => ({
            revenue: Number(reports.revenue || 0),
            bookings: Number(reports.bookings || 0),
            clients: Number(reports.clients || 0),
            topPackage: reports.popularPackage || 'No bookings yet',
        }),
        [reports],
    );

    const updateRange = (value) => {
        setRange(value);
        router.get('/reports', { range: value }, { preserveState: false });
    };

    const exportExcel = () => {
        window.location.href = `/reports/export/excel?range=${encodeURIComponent(range)}`;
    };

    const exportPdf = () => {
        window.location.href = `/reports/export/pdf?range=${encodeURIComponent(range)}`;
    };

    return (
        <>
            <Head title="Reports" />

            <div className="space-y-6 print:bg-white print:text-black">
                <Card className="border-white/10 bg-linear-to-br from-white/10 via-white/5 to-black/30">
                    <CardHeader className="gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-2xl text-white">
                                <BarChart3 className="text-gold size-6" />
                                Reports
                            </CardTitle>
                            <CardDescription>
                                Booking, revenue, and client performance reports
                                for Kings Media.
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 print:hidden">
                            <Select value={range} onValueChange={updateRange}>
                                <SelectTrigger className="w-36 border-white/10 bg-white/5 text-white">
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">
                                        Weekly
                                    </SelectItem>
                                    <SelectItem value="monthly">
                                        Monthly
                                    </SelectItem>
                                    <SelectItem value="yearly">
                                        Yearly
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={exportPdf}>
                                <FileText className="size-4" />
                                PDF
                            </Button>
                            <Button onClick={exportExcel}>
                                <FileSpreadsheet className="size-4" />
                                Excel
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-white/10 bg-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <TrendingUp className="text-gold size-5" />
                                Revenue Report
                            </CardTitle>
                            <CardDescription>
                                {currency(metrics.revenue)}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-white/10 bg-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <CalendarDays className="text-gold size-5" />
                                Booking Report
                            </CardTitle>
                            <CardDescription>
                                {metrics.bookings} bookings
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-white/10 bg-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Users className="text-gold size-5" />
                                Client Report
                            </CardTitle>
                            <CardDescription>
                                {metrics.clients} tracked clients
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-white/10 bg-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Package className="text-gold size-5" />
                                Popular Package
                            </CardTitle>
                            <CardDescription>
                                {metrics.topPackage}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card className="border-white/10 bg-white/5">
                        <CardHeader>
                            <CardTitle className="text-white">
                                Monthly income
                            </CardTitle>
                            <CardDescription>
                                Filtered by {reportLabel.toLowerCase()}{' '}
                                performance.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SimpleBarChart
                                data={monthlyIncome}
                                valueFormatter={currency}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5">
                        <CardHeader>
                            <CardTitle className="text-white">
                                Bookings per month
                            </CardTitle>
                            <CardDescription>
                                Total confirmed and pending booking volume.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SimpleBarChart data={bookingsPerMonth} />
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-white/10 bg-white/5">
                    <CardHeader>
                        <CardTitle className="text-white">
                            Popular package
                        </CardTitle>
                        <CardDescription>
                            Package demand across the selected reporting range.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PopularPackageChart data={popularPackages} />
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5">
                    <CardHeader className="gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <CardTitle className="text-white">
                                Client report
                            </CardTitle>
                            <CardDescription>
                                Client booking counts, revenue, and package
                                preference.
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            onClick={exportExcel}
                            className="w-full lg:w-auto print:hidden"
                        >
                            <Download className="size-4" />
                            Export client report
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ReportTable rows={clientRows} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
