
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleGrid } from '@/components/dashboard/ModuleGrid';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SmartAgenda } from '@/components/dashboard/SmartAgenda';
import { LegalWatchFeed } from '@/components/dashboard/LegalWatchFeed';
import { Sparkles } from 'lucide-react';

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

export default async function Home() {
    const stats = await getStats();
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const meetingCount = stats.agenda.length;

    let insight = "Tout est calme.";
    if (meetingCount > 2) insight = "Journée chargée.";
    if (stats.tasksPending > 0) insight = `${stats.tasksPending} tâches en attente.`;

    return (
        <div className="flex-1 space-y-3 pt-1 pb-20">

            {/* 1. BRIEFING ULTRA-COMPACT */}
            <div className="bg-gradient-to-r from-indigo-800 to-indigo-700 rounded-lg px-4 py-1.5 text-white shadow-sm flex items-center gap-3">
                <div className="bg-white/10 p-1 rounded-lg shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                    <p className="text-xs">
                        Bonjour Maître. <span className="text-indigo-200">{insight}</span>
                    </p>
                    <div className="flex gap-3 text-[11px] font-medium border-l border-white/10 pl-3">
                        <span><strong>{meetingCount}</strong> RDV</span>
                        <span><strong>{stats.dossierCount}</strong> Dossiers</span>
                    </div>
                </div>
            </div>

            {/* 2. MODULES - Plus compact */}
            <div>
                <ModuleGrid />
            </div>

            {/* 3. ACTIONS RAPIDES + RDV */}
            <div className="grid gap-3 md:grid-cols-6">
                {/* Actions Rapides - 4 colonnes (2/3) */}
                <div className="md:col-span-4">
                    <QuickActions />
                </div>

                {/* Prochains RDV - 2 colonnes (1/3) */}
                <div className="md:col-span-2">
                    <SmartAgenda events={stats.agenda} />
                </div>
            </div>

            {/* 4. VEILLE JURIDIQUE (en dessous) */}
            <LegalWatchFeed items={stats.legalWatch} />

        </div>
    );
}
