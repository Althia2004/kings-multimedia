import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

const ClientDashboard = () => {
    return (
        <div className="space-y-6">
            {/* Top Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Session</CardTitle>
                        <CardDescription>May 25, 2026</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Status</CardTitle>
                        <CardDescription>
                            <Badge variant="success">Paid</Badge>
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Delivered Photos</CardTitle>
                        <CardDescription>15/20</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>3 New</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="bookings">
                <TabsList>
                    <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                    <TabsTrigger value="photos">My Photos</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="notifications">
                        Notifications
                    </TabsTrigger>
                </TabsList>

                {/* My Bookings */}
                <TabsContent value="bookings">
                    <ScrollArea className="h-64">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Session Date</TableHead>
                                    <TableHead>Package Type</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>May 25, 2026</TableCell>
                                    <TableCell>Gold</TableCell>
                                    <TableCell>
                                        <Badge variant="warning">Pending</Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>June 10, 2026</TableCell>
                                    <TableCell>Silver</TableCell>
                                    <TableCell>
                                        <Badge variant="success">
                                            Completed
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </TabsContent>

                {/* My Photos */}
                <TabsContent value="photos">
                    <ScrollArea className="h-64">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Photo</TableHead>
                                    <TableHead>Download</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Avatar
                                            src="/images/photo1.jpg"
                                            alt="Photo 1"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <button className="btn btn-primary">
                                            Download
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="success">
                                            Delivered
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <Avatar
                                            src="/images/photo2.jpg"
                                            alt="Photo 2"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <button className="btn btn-primary">
                                            Download
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="warning">
                                            Processing
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </TabsContent>

                {/* Payments */}
                <TabsContent value="payments">
                    <ScrollArea className="h-64">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Amount Due</TableHead>
                                    <TableHead>Amount Paid</TableHead>
                                    <TableHead>Remaining Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>$500</TableCell>
                                    <TableCell>$300</TableCell>
                                    <TableCell>$200</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications">
                    <ScrollArea className="h-64">
                        <ul className="space-y-2">
                            <li>Your photos are ready</li>
                            <li>Payment due in 3 days</li>
                            <li>New session added</li>
                        </ul>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ClientDashboard;
