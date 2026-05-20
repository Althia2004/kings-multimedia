import React, { useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const statusVariant = {
    Paid: 'success',
    Partial: 'warning',
    Unpaid: 'destructive',
};

function money(value) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(value);
}

export default function AdminPaymentManagement({ payments = [] }) {
    const totalRevenue = useMemo(
        () => payments.reduce((sum, payment) => sum + Number(payment.amountPaid), 0),
        [payments],
    );

    const pendingPayments = useMemo(
        () => payments.filter((payment) => payment.status !== 'Paid').length,
        [payments],
    );

    const markPaid = (payment) => {
        router.patch(
            `/payments/${payment.id}`,
            {
                amount_due: payment.amountDue,
                amount_paid: payment.amountDue,
                payment_date: new Date().toISOString().slice(0, 10),
            },
            { preserveScroll: true },
        );
    };

    const recordPartial = (payment) => {
        const nextAmount = Math.min(Number(payment.amountPaid) + 1000, Number(payment.amountDue));

        router.patch(
            `/payments/${payment.id}`,
            {
                amount_due: payment.amountDue,
                amount_paid: nextAmount,
                payment_date: new Date().toISOString().slice(0, 10),
            },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Payment Management" />

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-white/10 bg-white/5 text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Total Revenue</CardTitle>
                            <CardDescription>{money(totalRevenue)}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-white/10 bg-white/5 text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Payment Records</CardTitle>
                            <CardDescription>{payments.length}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-white/10 bg-white/5 text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Pending Payments</CardTitle>
                            <CardDescription>{pendingPayments}</CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Payment records</CardTitle>
                        <CardDescription>Balances are calculated on the server as amount due minus amount paid.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="max-h-130">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead>Client</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Amount Due</TableHead>
                                        <TableHead>Amount Paid</TableHead>
                                        <TableHead>Remaining</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.map((payment) => (
                                        <TableRow key={payment.id} className="border-white/10">
                                            <TableCell>{payment.client}</TableCell>
                                            <TableCell>{payment.eventType}</TableCell>
                                            <TableCell>{money(payment.amountDue)}</TableCell>
                                            <TableCell>{money(payment.amountPaid)}</TableCell>
                                            <TableCell>{money(payment.remaining)}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusVariant[payment.status] ?? 'secondary'}>
                                                    {payment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="flex flex-wrap gap-2">
                                                <Button size="sm" onClick={() => recordPartial(payment)}>
                                                    Record PHP 1,000
                                                </Button>
                                                <Button size="sm" variant="secondary" onClick={() => markPaid(payment)}>
                                                    Mark Paid
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {payments.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-8 text-center text-white/45">
                                                No payment records yet.
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
