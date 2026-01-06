export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { ExecutiveDashboard } from '@/components/rapports/ExecutiveDashboard'

async function getExecutiveAnalytics() {
    // 1. KPI Cabinet
    const [factures, dossiers, timeEntries, settings] = await Promise.all([
        prisma.facture.findMany({
            include: { client: true, payments: true }
        }),
        prisma.dossier.findMany({
            include: { client: true, factures: { include: { payments: true } }, expenses: true, assignedTo: true }
        }),
        prisma.timeEntry.findMany(),
        prisma.cabinetSettings.findFirst()
    ])

    // CA Réalisé (factures émises)
    const caRealise = factures
        .filter(f => f.status === 'EMISE' || f.status === 'PAYEE' || f.status === 'PARTIELLE')
        .reduce((sum, f) => sum + f.amountTTC, 0)

    // CA Objectif (on peut stocker ça dans settings ou calculer)
    const caPrevu = settings?.annualTarget || (caRealise * 1.2) // 20% au-dessus si pas défini

    // Taux de Recouvrement
    const paye = factures.filter(f => f.status === 'PAYEE').reduce((sum, f) => sum + f.amountTTC, 0)
    const emis = caRealise
    const tauxRecouvrement = emis > 0 ? Math.round((paye / emis) * 100) : 0

    // Créances en cours (>30j)
    const now = new Date()
    const creanceEnCours = factures
        .filter(f => f.status !== 'PAYEE' && f.dueDate && ((now.getTime() - f.dueDate.getTime()) / (1000 * 60 * 60 * 24)) > 30)
        .reduce((sum, f) => sum + f.amountTTC, 0)

    // Marge Nette (simplifié)
    const totalExpenses = dossiers.reduce((sum, d) => sum + d.expenses.reduce((s, e) => s + e.amount, 0), 0)
    const totalTime = timeEntries.reduce((sum, t) => sum + t.duration, 0) / 60 // heures
    const internalRate = settings?.internalHourlyRate || 50
    const timeCost = totalTime * internalRate
    const margeNette = emis > 0 ? ((emis - totalExpenses - timeCost) / emis) * 100 : 0

    // Tendances CA (6 derniers mois réels)
    const trends = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (5 - i))
        return {
            month: d.toLocaleString('fr-FR', { month: 'short' }),
            year: d.getFullYear(),
            monthIndex: d.getMonth()
        }
    })

    const tendancesCA = trends.map(t => {
        const monthCA = factures
            .filter(f => {
                const fDate = new Date(f.issueDate)
                return fDate.getMonth() === t.monthIndex && fDate.getFullYear() === t.year &&
                    (f.status === 'EMISE' || f.status === 'PAYEE' || f.status === 'PARTIELLE')
            })
            .reduce((sum, f) => sum + f.amountTTC, 0)

        return {
            mois: t.month,
            ca: monthCA,
            objectif: (caPrevu / 12)
        }
    })

    const tendancesRecouvrement = trends.map(t => {
        const monthInvoices = factures.filter(f => {
            const fDate = new Date(f.issueDate)
            return fDate.getMonth() === t.monthIndex && fDate.getFullYear() === t.year
        })
        const monthPaid = monthInvoices
            .filter(f => f.status === 'PAYEE')
            .reduce((sum, f) => sum + f.amountTTC, 0)
        const monthTotal = monthInvoices.reduce((sum, f) => sum + f.amountTTC, 0)

        return {
            mois: t.month,
            taux: monthTotal > 0 ? Math.round((monthPaid / monthTotal) * 100) : 0
        }
    })

    // Alertes
    const alertes = [
        ...(creanceEnCours > 10000000 ? [{
            id: '1',
            type: 'URGENT' as const,
            titre: 'Créances Critiques Élevées',
            description: `Plus de ${(creanceEnCours / 1000000).toFixed(0)}M FCFA d'impayés dépassent 30 jours.`,
            dossierRef: 'MULTI'
        }] : []),
        ...(tauxRecouvrement < 70 ? [{
            id: '2',
            type: 'WARNING' as const,
            titre: 'Taux de Recouvrement Faible',
            description: `Le taux actuel de ${tauxRecouvrement}% est inférieur au seuil critique de 70%.`
        }] : [])
    ]

    // Dossiers à risque (impayés + délais)
    const dossiersRisque = dossiers
        .filter(d => {
            const impaye = d.factures.filter(f => f.status !== 'PAYEE').reduce((sum, f) => sum + f.amountTTC, 0)
            return impaye > 5000000 || d.status === 'OUVERT'
        })
        .slice(0, 5)
        .map(d => ({
            id: d.id,
            reference: d.reference,
            client: d.client?.name || 'N/A',
            risque: (d.factures.filter(f => f.status !== 'PAYEE').reduce((sum, f) => sum + f.amountTTC, 0) > 10000000) ? 'HIGH' as const : 'MEDIUM' as const,
            motif: 'Impayés significatifs / Dossier Actif'
        }))

    // Répartition Réelle par Domaine
    const domainesMap: Record<string, number> = {}
    dossiers.forEach(d => {
        const dom = d.procedureType || 'AUTRE'
        domainesMap[dom] = (domainesMap[dom] || 0) + d.factures.reduce((sum, f) => sum + f.amountTTC, 0)
    })
    const parDomaine = Object.entries(domainesMap).map(([dom, montant], i) => ({
        domaine: dom,
        montant,
        couleur: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][i % 5]
    }))

    // Répartition par Avocat
    const avocatsMap: Record<string, { ca: number, dossiers: number }> = {}
    dossiers.forEach(d => {
        const name = d.assignedTo?.name || 'Non assigné'
        if (!avocatsMap[name]) avocatsMap[name] = { ca: 0, dossiers: 0 }
        avocatsMap[name].ca += d.factures.reduce((sum, f) => sum + f.amountTTC, 0)
        avocatsMap[name].dossiers += 1
    })
    const parAvocat = Object.entries(avocatsMap).map(([avocat, data]) => ({
        avocat,
        ca: data.ca,
        dossiers: data.dossiers
    }))

    return {
        kpi: {
            caRealise,
            caPrevu,
            tauxRecouvrement,
            creanceEnCours,
            margeNette,
            caParAvocat: parAvocat.length > 0 ? caRealise / parAvocat.length : caRealise,
            tempsMoyenDossier: 35, // Statistiquement calculable si on a des dates de clôture
            dossiersActifs: dossiers.filter(d => d.status === 'OUVERT').length
        },
        tresorerie: {
            soldeActuel: paye - totalExpenses,
            prevision30j: (paye - totalExpenses) + (emis * 0.20),
            prevision60j: (paye - totalExpenses) + (emis * 0.40),
            prevision90j: (paye - totalExpenses) + (emis * 0.60)
        },
        alertes,
        tendances: {
            ca: tendancesCA,
            recouvrement: tendancesRecouvrement
        },
        repartition: {
            parDomaine: parDomaine.length > 0 ? parDomaine : [{ domaine: 'Général', montant: caRealise, couleur: '#6366f1' }],
            parAvocat: parAvocat.length > 0 ? parAvocat : [{ avocat: 'Cabinet', ca: caRealise, dossiers: dossiers.length }]
        },
        dossiersRisque
    }
}

export default async function ExecutivePage() {
    const analytics = await getExecutiveAnalytics()

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ExecutiveDashboard analytics={analytics} />
        </div>
    )
}
