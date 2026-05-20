import React from 'react';
import { Head } from '@inertiajs/react';
import { Mail, MapPin, Phone, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function Clients({ clients = [] }) {
    return (
        <>
            <Head title="Clients" />

            <Card className="border-white/10 bg-white/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Users className="size-5 text-[#D4AF37]" />
                        Clients
                    </CardTitle>
                    <CardDescription>Client contacts, session history, and delivery status from the database.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 lg:grid-cols-3">
                        {clients.map((client) => (
                            <div key={client.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-white">{client.name}</p>
                                        <p className="text-sm text-muted-foreground">{client.bookings} bookings</p>
                                    </div>
                                    <Badge variant={client.deliveryStatus === 'Released' ? 'success' : 'warning'}>
                                        {client.deliveryStatus}
                                    </Badge>
                                </div>
                                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                    <p className="flex items-center gap-2">
                                        <Mail className="size-4" />
                                        {client.email}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Phone className="size-4" />
                                        {client.phone ?? 'No contact number'}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <MapPin className="size-4" />
                                        {client.address ?? 'No address'}
                                    </p>
                                </div>
                                {client.notes && (
                                    <p className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/60">
                                        {client.notes}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                    {clients.length === 0 && (
                        <p className="py-8 text-center text-sm text-white/45">
                            No clients found.
                        </p>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
