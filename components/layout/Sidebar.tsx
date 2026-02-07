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
    Activity,
    Archive,
    Rocket,
    Contact2 as Contact,
    GraduationCap,
    FileSearch,
    Mail,
    PenTool,
    TrendingUp,
    Sparkles,
    FileSignature,
    FileInput as FileMsg,
    ShieldCheck,
    Bot,
    Clock,
    LayoutGrid,
    Workflow,
    FolderOpen,
    Mic,
    CircuitBoard,
    BadgeCheck,
    Bookmark,
    Rss,
    Target,
    Network,
    ClipboardCheck,
    Euro,
    Database,
    UploadCloud,
    Radar,
    Swords,
    Brain,
    Lock,
    Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Stopwatch } from '@/components/tools/Stopwatch';
import { logout } from '@/app/actions';

export function Sidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
    const pathname = usePathname();

    const navigationGroups = [
        {
            title: "PILOTAGE",
            items: [
                { name: 'Tableau de Bord', href: '/', icon: LayoutDashboard },
                { name: 'Legal Ops (Pilotage)', href: '/dashboard/legal-ops', icon: Workflow },
                { name: 'Sentinelle (Live News)', href: '/lexis-veille', icon: Rss },
                { name: 'Statistiques Associés', href: '/admin/statistiques', icon: BarChart3 },
            ]
        },
        {
            title: "EXPERTISE AVOCAT",
            items: [
                { name: 'Dossiers', href: '/dossiers', icon: Briefcase },
                { name: 'Agenda & Audiences', href: '/agenda', icon: Calendar },
                { name: 'Palais (Live)', href: '/audiences', icon: Landmark },
                { name: 'Bibliothèque Suprême', href: '/bibliotheque', icon: FileMsg },
                { name: 'Recherche OHADA', href: '/recherche', icon: Gavel },
            ]
        },
        {
            title: "GESTION CABINET",
            items: [
                { name: 'Clients (CRM 360°)', href: '/clients', icon: Users },
                { name: 'Courrier Dynamique', href: '/courrier', icon: Mail },
                { name: 'Facturation & Honoraires', href: '/factures', icon: Receipt },
                { name: 'Diligences (Temps)', href: '/dashboard/temps', icon: Clock },
                { name: 'Asset Hunter (OSINT)', href: '/asset-hunter', icon: Radar },
                { name: 'Recouvrement Massif', href: '/recouvrement', icon: BadgePercent },
            ]
        },
        {
            title: "AUDIT & CONFORMITÉ",
            items: [
                { name: 'SafeNexus (KYC/CARPA)', href: '/dashboard/compliance', icon: ShieldCheck },
                { name: 'LexRedTeam (Attaque IA)', href: '/red-team', icon: Swords },
                { name: 'LexCheck (Rédaction)', href: '/lex-check', icon: BadgeCheck },
                { name: 'Conflits d\'Intérêts', href: '/conflits', icon: ShieldAlert },
                { name: 'Parapheur Numérique', href: '/parapheur', icon: PenTool },
            ]
        },
        {
            title: "CONSEIL & STRATÉGIE",
            items: [
                { name: 'LexPredict (Succès IA)', href: '/lex-predict', icon: Scale },
                { name: 'LexPersona (Psychologie)', href: '/lex-persona', icon: Brain },
                { name: 'Cartographie LexGraph', href: '/lex-graph', icon: Network },
                { name: 'Smart Escrow (Block)', href: '/smart-escrow', icon: Lock },
                { name: 'Finance Stratégique', href: '/finance-strategique', icon: TrendingUp },
            ]
        },
        {
            title: "NEXUS INTELLIGENCE",
            items: [
                { name: 'LexAI Co-Counsel', href: '/ai/chat', icon: Bot },
                { name: 'LexAudio Drafter', href: '/lex-audio', icon: Mic },
                { name: 'Legal Bridge (Trad)', href: '/legal-bridge', icon: Languages },
                { name: 'Scanner Adverse IA', href: '/scanner-adverse', icon: FileSearch },
                { name: 'LexDMS (Versioning)', href: '/lex-dms', icon: FolderOpen },
                { name: 'Générateur d\'Actes', href: '/generateur-contrat', icon: FileSignature },
            ]
        },
        {
            title: "RESSOURCES",
            items: [
                { name: 'Wiki & Doctrine', href: '/wiki-doctrine', icon: Bookmark },
                { name: 'Portail Client 3.0', href: '/client-experience', icon: LayoutDashboard },
                { name: 'Annuaire Pro', href: '/annuaire', icon: Contact },
                { name: 'RH & Talents', href: '/rh', icon: GraduationCap },
                { name: 'Cabinet Academy', href: '/admin/documentation', icon: BookOpen },
            ]
        }
    ];

    return (
        <div className={cn("flex h-screen flex-col justify-between border-r border-slate-800 bg-black text-white w-64 shadow-sm transition-colors", className)}>
            <div className="flex flex-col h-full">
                {/* Logo Area */}
                <div className="h-20 flex flex-col justify-center px-6 border-b border-slate-800 bg-black shrink-0">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-wide text-white mb-1">
                        <Scale className="h-6 w-6 text-amber-500" />
                        <span>LEX<span className="text-amber-500">PREMIUM</span></span>
                    </Link>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">SCP d&apos;Avocats Dia et Associés</p>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-900 [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-500">
                    {navigationGroups.map((group) => (
                        <div key={group.title} className="space-y-1">
                            <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                                {group.title}
                            </h3>
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => onNavigate?.()}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group",
                                            isActive
                                                ? "bg-slate-800 text-white shadow-md relative overflow-hidden"
                                                : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 h-full w-1 bg-amber-500" />
                                        )}
                                        <item.icon className={cn("h-4 w-4", isActive ? "text-amber-500" : "text-slate-500 group-hover:text-slate-300")} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Footer / Stopwatch */}
                <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-4 shrink-0">
                    <Stopwatch />

                    <button
                        onClick={() => logout()}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-all duration-200 group"
                    >
                        <LogOut className="h-5 w-5 text-slate-500 group-hover:text-red-400" />
                        Se déconnecter
                    </button>

                    <div className="flex items-center justify-between px-2 pt-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] text-slate-600">v2026.1 PRO</span>
                        <Link href="/admin"><Settings className="h-4 w-4 text-slate-600 hover:text-white cursor-pointer" /></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
