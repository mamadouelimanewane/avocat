
import { PrismaClient } from '@prisma/client'
import RapportsDashboard from '@/components/rapports/RapportsDashboard'

const prisma = new PrismaClient()

async function getStats() {
    // 1. Chiffre d'Affaires Global (Factures validées ou payées)
    const revenueAgg = await prisma.facture.aggregate({
        _sum: { amountTTC: true },
        where: { status: { in: ['EMISE', 'PAYEE', 'PARTIELLE'] } }
    });
    const revenue = revenueAgg._sum.amountTTC || 0;

    // 2. Dossiers Counts
    const openDossiers = await prisma.dossier.count({ where: { status: 'OUVERT' } })
    const closedDossiers = await prisma.dossier.count({ where: { status: 'CLOTURE' } })

    // 3. Heures Facturables (TimeEntries)
    const timeAgg = await prisma.timeEntry.aggregate({
        _sum: { duration: true },
        where: { billable: true }
    });
    const hours = (timeAgg._sum.duration || 0) / 60; // Minutes to Hours

    // 4. Moyenne Facture
    const invoicesCount = await prisma.facture.count({ where: { status: { in: ['EMISE', 'PAYEE'] } } })
    const avgInvoice = invoicesCount > 0 ? revenue / invoicesCount : 0;

    // 5. Taux de Recouvrement (Payé vs Total Emis)
    const paidAgg = await prisma.facture.aggregate({
        _sum: { amountTTC: true },
        where: { status: 'PAYEE' }
    });
    const paidAmount = paidAgg._sum.amountTTC || 0;
    const recoveryRate = revenue > 0 ? Math.round((paidAmount / revenue) * 100) : 0;

    // 6. Top Clients
    // Advanced query: We get all clients with their invoices sum
    const allClients = await prisma.client.findMany({
        include: {
            factures: {
                where: { status: { in: ['EMISE', 'PAYEE'] } },
                select: { amountTTC: true }
            },
            dossiers: { select: { id: true } }
        }
    });

    const clientStats = allClients.map(c => ({
        name: c.name,
        ca: c.factures.reduce((sum, f) => sum + f.amountTTC, 0),
        dossiers: c.dossiers.length
    }))
        .sort((a, b) => b.ca - a.ca)
        .slice(0, 5); // Take top 5

    // 7. Par Juridiction (Approximation pour "Domaines")
    const dossiersByJur = await prisma.dossier.groupBy({
        by: ['jurisdiction'],
        _count: { id: true }
    });
    const totalDossiersWithJur = dossiersByJur.reduce((acc, curr) => acc + curr._count.id, 0);

    const domaineStats = dossiersByJur.map(d => ({
        domaine: d.jurisdiction || "Non spécifié",
        pourcentage: totalDossiersWithJur > 0 ? Math.round((d._count.id / totalDossiersWithJur) * 100) : 0,
        color: 'bg-indigo-500' // Fixed for now
    })).sort((a, b) => b.pourcentage - a.pourcentage);


    return {
        caAnnuel: revenue,
        dossiersOuverts: openDossiers,
        dossiersClotures: closedDossiers,
        tempsFacture: hours,
        facturesMoyenne: avgInvoice,
        tauxReussite: recoveryRate, // Using recovery rate as success rate proxy for financials
        topClients: clientStats,
        parDomaine: domaineStats,
        performanceAvocats: [] // Not implemented for now due to complex user relation
    };
}

export default async function RapportsPage() {
    const stats = await getStats();

    return (
        <RapportsDashboard stats={stats} />
    )
}
