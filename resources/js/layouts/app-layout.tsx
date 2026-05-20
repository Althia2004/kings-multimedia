import DashboardLayout from './DashboardLayout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            {children}
        </DashboardLayout>
    );
}