import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    CalendarDays,
    CreditCard,
    FileText,
    Folder,
    Image,
    LayoutDashboard,
    ListChecks,
    LogOut,
    Menu,
    Moon,
    Settings,
    Sparkles,
    SunMedium,
    User,
    Users,
    Wallet,
    BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Notifications from '@/components/Notifications/Notifications';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAppearance } from '@/hooks/use-appearance';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';

const adminNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', href: '/bookings', icon: ListChecks },
    { name: 'Calendar', href: '/calendar', icon: CalendarDays },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Employee Management', href: '/employees', icon: Users },
    { name: 'Files', href: '/files', icon: Folder },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
];

const clientNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/my-bookings', icon: CalendarDays },
    { name: 'My Photos', href: '/my-photos', icon: Image },
    { name: 'Payments', href: '/my-payments', icon: Wallet },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Profile', href: '/settings/profile', icon: User },
];

function ScrollArea({ className, children, ...props }) {
    return (
        <div
            data-slot="scroll-area"
            className={cn('min-h-0 overflow-y-auto px-2', className)}
            {...props}
        >
            {children}
        </div>
    );
}

function DashboardLayout({ children, breadcrumbs }) {
    const layoutBreadcrumbs = breadcrumbs ?? [];
    const [menuOpen, setMenuOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = Boolean(
        ['Super Admin', 'Admin', 'admin'].includes(user?.role) ||
            user?.isAdmin ||
            user?.is_admin,
    );
    const navItems = isAdmin ? adminNav : clientNav;
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const { isCurrentOrParentUrl } = useCurrentUrl();

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    const handleLogoutSuccess = () => {
        window.history.replaceState(null, '', '/login');
        window.location.replace('/login');
    };

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await fetch('/auth-check', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    cache: 'no-store',
                });

                if (response.status === 401) {
                    window.location.replace('/login');
                }
            } catch (error) {
                window.location.replace('/login');
            }
        };

        verifyAuth();

        const handlePageShow = (event) => {
            if (event.persisted) {
                verifyAuth();
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                verifyAuth();
            }
        };

        window.addEventListener('pageshow', handlePageShow);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('pageshow', handlePageShow);
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
        };
    }, []);

    useEffect(() => {
        if (!auth?.user) {
            window.location.replace('/login');
        }
    }, [auth?.user]);

    return (
        <div
            className="vault-shell bg-[#f7f5ef] text-neutral-950 dark:bg-[#060606] dark:text-white"
            data-vault-theme={resolvedAppearance}
        >
            <div className="min-h-screen xl:flex">
                <aside className="hidden xl:flex xl:w-80 xl:flex-col xl:border-r xl:border-neutral-200 xl:bg-white/85 xl:px-6 xl:py-8 xl:backdrop-blur-xl dark:border-white/10 dark:bg-black/80">
                    <div className="flex items-center gap-3 rounded-3xl border border-neutral-200 bg-white/70 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
                        <div className="text-gold flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-black/5 via-black/0 to-transparent dark:from-white/10 dark:via-white/5">
                            <Sparkles className="text-gold size-5" />
                        </div>
                        <div>
                            <p className="text-xs tracking-[0.32em] text-muted-foreground uppercase">
                                Kings Media
                            </p>
                            <p className="text-lg font-semibold text-neutral-950 dark:text-white">
                                TheKingsVault
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 space-y-2">
                        <p className="text-sm tracking-[0.24em] text-muted-foreground uppercase">
                            Navigation
                        </p>
                        <ScrollArea className="space-y-1 pb-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isCurrentOrParentUrl(item.href);

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                                            active
                                                ? 'bg-black/5 text-neutral-950 shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:bg-white/10 dark:text-white dark:shadow-[0_10px_30px_rgba(255,255,255,0.08)]'
                                                : 'text-muted-foreground hover:bg-black/5 hover:text-neutral-950 dark:hover:bg-white/5 dark:hover:text-white',
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                'size-5 transition-colors',
                                                active
                                                    ? 'text-gold'
                                                    : 'group-hover:text-gold text-muted-foreground',
                                            )}
                                        />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </ScrollArea>
                    </div>

                    <div className="mt-auto rounded-3xl border border-neutral-200 bg-white/70 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_90px_rgba(0,0,0,0.16)]">
                        <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
                            Studio Pulse
                        </p>
                        <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-white/90">
                            Fast access to your bookings, invoices, and client
                            uploads.
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <Avatar className="h-11 w-11 rounded-full border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5">
                                {user?.avatar ? (
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.name ?? 'Profile'}
                                    />
                                ) : (
                                    <AvatarFallback>
                                        {(user?.name || 'G').charAt(0)}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-neutral-950 dark:text-white">
                                    {user?.name ?? 'Guest User'}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {user?.email ?? 'dashboard@kingsvault.com'}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex-1">
                    <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-white/10 dark:bg-black/90">
                        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <Sheet
                                    open={menuOpen}
                                    onOpenChange={setMenuOpen}
                                >
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-2xl border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100 xl:hidden dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                                        >
                                            <Menu className="size-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="left"
                                        className="w-[18rem] bg-white text-neutral-950 dark:bg-[#090909] dark:text-white"
                                    >
                                        <SheetHeader>
                                            <SheetTitle>Menu</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-4 space-y-2">
                                            {navItems.map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-neutral-800 transition hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/5"
                                                    >
                                                        <Icon className="text-gold size-5" />
                                                        {item.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                <div>
                                    <p className="text-xs tracking-[0.32em] text-muted-foreground uppercase">
                                        Welcome back
                                    </p>
                                    <h1 className="text-2xl font-semibold text-neutral-950 dark:text-white">
                                        {layoutBreadcrumbs.length
                                            ? layoutBreadcrumbs[
                                                  layoutBreadcrumbs.length - 1
                                              ]?.label ??
                                              layoutBreadcrumbs[
                                                  layoutBreadcrumbs.length - 1
                                              ]?.title
                                            : 'Dashboard'}
                                    </h1>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={toggleTheme}
                                    className="rounded-2xl border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                                >
                                    {resolvedAppearance === 'dark' ? (
                                        <SunMedium className="size-5" />
                                    ) : (
                                        <Moon className="size-5" />
                                    )}
                                </Button>

                                <Notifications />

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-neutral-800 hover:bg-neutral-100 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 rounded-full border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5">
                                                    {user?.avatar ? (
                                                        <AvatarImage
                                                            src={user.avatar}
                                                            alt={
                                                                user.name ??
                                                                'Profile'
                                                            }
                                                        />
                                                    ) : (
                                                        <AvatarFallback>
                                                            {(
                                                                user?.name ||
                                                                'G'
                                                            ).charAt(0)}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <div className="hidden min-w-0 flex-col truncate sm:flex">
                                                    <span className="truncate text-sm font-medium text-neutral-950 dark:text-white">
                                                        {user?.name ?? 'Guest'}
                                                    </span>
                                                    <span className="truncate text-xs text-muted-foreground">
                                                        {isAdmin
                                                            ? 'Administrator'
                                                            : 'Client'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="w-56 border border-neutral-200 bg-white text-neutral-950 dark:border-white/10 dark:bg-[#090909] dark:text-white">
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings/profile">
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings">
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                preserveState={false}
                                                preserveScroll={false}
                                                onSuccess={handleLogoutSuccess}
                                                className="flex w-full items-center gap-2 text-red-400"
                                            >
                                                <LogOut className="size-4" />
                                                Sign out
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>

                    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {layoutBreadcrumbs.length > 0 && (
                            <div className="mb-6 rounded-3xl border border-neutral-200 bg-white/70 p-4 text-sm text-muted-foreground shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        {layoutBreadcrumbs.map((item, index) => {
                                            const isLast =
                                                index ===
                                                layoutBreadcrumbs.length - 1;
                                            return (
                                                <BreadcrumbItem
                                                    key={`${item.href}-${index}`}
                                                >
                                                    {isLast ? (
                                                        <BreadcrumbPage>
                                                            {item.label ??
                                                                item.title}
                                                        </BreadcrumbPage>
                                                    ) : (
                                                        <BreadcrumbLink asChild>
                                                            <Link
                                                                href={item.href}
                                                            >
                                                                {item.label ??
                                                                    item.title}
                                                            </Link>
                                                        </BreadcrumbLink>
                                                    )}
                                                    {!isLast && (
                                                        <BreadcrumbSeparator />
                                                    )}
                                                </BreadcrumbItem>
                                            );
                                        })}
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                        )}

                        <div className="space-y-6">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;
