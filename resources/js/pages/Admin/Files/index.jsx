import React, { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { UploadCloud } from 'lucide-react';
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

const statusVariant = {
    Pending: 'warning',
    Processing: 'secondary',
    Released: 'success',
};

export default function AdminFileManagement({ files = [], bookings = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState('client');
    const { data, setData, post, processing, errors, reset } = useForm({
        booking_id: bookings[0]?.id ?? '',
        photos: [],
    });

    const sortedFiles = useMemo(() => {
        return [...files].sort((a, b) => {
            if (sortKey === 'date') {
                return String(a.sessionDate).localeCompare(String(b.sessionDate));
            }

            return String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''));
        });
    }, [files, sortKey]);

    const filteredFiles = useMemo(() => {
        return sortedFiles.filter((file) => {
            const query = searchQuery.toLowerCase();

            return (
                file.name?.toLowerCase().includes(query) ||
                file.client?.toLowerCase().includes(query) ||
                file.eventType?.toLowerCase().includes(query)
            );
        });
    }, [searchQuery, sortedFiles]);

    const submitUpload = (event) => {
        event.preventDefault();
        post('/photos', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => reset('photos'),
        });
    };

    return (
        <>
            <Head title="File Management" />

            <div className="space-y-6">
                <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <UploadCloud className="size-5 text-[#D4AF37]" />
                            Upload Photos
                        </CardTitle>
                        <CardDescription>
                            Files are renamed and stored by ClientName + SessionDate + EventType. Duplicate filenames are blocked server-side.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitUpload} className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                            <select
                                value={data.booking_id}
                                onChange={(event) => setData('booking_id', event.target.value)}
                                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                            >
                                {bookings.map((booking) => (
                                    <option key={booking.id} value={booking.id}>
                                        {booking.label} ({booking.paymentStatus})
                                    </option>
                                ))}
                            </select>
                            <Input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(event) => setData('photos', Array.from(event.target.files ?? []))}
                            />
                            <Button disabled={processing} className="bg-[#D4AF37] text-black hover:bg-[#f1ce62]">
                                Upload
                            </Button>
                        </form>
                        {errors.photos && <p className="mt-3 text-sm text-red-300">{errors.photos}</p>}
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="text-white">File Management</CardTitle>
                        <CardDescription>Search, sort, release, and audit uploaded photos.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search files, clients, or events" />
                        <select value={sortKey} onChange={(event) => setSortKey(event.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white md:col-span-2">
                            <option value="client">Client</option>
                            <option value="date">Date</option>
                            <option value="eventType">Event Type</option>
                        </select>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="text-white">File library</CardTitle>
                        <CardDescription>Photos cannot be released until payment is fully paid.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="max-h-130">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead>File</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Session Date</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredFiles.map((file) => (
                                        <TableRow key={file.id} className="border-white/10">
                                            <TableCell>{file.name}</TableCell>
                                            <TableCell>{file.client}</TableCell>
                                            <TableCell>{file.sessionDate}</TableCell>
                                            <TableCell>{file.eventType}</TableCell>
                                            <TableCell>{file.paymentStatus}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusVariant[file.status] ?? 'secondary'}>{file.status}</Badge>
                                            </TableCell>
                                            <TableCell className="flex flex-wrap gap-2">
                                                <Button asChild size="sm" variant="secondary">
                                                    <a href={file.preview} target="_blank" rel="noreferrer">Preview</a>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    disabled={file.paymentStatus !== 'Paid'}
                                                    onClick={() => router.patch(`/photos/${file.id}/release`, {}, { preserveScroll: true })}
                                                >
                                                    Release
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredFiles.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-8 text-center text-white/45">
                                                No files uploaded yet.
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
