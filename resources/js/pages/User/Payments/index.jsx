import React, { useEffect, useMemo, useState } from 'react';
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

const paymentMethods = ['GCash', 'Maya', 'Credit Card', 'Bank Transfer'];

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

function generateReference() {
    const suffix = Math.random().toString(36).slice(2, 10).toUpperCase();

    return `PAY-${suffix}`;
}

function formatTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function DemoQrCode({ reference }) {
    const cells = Array.from({ length: 49 }, (_, index) => {
        const char = reference.charCodeAt(index % reference.length);
        return (char + index) % 3 !== 0;
    });

    return (
        <div className="grid size-40 grid-cols-7 gap-1 rounded-2xl bg-white p-3">
            {cells.map((filled, index) => (
                <span
                    key={index}
                    className={filled ? 'rounded-sm bg-black' : 'rounded-sm bg-white'}
                />
            ))}
        </div>
    );
}

export default function UserPaymentOverview({ payments = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('GCash');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(900);
    const [isCompleting, setIsCompleting] = useState(false);

    const filteredPayments = useMemo(
        () =>
            payments.filter(
                (payment) =>
                    payment.eventType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    payment.status?.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        [payments, searchQuery],
    );

    const latest = filteredPayments[0];

    useEffect(() => {
        if (!selectedPayment) return;

        const timer = window.setInterval(() => {
            setSecondsLeft((current) => Math.max(current - 1, 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [selectedPayment]);

    const openPaymentModal = (payment) => {
        setSelectedPayment(payment);
        setPaymentMethod('GCash');
        setReferenceNumber(generateReference());
        setSecondsLeft(900);
    };

    const closePaymentModal = () => {
        setIsCompleting(false);
        setSelectedPayment(null);
    };

    const simulateSuccess = () => {
        if (!selectedPayment || isCompleting) return;

        setIsCompleting(true);

        window.setTimeout(() => {
            router.post(
                `/payments/${selectedPayment.id}/simulate`,
                {
                    reference_number: referenceNumber,
                    payment_method: paymentMethod,
                },
                {
                    preserveScroll: true,
                    onFinish: () => setIsCompleting(false),
                    onSuccess: closePaymentModal,
                },
            );
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <Head title="Payments" />

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Payment status</CardTitle>
                        <CardDescription>{latest?.status ?? 'No active payment'}</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Amount due</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-semibold text-white">{money(latest?.amountDue ?? 0)}</p>
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Remaining balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-semibold text-white">{money(latest?.remaining ?? 0)}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-white/10 bg-white/5 text-white">
                <CardHeader>
                    <CardTitle className="text-white">Payment history</CardTitle>
                    <CardDescription>Use the demo payment flow to settle remaining balances.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search by event or status" />
                    <ScrollArea className="max-h-96">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10">
                                    <TableHead>Event</TableHead>
                                    <TableHead>Amount Due</TableHead>
                                    <TableHead>Amount Paid</TableHead>
                                    <TableHead>Remaining</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment Date</TableHead>
                                    <TableHead>Reference Number</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayments.map((payment) => (
                                    <TableRow key={payment.id} className="border-white/10">
                                        <TableCell>{payment.eventType}</TableCell>
                                        <TableCell>{money(payment.amountDue)}</TableCell>
                                        <TableCell>{money(payment.amountPaid)}</TableCell>
                                        <TableCell>{money(payment.remaining)}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[payment.status] ?? 'secondary'}>{payment.status}</Badge>
                                        </TableCell>
                                        <TableCell>{payment.paymentDate ?? 'Not paid'}</TableCell>
                                        <TableCell className="font-mono text-xs text-white/60">
                                            {payment.latestTransaction?.referenceNumber ?? 'No reference'}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                disabled={payment.status === 'Paid' || Number(payment.remaining) <= 0}
                                                onClick={() => openPaymentModal(payment)}
                                                className="bg-[#D4AF37] text-black hover:bg-[#f1ce62]"
                                            >
                                                Pay Now
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredPayments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-8 text-center text-white/45">
                                            No payment records yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Dialog open={Boolean(selectedPayment)} onOpenChange={(open) => !open && closePaymentModal()}>
                <DialogContent className="border-white/10 bg-[#090909] text-white sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Demo Payment</DialogTitle>
                        <DialogDescription>
                            This is a simulated Kings Media payment. No real payment gateway is connected.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPayment && (
                        <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
                            <DemoQrCode reference={referenceNumber} />
                            <div className="space-y-4">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-sm text-white/45">Amount</p>
                                    <p className="text-2xl font-semibold text-white">{money(selectedPayment.remaining)}</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-sm text-white/45">Booking Event</p>
                                    <p className="text-lg font-semibold text-white">{selectedPayment.eventType}</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-sm text-white/45">Reference Number</p>
                                    <p className="font-mono text-sm text-[#D4AF37]">{referenceNumber}</p>
                                </div>
                                <label className="block space-y-2">
                                    <span className="text-sm text-white/45">Payment Method</span>
                                    <select
                                        value={paymentMethod}
                                        onChange={(event) => setPaymentMethod(event.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                                    >
                                        {paymentMethods.map((method) => (
                                            <option key={method} value={method}>
                                                {method}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-sm text-white/45">Expires in</p>
                                    <p className="font-mono text-xl text-white">{formatTimer(secondsLeft)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={closePaymentModal} disabled={isCompleting}>
                            Cancel
                        </Button>
                        <Button
                            disabled={secondsLeft === 0 || isCompleting}
                            onClick={simulateSuccess}
                            className="bg-[#D4AF37] text-black hover:bg-[#f1ce62]"
                        >
                            {isCompleting ? 'Completing Payment...' : 'Complete Payment'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
