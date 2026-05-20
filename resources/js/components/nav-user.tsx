import { Link, usePage } from '@inertiajs/react';
import { LogOut, Settings, User } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function NavUser() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const handleLogoutSuccess = () => {
        window.history.replaceState(null, '', '/login');
        window.location.replace('/login');
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                        >
                            <Avatar className="h-9 w-9 border border-white/10">
                                {user?.avatar ? (
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                ) : (
                                    <AvatarFallback>
                                        {(user?.name || 'U')
                                            .charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            <div className="ml-3 flex flex-col text-left">
                                <span className="text-sm font-medium">
                                    {user?.name || 'Guest User'}
                                </span>

                                <span className="text-xs text-white/50">
                                    {user?.email || 'user@email.com'}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-56 rounded-xl border border-white/10 bg-[#090909] text-white"
                        align="end"
                    >
                        <DropdownMenuItem asChild>
                            <Link
                                href="/settings/profile"
                                className="flex items-center gap-2"
                            >
                                <User size={16} />
                                Profile
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link
                                href="/settings"
                                className="flex items-center gap-2"
                            >
                                <Settings size={16} />
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
                                <LogOut size={16} />
                                Sign Out
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
