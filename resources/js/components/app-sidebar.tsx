import { Link } from '@inertiajs/react';
import {
    BarChart3,
    Bell,
    CalendarDays,
    CreditCard,
    Folder,
    Image,
    LayoutGrid,
    ListChecks,
    Settings,
    Users,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Bookings',
        href: '/bookings',
        icon: ListChecks,
    },
    {
        title: 'Calendar',
        href: '/calendar',
        icon: CalendarDays,
    },
    {
        title: 'Clients',
        href: '/clients',
        icon: Users,
    },
    {
        title: 'Employee Management',
        href: '/employees',
        icon: Users,
    },
    {
        title: 'Files',
        href: '/files',
        icon: Folder,
    },
    {
        title: 'Payments',
        href: '/payments',
        icon: CreditCard,
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
    },
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-white/10 bg-[#070707] text-white"
        >
            <SidebarHeader className="border-b border-white/10 p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-white hover:bg-white/10 hover:text-white data-[active=true]:bg-white/10"
                        >
                            <Link href="/dashboard" prefetch>
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37]">
                                    <Image className="size-5" />
                                </div>
                                <div className="grid min-w-0 flex-1">
                                    <span className="truncate text-xs font-semibold tracking-[0.26em] text-[#D4AF37] uppercase">
                                        Kings Media
                                    </span>
                                    <span className="truncate text-base font-semibold text-white">
                                        TheKingsVault
                                    </span>
                                    <span className="truncate text-xs text-white/45">
                                        Photography Management System
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[#070707] px-2 py-4">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 bg-[#070707] p-3">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
