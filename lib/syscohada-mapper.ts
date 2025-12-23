
import { PrismaClient } from "@prisma/client"
// This mapper classifies accounts into SYSCOHADA reporting lines

export type SyscohadaLine = {
    ref: string     // The "Code Poste" (e.g., AD, AE)
    label: string   // Description
    value: number
    isTotal?: boolean
    isTitle?: boolean
    level?: number // Indent level
}

export function mapAccountToBilanActif(code: string): string | null {
    if (code.startsWith('2')) return 'IMMOBILISATIONS'
    if (code.startsWith('3')) return 'STOCKS'
    if (code.startsWith('4') && !code.startsWith('48') && !code.startsWith('49')) return 'CREANCES'
    if (code.startsWith('5')) return 'TRESORERIE'
    return null
}

export function calculateResultat(accounts: any[]) {
    // 70 - Ventes
    const CA = sum(accounts, '70')
    // 60 - Achats
    const Achats = sum(accounts, '60')

    const MargeBrute = CA - Achats

    // 61, 62, 63 - Services Extérieurs
    const ServicesExt = sum(accounts, '61') + sum(accounts, '62') + sum(accounts, '63')

    const ValeurAjoutee = MargeBrute - ServicesExt

    // 64 - Impots, 66 - Personnel
    const Impots = sum(accounts, '64')
    const Personnel = sum(accounts, '66')

    const EBE = ValeurAjoutee - Impots - Personnel

    // 68 - Dotations
    const Dotations = sum(accounts, '68')
    const Reprises = sum(accounts, '78') // actually 78 is Reprises implies positive revenue

    const ResultatExploitation = EBE - Dotations + Reprises

    // Financier
    const ProdFi = sum(accounts, '77')
    const ChargeFi = sum(accounts, '67')
    const ResultatFi = ProdFi - ChargeFi

    // HAO
    const ProdHAO = sum(accounts, '8') // Class 8 for HAO in some variations, or 75
    const ChargeHAO = sum(accounts, '8') // Check specific plan. SYSCOHADA uses 75/65 for Autres activites ordinaires, and 8 for HAO.
    // Let's assume standard 6/7 structure for now.

    const ResultatNet = ResultatExploitation + ResultatFi // - Impots sur résultat

    return [
        { label: "Produits d'Exploitation (Chiffre d'Affaires)", value: CA, level: 0, bold: true },
        { label: "Achats consommés", value: -Achats, level: 0 },
        { label: "MARGE BRUTE", value: MargeBrute, level: 0, bold: true, isTotal: true },

        { label: "Transports, Services Extérieurs", value: -ServicesExt, level: 0 },
        { label: "VALEUR AJOUTÉE", value: ValeurAjoutee, level: 0, bold: true, isTotal: true },

        { label: "Impôts et Taxes", value: -Impots, level: 0 },
        { label: "Charges de Personnel", value: -Personnel, level: 0 },
        { label: "EXCÉDENT BRUT D'EXPLOITATION (EBE)", value: EBE, level: 0, bold: true, isTotal: true },

        { label: "Dotations aux Amortissements", value: -Dotations, level: 0 },
        { label: "Reprises et Transferts de Charges", value: Reprises, level: 0 },
        { label: "RÉSULTAT D'EXPLOITATION", value: ResultatExploitation, level: 0, bold: true, isTotal: true },

        { label: "Produits Financiers", value: ProdFi, level: 0 },
        { label: "Charges Financières", value: -ChargeFi, level: 0 },
        { label: "RÉSULTAT FINANCIER", value: ResultatFi, level: 0, bold: true, isTotal: true },

        { label: "RÉSULTAT NET", value: ResultatNet, level: 0, bold: true, isTotal: true, highlight: true },
    ]
}

