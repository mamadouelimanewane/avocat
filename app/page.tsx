
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import {
    Briefcase,
    Users,
    Clock,
    TrendingUp,
    ArrowRight,
    Calendar as CalendarIcon,
    CheckCircle2,
    AlertCircle,
    Receipt
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { DailyWidgets } from '@/components/dashboard/DailyWidgets';
import { ModuleGrid } from '@/components/dashboard/ModuleGrid';
import { QuickActions } from '@/components/dashboard/QuickActions';

const prisma = new PrismaClient();

async function getStats() {
    // 1. Counts
    const dossierCount = await prisma.dossier.count({ where: { status: 'OUVERT' } });
    const clientCount = await prisma.client.count();

    // 2. Financials
    const revenue = await prisma.facture.aggregate({
        _sum: { amountTTC: true },
        where: { status: 'PAYEE' }
    });

    const pending = await prisma.facture.aggregate({
        _sum: { amountTTC: true },
        where: { status: 'EMISE' }
    });

    // 3. Recent Activity
    const recentDossiers = await prisma.dossier.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: { client: true }
    });

    // 4. Real Chart Data (Last 6 Months)
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    // Fetch all paid invoices in the last 6 months
    const paidInvoices = await prisma.facture.findMany({
        where: {
            status: 'PAYEE',
            updatedAt: {
                gte: sixMonthsAgo
            }
        },
        select: {
            amountTTC: true,
            updatedAt: true
        }
    });

    // Group by Month
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = d.getMonth(); // 0-11
        const yearKey = d.getFullYear();

        // Sum invoices for this month
        const monthlyTotal = paidInvoices
            .filter(inv => {
                const invDate = new Date(inv.updatedAt);
                return invDate.getMonth() === monthKey && invDate.getFullYear() === yearKey;
            })
            .reduce((sum, inv) => sum + inv.amountTTC, 0);

        chartData.push({
            name: months[monthKey],
            total: monthlyTotal
        });
    }

    return {
        dossierCount,
        clientCount,
        totalRevenue: revenue._sum.amountTTC || 0,
        pendingRevenue: pending._sum.amountTTC || 0,
        recentDossiers,
        chartData
    };
}

export default async function DashboardPage() {
    const { dossierCount, clientCount, totalRevenue, pendingRevenue, recentDossiers, chartData } = await getStats();

    const stats = [
        { label: "Dossiers Actifs", value: dossierCount.toString(), icon: Briefcase, trend: "+2 this week", trendUp: true, color: "text-blue-600", bg: "bg-blue-50", borderColor: "border-blue-500" },
        { label: "Clients", value: clientCount.toString(), icon: Users, trend: "+5 new", trendUp: true, color: "text-emerald-600", bg: "bg-emerald-50", borderColor: "border-emerald-500" },
        { label: "Revenus Encaissés", value: formatCurrency(totalRevenue), icon: TrendingUp, trend: "+15% vs last month", trendUp: true, color: "text-amber-600", bg: "bg-amber-50", borderColor: "border-amber-500" },
        { label: "En Attente", value: formatCurrency(pendingRevenue), icon: Clock, trend: "Factures émises", trendUp: false, color: "text-rose-600", bg: "bg-rose-50", borderColor: "border-rose-500" },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de Bord</h1>
                    <p className="text-lg text-emerald-800 font-medium mt-2">Bienvenue, Me Dia. Voici un aperçu de votre activité en temps réel pour la SCP.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-10 text-base px-4" asChild>
                        <Link href="/agenda">
                            <CalendarIcon className="mr-2 h-5 w-5" />
                            Agenda
                        </Link>
                    </Button>
                    <Button className="h-10 text-base px-4 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                        <Link href="/dossiers">
                            <Briefcase className="mr-2 h-5 w-5" />
                            Nouveau Dossier
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Modules Grid (Quick Access to Pages) - "Les Icones" */}
            <ModuleGrid />

            {/* Quick Actions - "Actions Rapides en dessous" */}
            <QuickActions />

            {/* Stats Grid - Business Card Style */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className={`border-l-4 ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                {stat.label}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                            <p className={`text-xs mt-1 ${stat.trendUp ? "text-emerald-600" : "text-amber-600"} flex items-center font-medium`}>
                                {stat.trendUp ? <TrendingUp className="h-3 w-3 mr-1" /> : null}
                                {stat.trend}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Daily Operational Widgets */}
            <DailyWidgets />

            {/* Charts & Activity */}
            <div className="grid gap-6 md:grid-cols-7">

                {/* Revenue Chart */}
                <Card className="md:col-span-4 border-none shadow-md bg-card">
                    <CardHeader>
                        <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
                        <CardDescription>Revenus encaissés sur les 6 derniers mois (FCFA).</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <RevenueChart data={chartData} />
                    </CardContent>
                </Card>

                {/* Recent Dossiers */}
                <Card className="md:col-span-3 border-none shadow-md bg-card">
                    <CardHeader>
                        <CardTitle>Dossiers Récents</CardTitle>
                        <CardDescription>Vos dernières mises à jour.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentDossiers.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Aucun dossier récent.</p>
                            ) : recentDossiers.map((dossier) => (
                                <div key={dossier.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                            <Briefcase className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-lg font-semibold leading-none text-foreground line-clamp-1">{dossier.title}</p>
                                            <p className="text-base text-muted-foreground">{dossier.client.name}</p>
                                        </div>
                                    </div>
                                    <div className="ml-auto font-medium text-base text-slate-500">
                                        {new Date(dossier.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-xs" asChild>
                            <Link href="/dossiers">Voir tous les dossiers <ArrowRight className="ml-1 h-3 w-3" /></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
