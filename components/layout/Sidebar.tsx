'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Calendar,
    Receipt,
    BadgePercent,
    Files,
    Settings,
    LogOut,
    Scale,
    Landmark,
    Gavel,
    BookOpen,
    ShieldAlert,
    MessageCircle,
    Calculator,
    Globe,
    BarChart3,
    BrainCircuit,
    Archive,
    Rocket,
    Contact2 as Contact,
    GraduationCap,
    FileInput as FileMsg // Using FileInput as a distinctive file icon for Templates
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Stopwatch } from '@/components/tools/Stopwatch';

const navigation = [
    { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
    { name: 'Dossiers', href: '/dossiers', icon: Briefcase },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Agenda', href: '/agenda', icon: Calendar },
    { name: 'Palais & Audiences', href: '/audiences', icon: Landmark },
    { name: 'Facturation', href: '/factures', icon: Receipt },
    { name: 'Recouvrement Massif', href: '/recouvrement', icon: BadgePercent },
    { name: 'Comptabilité', href: '/comptabilite', icon: Calculator }, // Reordered for better flow
    { name: 'GED / Documents', href: '/documents', icon: Files }, // Renamed from Outils/Files implies GED usually, but explicit is better
    { name: 'Recherche Juridique', href: '/recherche', icon: Gavel }, // Consolidating legal resources
    { name: 'Archives', href: '/archives', icon: Archive }, // Added as requested
    { name: 'Assistant IA', href: '/analyse', icon: BrainCircuit },
    { name: 'Annuaire Pro', href: '/annuaire', icon: Contact },
    { name: 'International', href: '/international', icon: Globe },
    { name: 'Rapports & Bilan', href: '/rapports', icon: BarChart3 }, // Renamed to be explicit about Bilan
    { name: 'Outils & Codes', href: '/outils', icon: BookOpen },
    { name: 'Modèles (Bible)', href: '/modeles', icon: FileMsg },
    { name: 'CRM & Développement', href: '/crm', icon: Rocket },
    { name: 'Conflits d\'Intérêts', href: '/conflits', icon: ShieldAlert },
    { name: 'Communication', href: '/communication', icon: MessageCircle },
    { name: 'RH & Talents', href: '/rh', icon: GraduationCap },
    { name: 'Administration', href: '/admin', icon: Settings },
];



export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <div className={cn("hidden md:flex h-screen flex-col justify-between border-r border-slate-800 bg-black text-white w-64 fixed left-0 top-0 z-50 shadow-sm transition-colors", className)}>
            <div className="flex flex-col h-full">
                {/* Logo Area */}
                <div className="h-20 flex flex-col justify-center px-6 border-b border-slate-800 bg-black">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-wide text-white mb-1">
                        <Scale className="h-6 w-6 text-amber-500" />
                        <span>LEX<span className="text-amber-500">PREMIUM</span></span>
                    </Link>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">SCP d'Avocats Dia et Associés</p>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-900 [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-500">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                                    isActive
                                        ? "bg-slate-800 text-white shadow-md relative overflow-hidden"
                                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 h-full w-1 bg-amber-500" />
                                )}
                                <item.icon className={cn("h-5 w-5", isActive ? "text-amber-500" : "text-slate-500 group-hover:text-slate-300")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>



                {/* Footer / Stopwatch */}
                <div className="p-4 border-t border-slate-800 bg-slate-950">
                    <Stopwatch />
                </div>
            </div>
        </div>
    );
}
