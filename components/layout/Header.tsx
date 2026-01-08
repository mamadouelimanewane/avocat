'use client';

import { Bell, Menu, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { ThemeCustomizer } from '@/components/theme-customizer';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { NewTaskDialog } from '@/components/tasks/NewTaskDialog';
import { NewNoteDialog } from '@/components/notes/NewNoteDialog';
import { NotificationsPopover } from '@/components/layout/NotificationsPopover';
import { logout } from '@/app/actions';

// Composants pour l'avatar avec statut online
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
    user?: any;
}

export function Header({ user }: HeaderProps) {
    const userName = user?.name || "Invité";
    const userRole = user?.userRole?.name || user?.role || "Visiteur";
    const initials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
            {/* Mobile Menu Trigger */}
            <MobileSidebar>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                </Button>
            </MobileSidebar>

            {/* OmniSearch Global Search */}
            <div className="flex-1 max-w-xl hidden md:block px-4">
                <GlobalSearchModal />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                <ThemeCustomizer />

                {/* Quick Create Menu */}
                <div className="hidden md:flex items-center gap-2 mr-2">
                    <NewTaskDialog>
                        <Button variant="outline" className="text-sm h-10 gap-2 border-slate-300 dark:border-slate-700 px-4 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                            <span className="text-xl leading-none text-amber-600">+</span> Tâche
                        </Button>
                    </NewTaskDialog>
                    <NewNoteDialog>
                        <Button variant="outline" className="text-sm h-10 gap-2 border-slate-300 dark:border-slate-700 px-4 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                            <span className="text-xl leading-none text-amber-600">+</span> Note
                        </Button>
                    </NewNoteDialog>
                </div>

                {/* Notifications */}
                <NotificationsPopover />

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userName}</p>
                        <p className="text-xs text-slate-500">{userRole}</p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="relative inline-block focus:outline-none group">
                                <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-800 transition-transform group-hover:scale-105">
                                    <AvatarImage src="" alt={userName} />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-950 bg-green-500" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" asChild>
                                <a href="/profil" className="flex items-center w-full">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profil</span>
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Paramètres</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 cursor-pointer"
                                onClick={() => logout()}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Se déconnecter</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}