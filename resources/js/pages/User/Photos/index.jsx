import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
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

export default function UserPhotosPage({ photos = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState('eventType');

    const sortedPhotos = useMemo(() => {
        return photos
            .filter((photo) => {
                const query = searchQuery.toLowerCase();

                return (
                    photo.name?.toLowerCase().includes(query) ||
                    photo.eventType?.toLowerCase().includes(query)
                );
            })
            .sort((a, b) => String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? '')));
    }, [photos, searchQuery, sortKey]);

    return (
        <div className="space-y-6">
            <Head title="My Photos" />

            <Card className="border-white/10 bg-white/5 text-white">
                <CardHeader>
                    <CardTitle className="text-white">My Photos</CardTitle>
                    <CardDescription>
                        Downloads unlock only after payment is settled and photos are released.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search released files" />
                    <select value={sortKey} onChange={(event) => setSortKey(event.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white">
                        <option value="eventType">Event type</option>
                        <option value="sessionDate">Date</option>
                        <option value="name">File name</option>
                    </select>
                </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 text-white">
                <CardHeader>
                    <CardTitle className="text-white">Photo library</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="max-h-96">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10">
                                    <TableHead>Preview</TableHead>
                                    <TableHead>File</TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Download</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedPhotos.map((photo) => {
                                    const downloadable = photo.status === 'Released' && photo.paymentStatus === 'Paid';

                                    return (
                                        <TableRow key={photo.id} className="border-white/10">
                                            <TableCell>
                                                <img src={photo.preview} alt={photo.name} className="h-16 w-24 rounded-md object-cover" />
                                            </TableCell>
                                            <TableCell>{photo.name}</TableCell>
                                            <TableCell>{photo.eventType}</TableCell>
                                            <TableCell>{photo.sessionDate}</TableCell>
                                            <TableCell>
                                                <Badge variant={photo.status === 'Released' ? 'success' : photo.status === 'Processing' ? 'secondary' : 'warning'}>
                                                    {photo.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {downloadable ? (
                                                    <Button asChild size="sm">
                                                        <a href={photo.downloadUrl}>Download</a>
                                                    </Button>
                                                ) : (
                                                    <span className="text-sm text-amber-200">Payment required before photos are released</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {sortedPhotos.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-8 text-center text-white/45">
                                            No photos available yet.
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
