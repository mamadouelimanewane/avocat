import { PrismaClient } from '@prisma/client'
import { startOfMonth, endOfMonth, subMonths, format, isWithinInterval } from 'date-fns'

const prisma = new PrismaClient()

export interface FinancialStats {
    monthlyRevenue: { month: string; amount: number; target: number }[]
    monthlyExpenses: { month: string; amount: number }[]
    profitabilityByDomain: { domain: string; revenue: number; costs: number; profit: number }[]
    lawyerPerformance: { name: string; billableHours: number; revenue: number; efficiency: number }[]
    summary: {
        totalCA: number
        totalExpenses: number
        netProfit: number
        activeDossiers: number
        averageDailyRevenue: number
    }
}

/**
 * Service pour agréger les données financières réelles pour la BI
 */
export async function getFinancialBIStats(months: number = 12): Promise<FinancialStats> {
    const startDate = startOfMonth(subMonths(new Date(), months - 1))
    const endDate = endOfMonth(new Date())

    // 1. Fetch Invoices for Revenue
    const invoices = await prisma.facture.findMany({
        where: {
            issueDate: { gte: startDate, lte: endDate },
            status: { not: 'ANNULEE' }
        },
        select: {
            amountTTC: true,
            issueDate: true,
            status: true
        }
    })

    // 2. Fetch Expenses
    const expenses = await prisma.expense.findMany({
        where: {
            date: { gte: startDate, lte: endDate }
        },
        select: {
            amount: true,
            date: true,
            category: true
        }
    })

    // 3. Fetch Dossiers for Domain Profitability
    const dossiers = await prisma.dossier.findMany({
        where: {
            createdAt: { gte: startDate }
        },
        include: {
            factures: true,
            expenses: true,
            timeEntries: true
        }
    })

    // 4. Fetch Cabinet Settings for Target
    const settings = await prisma.cabinetSettings.findFirst()
    const monthlyTarget = (settings?.annualTarget || 100000000) / 12

    // Process Monthly CA
    const monthlyRevenue: FinancialStats['monthlyRevenue'] = []
    for (let i = 0; i < months; i++) {
        const d = subMonths(new Date(), i)
        const monthStr = format(d, 'MMM yyyy')
        const monthInvoices = invoices.filter(inv =>
            format(inv.issueDate, 'MMM yyyy') === monthStr
        )
        const amount = monthInvoices.reduce((acc, inv) => acc + inv.amountTTC, 0)
        monthlyRevenue.unshift({ month: monthStr, amount, target: monthlyTarget })
    }

    // Process Monthly Expenses
    const monthlyExpenses: FinancialStats['monthlyExpenses'] = []
    for (let i = 0; i < months; i++) {
        const d = subMonths(new Date(), i)
        const monthStr = format(d, 'MMM yyyy')
        const monthExpenses = expenses.filter(exp =>
            format(exp.date, 'MMM yyyy') === monthStr
        )
        const amount = monthExpenses.reduce((acc, exp) => acc + exp.amount, 0)
        monthlyExpenses.unshift({ month: monthStr, amount })
    }

    // Process Profitability by Domain
    const domains = ['CIVIL', 'PENAL', 'COMMERCIAL', 'SOCIAL', 'ADMINISTRATIF']
    const profitabilityByDomain = domains.map(domain => {
        const domainDossiers = dossiers.filter(d => d.procedureType === domain)
        const revenue = domainDossiers.reduce((acc, d) =>
            acc + d.factures.reduce((fAcc, f) => fAcc + f.amountTTC, 0), 0
        )
        const costs = domainDossiers.reduce((acc, d) =>
            acc + d.expenses.reduce((eAcc, e) => eAcc + e.amount, 0), 0
        )
        return {
            domain,
            revenue,
            costs,
            profit: revenue - costs
        }
    })

    // Summary
    const totalCA = invoices.reduce((acc, inv) => acc + inv.amountTTC, 0)
    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0)
    const activeDossiersCount = await prisma.dossier.count({ where: { status: 'OUVERT' } })

    return {
        monthlyRevenue,
        monthlyExpenses,
        profitabilityByDomain,
        lawyerPerformance: [], // Placeholder for now
        summary: {
            totalCA,
            totalExpenses,
            netProfit: totalCA - totalExpenses,
            activeDossiers: activeDossiersCount,
            averageDailyRevenue: totalCA / (months * 30)
        }
    }
}

/**
 * Prédit le CA futur basé sur les tendances historiques (Linear Regression Simple)
 */
export function predictFutureRevenue(history: { amount: number }[], periodsToPredict: number = 6) {
    if (history.length < 2) return history.map(h => h.amount)

    const n = history.length
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0

    for (let i = 0; i < n; i++) {
        sumX += i
        sumY += history[i].amount
        sumXY += i * history[i].amount
        sumX2 += i * i
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    const predictions: number[] = []
    for (let i = n; i < n + periodsToPredict; i++) {
        predictions.push(Math.max(0, slope * i + intercept))
    }

    return predictions
}