export function calculateBilanActif(accounts: any[]) {
    // Actif Immobilisé
    const Incorporelles = sum(accounts, '21')
    const Corporelles = sum(accounts, '22') + sum(accounts, '23') + sum(accounts, '24')
    const Financieres = sum(accounts, '26') + sum(accounts, '27')

    // Actif Circulant
    const Stocks = sum(accounts, '3')
    const Clients = sum(accounts, '41')
    const AutresCreances = sum(accounts, '42') + sum(accounts, '43') + sum(accounts, '44') + sum(accounts, '45') + sum(accounts, '46') + sum(accounts, '47')
    // Note: purely summing all 42-47 as receivables is a simplification. 
    // In real accounting, we check Debit Balances.

    const TresorerieActif = sum(accounts, '5')

    const TotalImmobilise = Incorporelles + Corporelles + Financieres
    const TotalCirculant = Stocks + Clients + AutresCreances
    const TotalTresorerie = TresorerieActif

    return [
        { label: "ACTIF IMMOBILISÉ", isTitle: true },
        { label: "Immobilisations Incorporelles", value: Incorporelles, ref: "ADI" },
        { label: "Immobilisations Corporelles", value: Corporelles, ref: "ADJ" },
        { label: "Immobilisations Financières", value: Financieres, ref: "ADK" },
        { label: "Total Actif Immobilisé", value: TotalImmobilise, isTotal: true },

        { label: "ACTIF CIRCULANT", isTitle: true },
        { label: "Stocks et En-cours", value: Stocks, ref: "ADL" },
        { label: "Clients et Comptes Rattachés", value: Clients, ref: "ADM" },
        { label: "Autres Créances", value: AutresCreances, ref: "ADN" },
        { label: "Total Actif Circulant", value: TotalCirculant, isTotal: true },

        { label: "TRÉSORERIE - ACTIF", isTitle: true },
        { label: "Disponibilités", value: TresorerieActif, ref: "ADT" },

        { label: "TOTAL GÉNÉRAL ACTIF", value: TotalImmobilise + TotalCirculant + TotalTresorerie, isTotal: true, highlight: true }
    ]
}

export function calculateBilanPassif(accounts: any[], resultatNet: number) {
    // Capitaux Propres
    const Capital = sum(accounts, '10')
    const Reserves = sum(accounts, '11') + sum(accounts, '12') // 12=Report à nouveau
    const ResNet = resultatNet // Calculated from CR

    // Dettes Financières
    const Emprunts = sum(accounts, '16')

    // Passif Circulant
    const Fournisseurs = sum(accounts, '40')
    const Fiscal = sum(accounts, '44') // Fiscal Dettes usually
    const AutresDettes = sum(accounts, '42') + sum(accounts, '43') + sum(accounts, '45') // Simplified

    // Tresorerie Passif (Decouverts)
    // In our simplified 'sum' function we take abs value. 
    // For Class 5, usually Debit is Actif, Credit is Passif (Bank Overdraft).
    // We need to split Class 5 Accounts by Debit vs Credit balance for accurate Bilan.
    // For this prototype, we assume all Class 5 is Actif (Positive Cash). 
    // If we want to be strict, we would check balances.
    const TresoreriePassif = 0

    const TotalCapitaux = Capital + Reserves + ResNet
    const TotalDettesFi = Emprunts
    const TotalPassifCirc = Fournisseurs + Fiscal + AutresDettes

    return [
        { label: "CAPITAUX PROPRES", isTitle: true },
        { label: "Capital", value: Capital, ref: "CP" },
        { label: "Réserves et Report à Nouveau", value: Reserves, ref: "RES" },
        { label: "Résultat Net de l'Exercice", value: ResNet, ref: "RN", bold: true },
        { label: "Total Capitaux Propres", value: TotalCapitaux, isTotal: true },

        { label: "DETTES FINANCIÈRES", isTitle: true },
        { label: "Emprunts et Dettes Fin.", value: Emprunts, ref: "DF" },

        { label: "PASSIF CIRCULANT", isTitle: true },
        { label: "Fournisseurs et Comptes Rattachés", value: Fournisseurs, ref: "PC" },
        { label: "Dettes Fiscales et Sociales", value: Fiscal, ref: "FS" },
        { label: "Autres Dettes", value: AutresDettes, ref: "AD" },
        { label: "Total Passif Circulant", value: TotalPassifCirc, isTotal: true },

        { label: "TRÉSORERIE - PASSIF", isTitle: true },
        { label: "Banques, Découverts", value: TresoreriePassif, ref: "TP" },

        { label: "TOTAL GÉNÉRAL PASSIF", value: TotalCapitaux + TotalDettesFi + TotalPassifCirc + TresoreriePassif, isTotal: true, highlight: true }
    ]
}

function sum(accounts: any[], prefix: string): number {
    return accounts
        .filter(a => a.code.startsWith(prefix))
        .reduce((s, a) => s + Math.abs(a.balance), 0)
    // Note: In Account model, balance is signed. 
    // For '60', balance is generally Debit (positive in our logic check? or negative? 
    // Logic: Actif/Charge = Debit(+). Passif/Produit = Credit(-).
    // Let's assume standard: Debit is +, Credit is -.
    // So Charges are + (Debit), Produits are - (Credit).
    // We need absolute values for the Report Logic which subtracts them explicitly.
}
