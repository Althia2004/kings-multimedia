import { usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import Notifications from '@/components/Notifications/Notifications';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props;
    const title = breadcrumbs.at(-1)?.title ?? 'Dashboard';

    return (
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070707]/95 px-4 py-4 backdrop-blur-xl md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <SidebarTrigger className="size-9 rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white" />
                    <div className="min-w-0">
                        <p className="text-xs tracking-[0.28em] text-white/35 uppercase">
                            Welcome back
                        </p>
                        <h1 className="truncate text-2xl font-semibold text-white">
                            {title === 'Dashboard' ? `Admin` : title}
                        </h1>
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    <div className="relative hidden w-72 lg:block">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/35" />
                        <Input
                            aria-label="Search dashboard"
                            placeholder="Search bookings, clients..."
                            className="h-10 rounded-2xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/35"
                        />
                    </div>
                    <Notifications />
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium text-white">
                            {auth.user.name}
                        </p>
                        <p className="text-xs text-white/40">
                            Photography Admin
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
