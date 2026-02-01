import { PrismaClient } from '@prisma/client'
import LibraryClient from './LibraryContent'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

const libraryData = [
    {
        category: "Foncier & Immobilier",
        icon: "Home",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        documents: [
            { name: "Vente d'immeuble (Acte Autre)", type: "ACTE", size: "1.4 MB", status: "Premium", link: "#" },
            { name: "VEFA (Vente État Futur Achèvement)", type: "CONTRAT", size: "2.2 MB", status: "Promoteur", link: "#" },
            { name: "Promesse Unilatérale de Vente (PUV)", type: "CONTRAT", size: "480 KB", status: "Expert", link: "#" },
            { name: "Bail Commercial (3-6-9)", type: "CONTRAT", size: "340 KB", status: "Corporate", link: "#" },
            { name: "Hypothèque Conventionnelle", type: "ACTE", size: "210 KB", status: "Sûreté", link: "#" },
            { name: "Bail Réel Solidaire (BRS)", type: "CONTRAT", size: "380 KB", status: "Social", link: "#" }
        ]
    },
    {
        category: "Banque & Finance",
        icon: "Landmark",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        documents: [
            { name: "LBO Senior Debt Agreement", type: "CONTRAT", size: "2.5 MB", status: "Finance", link: "#" },
            { name: "SAFE (Simple Agreement for Future Equity)", type: "CONTRAT", size: "110 KB", status: "VC", link: "#" },
            { name: "Pacte d'Actionnaires (Industrial)", type: "CONTRAT", size: "1.4 MB", status: "Corporate", link: "#" },
            { name: "Nantissement de Compte-Titres", type: "ACTE", size: "85 KB", status: "Sûreté", link: "#" },
            { name: "Crédit Documentaire (L/C)", type: "CONTRAT", size: "410 KB", status: "Global", link: "#" }
        ]
    },
    {
        category: "Tech & Digital",
        icon: "Cpu",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        documents: [
            { name: "Smart Contract Architecture Web3", type: "CONTRAT", size: "140 KB", status: "Blockchain", link: "#" },
            { name: "Contrat de Développement IA (LLM)", type: "CONTRAT", size: "890 KB", status: "IA", link: "#" },
            { name: "Data Processing Agreement (RGPD)", type: "CONTRAT", size: "185 KB", status: "Compliance", link: "#" },
            { name: "SaaS Enterprise Master Agreement", type: "CONTRAT", size: "520 KB", status: "Cloud", link: "#" },
            { name: "Audit Pentesting & Cyber", type: "CONTRAT", size: "135 KB", status: "Cyber", link: "#" }
        ]
    },
    {
        category: "Société & Gouvernance",
        icon: "Building2",
        color: "text-slate-600",
        bg: "bg-slate-600/10",
        documents: [
            { name: "Statuts de SAS (Expert v9.1)", type: "ACTE", size: "310 KB", status: "Corporate", link: "#" },
            { name: "Garantie d'Actif et de Passif (GAP)", type: "CONTRAT", size: "520 KB", status: "M&A", link: "#" },
            { name: "Cession de Parts Sociales (Acte)", type: "ACTE", size: "95 KB", status: "Legal", link: "#" },
            { name: "PV d'AGO (Approbation des comptes)", type: "ACTE", size: "65 KB", status: "Standard", link: "#" }
        ]
    },
    {
        category: "RH & Travail",
        icon: "Users",
        color: "text-violet-500",
        bg: "bg-violet-500/10",
        documents: [
            { name: "Contrat de Travail (CDI Expert)", type: "CONTRAT", size: "115 KB", status: "Standard", link: "#" },
            { name: "Rupture Conventionnelle (Dossier)", type: "ACTE", size: "210 KB", status: "Legal", link: "#" },
            { name: "Accord de Télétravail & Flex", type: "CONTRAT", size: "45 KB", status: "Modern", link: "#" },
            { name: "Règlement Intérieur (Compliance)", type: "ACTE", size: "420 KB", status: "Legal", link: "#" }
        ]
    },
    {
        category: "Transport & Logistique",
        icon: "Plane",
        color: "text-sky-500",
        bg: "bg-sky-500/10",
        documents: [
            { name: "Charter Party (Maritime)", type: "CONTRAT", size: "1.1 MB", status: "Maritime", link: "#" },
            { name: "Aircraft Lease (ACMI/Dry)", type: "CONTRAT", size: "1.8 MB", status: "Aérien", link: "#" },
            { name: "Logistique Center Agreement (3PL)", type: "CONTRAT", size: "420 KB", status: "Expert", link: "#" },
            { name: "Connaissement (Bill of Lading)", type: "ACTE", size: "85 KB", status: "Maritime", link: "#" }
        ]
    },
    {
        category: "Énergie & Environnement",
        icon: "Leaf",
        color: "text-green-500",
        bg: "bg-green-500/10",
        documents: [
            { name: "Power Purchase Agreement (PPA Solar)", type: "CONTRAT", size: "1.4 MB", status: "EnR", link: "#" },
            { name: "Contrat de Performance Énergétique", type: "CONTRAT", size: "820 KB", status: "ESG", link: "#" },
            { name: "Audit de Conformité Environnementale", type: "ACTE", size: "1.2 MB", status: "Expert", link: "#" }
        ]
    }
]

export default async function ModelesPage() {
    const customTemplates = await prisma.template.findMany({
        orderBy: { updatedAt: 'desc' }
    })

    return (
        <LibraryClient
            initialLibraryData={libraryData}
            customTemplates={customTemplates}
        />
    )
}
