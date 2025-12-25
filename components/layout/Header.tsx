'use client';

import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { ThemeCustomizer } from '@/components/theme-customizer';
import { CommandMenu } from '@/components/ui/command-menu';
import { NewTaskDialog } from '@/components/tasks/NewTaskDialog';
import { NewNoteDialog } from '@/components/notes/NewNoteDialog';
import { NotificationsPopover } from '@/components/layout/NotificationsPopover';

export function Header() {
    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
            {/* Mobile Menu Trigger */}
            <MobileSidebar>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                </Button>
            </MobileSidebar>

            {/* OmniSearch Command Menu */}
            <div className="flex-1 max-w-xl hidden md:block px-4">
                <CommandMenu />
            </div>

            {/* Right Actions - With Quick Actions */}
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
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Me Dia</p>
                        <p className="text-xs text-slate-500">Associé Gérant</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold ring-2 ring-slate-100 ring-offset-2 dark:ring-slate-800">
                        MD
                    </div>
                </div>
            </div>
        </header>
    );
}
