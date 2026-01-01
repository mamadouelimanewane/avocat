
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma';
import { ModuleGrid } from '@/components/dashboard/ModuleGrid';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SmartAgenda } from '@/components/dashboard/SmartAgenda';
import { LegalWatchFeed } from '@/components/dashboard/LegalWatchFeed';
import { Sparkles, Scale, TrendingUp, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';

async function getStats() {
    try {
        const dossierCount = await prisma.dossier.count({ where: { status: 'OUVERT' } });

        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfTomorrow = new Date(today);
        endOfTomorrow.setDate(today.getDate() + 2);
        endOfTomorrow.setHours(0, 0, 0, 0);

        const agenda = await prisma.event.findMany({
            where: {
                startDate: { gte: startOfDay, lt: endOfTomorrow }
            },
            orderBy: { startDate: 'asc' },
            include: { dossier: true }
        });

        const legalWatch = await prisma.jurisprudence.findMany({
            where: { status: 'VALIDATED' },
            orderBy: { createdAt: 'desc' },
            take: 3
        });

        const tasksPending = await prisma.task.count({
            where: { completed: false }
        });

        return { dossierCount, agenda, legalWatch, tasksPending };
    } catch (e) {
        console.error("Dashboard stats error:", e);
        return { dossierCount: 0, agenda: [], legalWatch: [], tasksPending: 0 };
    }
}

export default async function DashboardPage() {
    const stats = await getStats();
    const meetingCount = stats.agenda.length;

    let insight = "Tout est calme aujourd'hui.";
    if (meetingCount > 2) insight = "Votre journée s'annonce intense.";
    if (stats.tasksPending > 0) insight = `Vous avez ${stats.tasksPending} dossiers nécessitant une action.`;

    return (
        <div className="flex-1 space-y-8 pb-20">

            {/* PREEMINENT HERO HEADER - Combined Style */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-10 md:p-14 border border-white/5 shadow-2xl">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -z-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 -z-0 w-[300px] h-[300px] bg-amber-500/5 blur-[70px] rounded-full -translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black tracking-[0.2em] text-amber-500 mb-6 uppercase">
                            <Sparkles className="h-3 w-3" />
                            LexPremium Dashboard
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-4">
                            LE CABINET <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                                NOUVELLE GÉNÉRATION.
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg font-light max-w-lg">
                            Bonjour Maître. {insight} Vos outils d'excellence sont prêts.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-center">
                            <div className="text-3xl font-black text-white">{stats.dossierCount}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Dossiers Actifs</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-center">
                            <div className="text-3xl font-black text-amber-500">{meetingCount}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">RDV Prévus</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS & MODULES */}
            <div className="grid gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <Scale className="h-5 w-5 text-indigo-500" />
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Écosystème du Cabinet</h2>
                    </div>
                    <ModuleGrid />
                </div>
            </div>

            {/* AGENDA & ACTIONS */}
            <div className="grid gap-8 md:grid-cols-12 lg:grid-cols-3">
                <div className="md:col-span-8 lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter text-indigo-700">Pilotage & Stratégie</h2>
                        </div>
                        <QuickActions />
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Users className="h-5 w-5 text-indigo-500" />
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Veille Juridique LexConnect</h2>
                        </div>
                        <LegalWatchFeed items={stats.legalWatch} />
                    </div>
                </div>

                <div className="md:col-span-4 lg:col-span-1">
                    <div className="bg-slate-950 rounded-[2.5rem] p-8 shadow-2xl h-full border border-slate-800">
                        <div className="flex items-center gap-2 mb-6">
                            <Briefcase className="h-5 w-5 text-amber-500" />
                            <h2 className="text-lg font-black text-white uppercase tracking-tighter">Agenda Intelligent</h2>
                        </div>
                        <SmartAgenda events={stats.agenda} />

                        <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
                            <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-2">LexAI Note</p>
                            <p className="text-sm text-slate-300 font-light">
                                "N'oubliez pas de finaliser les conclusions du dossier SCI Horizon Dakar avant l'audience de demain."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
