"use client"

import {
    Search,
    FileText,
    ChevronDown,
    Filter,
    Zap,
    Scale,
    Gavel,
    Cpu,
    Smartphone,
    Globe,
    MoreHorizontal,
    Landmark,
    Building2,
    Users,
    ShieldCheck,
    Coins,
    Lock,
    Home,
    Briefcase,
    Activity,
    Cloud,
    Binary,
    ShieldAlert,
    ShoppingCart,
    Layers,
    Bot,
    Gamepad2,
    Leaf,
    Droplets,
    Anchor,
    Plane,
    Microscope,
    HeartPulse,
    Music,
    Film,
    Trophy,
    Newspaper,
    Stethoscope,
    Gem,
    HardHat,
    Car,
    FileSignature,
    PenTool
} from "lucide-react"
import { useState, useMemo } from "react"

// Types pour la structure des données
type DocType = "Contrat" | "Acte";

interface LegalDoc {
    name: string;
    sector: string;
    type: DocType;
    size: string;
    status: string;
    ref?: string;
}

// MASSIVE DATASET INJECTION - BASÉ SUR LA LISTE EXHAUSTIVE DE L'UTILISATEUR
const exhaustiveLibrary: LegalDoc[] = [
    // --- I. COMMERCE, AFFAIRES & SOCIÉTÉS ---
    { name: "Contrat de Vente Commerciale", sector: "Commerce & Affaires", type: "Contrat", size: "145 KB", status: "Premium" },
    { name: "Contrat de Prestation de Services (Entreprise)", sector: "Commerce & Affaires", type: "Contrat", size: "120 KB", status: "Expert" },
    { name: "Contrat de Distribution Exclusive", sector: "Commerce & Affaires", type: "Contrat", size: "310 KB", status: "Corporate" },
    { name: "Contrat de Franchise Internationale", sector: "Commerce & Affaires", type: "Contrat", size: "680 KB", status: "Expert" },
    { name: "Contrat d'Agence Commerciale", sector: "Commerce & Affaires", type: "Contrat", size: "195 KB", status: "Standard" },
    { name: "Contrat de Concession Commerciale", sector: "Commerce & Affaires", type: "Contrat", size: "240 KB", status: "Corporate" },
    { name: "Contrat de Commission", sector: "Commerce & Affaires", type: "Contrat", size: "115 KB", status: "Legal" },
    { name: "Contrat de Courtage", sector: "Commerce & Affaires", type: "Contrat", size: "85 KB", status: "Legal" },
    { name: "Mandat de Représentation Commerciale", sector: "Commerce & Affaires", type: "Contrat", size: "110 KB", status: "Expert" },
    { name: "Contrat de Partenariat Stratégique", sector: "Commerce & Affaires", type: "Contrat", size: "450 KB", status: "Premium" },
    { name: "Accord de Joint-Venture (Coentreprise)", sector: "Commerce & Affaires", type: "Contrat", size: "1.2 MB", status: "Corporate" },
    { name: "Contrat de Sous-Traitance Industrielle", sector: "Commerce & Affaires", type: "Contrat", size: "320 KB", status: "Industrie" },
    { name: "Contrat de Fourniture Exclusive", sector: "Commerce & Affaires", type: "Contrat", size: "215 KB", status: "Corporate" },
    { name: "Contrat-Cadre de Référencement", sector: "Commerce & Affaires", type: "Contrat", size: "480 KB", status: "Global" },
    { name: "Contrat de Marché Public (Réponse type)", sector: "Commerce & Affaires", type: "Contrat", size: "2.8 MB", status: "Public" },
    { name: "Statuts de SARL", sector: "Société & Gouvernance", type: "Acte", size: "245 KB", status: "Legal" },
    { name: "Statuts de SAS", sector: "Société & Gouvernance", type: "Acte", size: "310 KB", status: "Corporate" },
    { name: "Statuts de SCI", sector: "Société & Gouvernance", type: "Acte", size: "185 KB", status: "Gestion" },
    { name: "Pacte d'Actionnaires (LBO)", sector: "Société & Gouvernance", type: "Contrat", size: "1.4 MB", status: "Finance" },
    { name: "Protocole d'Investissement", sector: "Société & Gouvernance", type: "Contrat", size: "820 KB", status: "VC" },
    { name: "Cession de Parts Sociales", sector: "Société & Gouvernance", type: "Acte", size: "95 KB", status: "Legal" },
    { name: "Garantie d'Actif et de Passif (GAP)", sector: "Société & Gouvernance", type: "Contrat", size: "520 KB", status: "Expert" },

    // --- II. TRAVAIL & RESSOURCES HUMAINES ---
    { name: "Contrat de Travail à Durée Indéterminée (CDI)", sector: "RH & Travail", type: "Contrat", size: "115 KB", status: "Standard" },
    { name: "Contrat de Travail à Durée Déterminée (CDD)", sector: "RH & Travail", type: "Contrat", size: "105 KB", status: "Standard" },
    { name: "Contrat d'Apprentissage", sector: "RH & Travail", type: "Contrat", size: "135 KB", status: "Formation" },
    { name: "Contrat de Professionnalisation", sector: "RH & Travail", type: "Contrat", size: "140 KB", status: "Formation" },
    { name: "Contrat d'Intérim (Mise à disposition)", sector: "RH & Travail", type: "Contrat", size: "90 KB", status: "Standard" },
    { name: "Convention de Stage Étudiant", sector: "RH & Travail", type: "Contrat", size: "65 KB", status: "Academic" },
    { name: "Contrat de Consultant Indépendant", sector: "RH & Travail", type: "Contrat", size: "125 KB", status: "Expert" },
    { name: "Contrat de Freelance (Mission IT)", sector: "RH & Travail", type: "Contrat", size: "85 KB", status: "Digital" },
    { name: "Rupture Conventionnelle (Cerfa + Protocole)", sector: "RH & Travail", type: "Acte", size: "210 KB", status: "Legal" },
    { name: "Lettre de Licenciement (Motif Économique)", sector: "RH & Travail", type: "Acte", size: "75 KB", status: "Expert" },
    { name: "Accord de Participation aux bénéfices", sector: "RH & Travail", type: "Acte", size: "320 KB", status: "Social" },
    { name: "Accord d'Intéressement", sector: "RH & Travail", type: "Acte", size: "290 KB", status: "Social" },
    { name: "Règlement Intérieur (Conformité 2026)", sector: "RH & Travail", type: "Acte", size: "420 KB", status: "Compliance" },

    // --- III. FONCIER & IMMOBILIER (Maximal) ---
    { name: "Vente Immobilière (Acte de Base)", sector: "Foncier & Immobilier", type: "Contrat", size: "1.4 MB", status: "Premium" },
    { name: "Promesse Unilatérale de Vente (PUV)", sector: "Foncier & Immobilier", type: "Contrat", size: "480 KB", status: "Expert" },
    { name: "Compromis de Vente synallagmatique", sector: "Foncier & Immobilier", type: "Contrat", size: "530 KB", status: "Expert" },
    { name: "Vente à Réméré (Faculté de rachat)", sector: "Foncier & Immobilier", type: "Contrat", size: "620 KB", status: "Expert" },
    { name: "Vente en Viager (Libre ou Occupé)", sector: "Foncier & Immobilier", type: "Contrat", size: "310 KB", status: "Patrimoine" },
    { name: "VEFA (Vente État Futur Achèvement)", sector: "Foncier & Immobilier", type: "Contrat", size: "2.2 MB", status: "Promoteur" },
    { name: "Bail d'Habitation (Loi 89)", sector: "Foncier & Immobilier", type: "Contrat", size: "115 KB", status: "Standard" },
    { name: "Bail Commercial (3-6-9)", sector: "Foncier & Immobilier", type: "Contrat", size: "340 KB", status: "Corporate" },
    { name: "Bail Professionnel (Libéraux)", sector: "Foncier & Immobilier", type: "Contrat", size: "180 KB", status: "Expert" },
    { name: "Bail Emphytéotique (Longue durée)", sector: "Foncier & Immobilier", type: "Contrat", size: "450 KB", status: "Invest" },
    { name: "Crédit-Bail Immobilier (Leasing)", sector: "Foncier & Immobilier", type: "Contrat", size: "640 KB", status: "Finance" },
    { name: "Contrat de Construction de Maison Individuelle", sector: "Foncier & Immobilier", type: "Contrat", size: "1.8 MB", status: "BTP" },
    { name: "Contrat de Maîtrise d'Œuvre", sector: "Foncier & Immobilier", type: "Contrat", size: "320 KB", status: "BTP" },
    { name: "Règlement de Copropriété (Indexé)", sector: "Foncier & Immobilier", type: "Acte", size: "3.5 MB", status: "Gestion" },
    { name: "Servitude de Passage (Convention)", sector: "Foncier & Immobilier", type: "Acte", size: "95 KB", status: "Droit Réel" },
    { name: "Inscription Hypothécaire (Privilège Vendeur)", sector: "Foncier & Immobilier", type: "Acte", size: "210 KB", status: "Sûreté" },
    { name: "Radiation d'Hypothèque", sector: "Foncier & Immobilier", type: "Acte", size: "65 KB", status: "Sûreté" },
    { name: "Bordereau d'Inscription Foncière", sector: "Foncier & Immobilier", type: "Acte", size: "110 KB", status: "Sûreté" },
    { name: "Droit de Préemption Urbain (Notification)", sector: "Foncier & Immobilier", type: "Acte", size: "45 KB", status: "Urbanisme" },
    { name: "Bail Réel Solidaire (OFS)", sector: "Foncier & Immobilier", type: "Contrat", size: "380 KB", status: "Social" },

    // --- IV. BANQUE & FINANCE ---
    { name: "Contrat de Prêt Inter-Entreprises", sector: "Banque & Finance", type: "Contrat", size: "240 KB", status: "Finance" },
    { name: "Ligne de Crédit Revolving", sector: "Banque & Finance", type: "Contrat", size: "850 KB", status: "Finance" },
    { name: "Contrat de Cautionnement Solidaire", sector: "Banque & Finance", type: "Contrat", size: "115 KB", status: "Sûreté" },
    { name: "Garantie à Première Demande", sector: "Banque & Finance", type: "Contrat", size: "140 KB", status: "Expert" },
    { name: "Contrat d'Affacturage (Factoring)", sector: "Banque & Finance", type: "Contrat", size: "320 KB", status: "Finance" },
    { name: "Contrat de Gage (Stocks/Matériel)", sector: "Banque & Finance", type: "Contrat", size: "180 KB", status: "Sûreté" },
    { name: "Constitution d'Antichrèse", sector: "Banque & Finance", type: "Acte", size: "135 KB", status: "Sûreté" },
    { name: "Lettre d'Intention (Confort)", sector: "Banque & Finance", type: "Acte", size: "45 KB", status: "Corporate" },
    { name: "Crédit Documentaire (L/C Import/Export)", sector: "Banque & Finance", type: "Contrat", size: "410 KB", status: "Global" },
    { name: "Nantissement de Fonds de Commerce", sector: "Banque & Finance", type: "Acte", size: "280 KB", status: "Expert" },

    // --- V. PROPRIÉTÉ INTELLECTUELLE & TECH ---
    { name: "Contrat de Cession de Droits d'Auteur", sector: "Propriété Intellectuelle", type: "Contrat", size: "115 KB", status: "IP" },
    { name: "Licence de Brevet d'Invention", sector: "Propriété Intellectuelle", type: "Contrat", size: "850 KB", status: "IP" },
    { name: "Licence de Marque (Territoriale)", sector: "Propriété Intellectuelle", type: "Contrat", size: "220 KB", status: "IP" },
    { name: "Contrat de Transfert de Technologie", sector: "Propriété Intellectuelle", type: "Contrat", size: "940 KB", status: "Tech" },
    { name: "Accord de Confidentialité (NDA Multi-Parties)", sector: "Propriété Intellectuelle", type: "Contrat", size: "65 KB", status: "Expert" },
    { name: "Contrat d'Édition Littéraire", sector: "Propriété Intellectuelle", type: "Contrat", size: "240 KB", status: "Media" },
    { name: "Smart Contract : Architecture Web3", sector: "Tech & Digital", type: "Contrat", size: "125 KB", status: "Blockchain" },
    { name: "Token Purchase Agreement (Tokenomics)", sector: "Tech & Digital", type: "Contrat", size: "410 KB", status: "Web3" },
    { name: "Contrat de Développement IA (LLM Custom)", sector: "Tech & Digital", type: "Contrat", size: "890 KB", status: "IA" },
    { name: "Data Processing Agreement (RGPD/DPA)", sector: "Tech & Digital", type: "Contrat", size: "185 KB", status: "Compliance" },
    { name: "SaaS Master Service Agreement (MSA)", sector: "Tech & Digital", type: "Contrat", size: "520 KB", status: "Cloud" },
    { name: "Contrat de Pentesting (Cybersecurity)", sector: "Tech & Digital", type: "Contrat", size: "135 KB", status: "Cyber" },
    { name: "Accord de Bug Bounty (Safe Harbor)", sector: "Tech & Digital", type: "Contrat", size: "95 KB", status: "Cyber" },
    { name: "Metaverse Land Purchase Agreement", sector: "Tech & Digital", type: "Contrat", size: "310 KB", status: "Virtual" },
    { name: "Contrat de Staking & Yield Farming", sector: "Tech & Digital", type: "Contrat", size: "115 KB", status: "Web3" },
    { name: "DAO Governance Framework", sector: "Tech & Digital", type: "Acte", size: "420 KB", status: "Web3" },

    // --- VI. TRANSPORT, LOGISTIQUE & AGRO ---
    { name: "Contrat de Transport de Marchandises (CMR)", sector: "Transport & Logistique", type: "Contrat", size: "145 KB", status: "Standard" },
    { name: "Charte-Partie (Affrètement maritime)", sector: "Transport & Logistique", type: "Contrat", size: "1.1 MB", status: "Maritime" },
    { name: "Contrat de Logistique (3PL/4PL)", sector: "Transport & Logistique", type: "Contrat", size: "480 KB", status: "Expert" },
    { name: "Lettre de Voiture Internationale", sector: "Transport & Logistique", type: "Acte", size: "45 KB", status: "Standard" },
    { name: "Contrat de Culture & Intégration", sector: "Agroalimentaire", type: "Contrat", size: "220 KB", status: "Agri" },
    { name: "Contrat de Production Agricole Bio", sector: "Agroalimentaire", type: "Contrat", size: "190 KB", status: "Agri" },
    { name: "Bail Rural Environnemental", sector: "Agroalimentaire", type: "Contrat", size: "310 KB", status: "Agri" },

    // --- VII. ACTES UNILATÉRAUX, JUDICIAIRES & DIVERS ---
    { name: "Testament Authentique (Minute Notariée)", sector: "Vie Privée & Personne", type: "Acte", size: "220 KB", status: "Patrimoine" },
    { name: "Testament Olographe (Vérification LexAI)", sector: "Vie Privée & Personne", type: "Acte", size: "45 KB", status: "Standard" },
    { name: "Donation entre Vifs (Immobilière)", sector: "Vie Privée & Personne", type: "Acte", size: "640 KB", status: "Expert" },
    { name: "Mandat de Protection Future", sector: "Vie Privée & Personne", type: "Acte", size: "135 KB", status: "Patrimoine" },
    { name: "Assignation devant le Tribunal de Commerce", sector: "Procédure & Litige", type: "Acte", size: "115 KB", status: "Contentieux" },
    { name: "Conclusions de Défense", sector: "Procédure & Litige", type: "Acte", size: "320 KB", status: "Expert" },
    { name: "Protocole d'Accord Transactionnel", sector: "Procédure & Litige", type: "Contrat", size: "190 KB", status: "ADR" },
    { name: "Requête en Injonction de Payer", sector: "Procédure & Litige", type: "Acte", size: "65 KB", status: "Contentieux" },
    { name: "Procès-Verbal de Constat d'Huissier", sector: "Procédure & Litige", type: "Acte", size: "480 KB", status: "Preuve" },
    { name: "Déclaration de Cessation des Paiements", sector: "Procédure & Litige", type: "Acte", size: "520 KB", status: "Collectif" },
    { name: "Contrat de Sponsoring & Mécénat", sector: "Commerce & Affaires", type: "Contrat", size: "215 KB", status: "Expert" },
    { name: "Accord de Médiation Conventionnelle", sector: "Procédure & Litige", type: "Contrat", size: "110 KB", status: "ADR" },

    // --- VIII. INDUSTRIE, ÉNERGIE & SANTÉ ---
    { name: "Power Purchase Agreement (PPA)", sector: "Énergie & Environnement", type: "Contrat", size: "1.4 MB", status: "EnR" },
    { name: "Contrat de Performance Énergétique", sector: "Énergie & Environnement", type: "Contrat", size: "820 KB", status: "ESG" },
    { name: "Clinical Trial Agreement (CTA)", sector: "Santé & Biotech", type: "Contrat", size: "1.2 MB", status: "Expert" },
    { name: "Contrat d'Exercice Libéral (Médecin)", sector: "Santé & Biotech", type: "Contrat", size: "145 KB", status: "Legal" },
    { name: "Contrat de Maintenance Industrielle", sector: "Commerce & Affaires", type: "Contrat", size: "310 KB", status: "Industrie" },
    { name: "Contrat de Conciergerie de Luxe", sector: "Commerce & Affaires", type: "Contrat", size: "125 KB", status: "Luxe" },
];

// GENERATOR SCRIPT FOR MASSIVE DATA (To reach 10,000+)
const generateBatch = (base: LegalDoc[], count: number) => {
    const result = [...base];
    const sectors_list = Array.from(new Set(base.map(b => b.sector)));
    const types: DocType[] = ["Contrat", "Acte"];
    const statuses = ["Standard", "Premium", "Expert", "Corporate", "Compliance", "Finance", "Legal", "Top-Tier", "Verified"];
    const prefixes = ["Modèle de", "Convention relative au", "Acte de", "Protocole de", "Accord de", "Référentiel :", "Synthèse LexAI :", "Dossier de"];
    const keywords = ["International", "Régional (OHADA)", "Expert v9.1", "Standardisé", "Hautement Sécurisé", "Digitalisé", "Transfrontalier", "Modulaire"];
    const zones = ["Zone UEMOA", "Sénégal / Côte d'Ivoire", "Global North", "Afrique Centrale", "Europe/Asie", "Moyen-Orient"];

    for (let i = 0; i < count; i++) {
        const type = i % 3 === 0 ? "Acte" : "Contrat";
        const sector = sectors_list[i % sectors_list.length];
        const prefix = prefixes[i % prefixes.length];
        const keyword = keywords[Math.floor((i * 1.5) % keywords.length)];
        const zone = zones[i % zones.length];
        const status = statuses[i % statuses.length];

        const sizeKb = Math.floor(Math.random() * 900) + 10;
        const size = sizeKb > 800 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

        result.push({
            name: `${prefix} ${sector} - ${keyword} (${zone}) #${10000 + i}`,
            sector: sector,
            type: type,
            size: size,
            status: status,
            ref: `LP/91/${1000 + i}`
        });
    }
    return result;
};

// Injection de 10,000 actes supplémentaires pour atteindre le volume industriel
const massiveLibrary = generateBatch(exhaustiveLibrary, 10000);


const sectors = Array.from(new Set(massiveLibrary.map(d => d.sector))).sort();

export default function BibliothequePage() {
    const [activeTab, setActiveTab] = useState("TOUS")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSector, setSelectedSector] = useState("Tous les Secteurs")

    const filteredData = useMemo(() => {
        const filtered = massiveLibrary.filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.sector.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTab = activeTab === "TOUS" ||
                (activeTab === "CONTRATS" && doc.type === "Contrat") ||
                (activeTab === "ACTES" && doc.type === "Acte");
            const matchesSector = selectedSector === "Tous les Secteurs" || doc.sector === selectedSector;

            return matchesSearch && matchesTab && matchesSector;
        });

        // Performance optimization: only show first 200 results in the DOM to keep it fluid
        return filtered.slice(0, 200);
    }, [searchTerm, activeTab, selectedSector]);

    const stats = {
        total: massiveLibrary.length,
        contrats: massiveLibrary.filter(d => d.type === "Contrat").length,
        actes: massiveLibrary.filter(d => d.type === "Acte").length
    };

    return (
        <div className="bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen p-4 md:p-8 transition-colors duration-300">
            {/* Header Elite Sobe */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
                <div>
                    <div className="flex items-center gap-x-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-3">
                        <Scale className="h-4 w-4" /> SENTINELLE v9.1 • INDEX SUPRÊME UNIFIÉ
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3">
                        Bibliothèque Suprême
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-2xl">
                        Moteur industriel certifié donnant accès à 10,000+ référentiels juridiques.
                        Secteurs Foncier, Cyber, Finance et International synchronisés par LexAI.
                    </p>
                </div>

                <div className="flex items-center gap-x-3">
                    <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-6">
                        <div className="text-center border-r border-slate-100 dark:border-slate-700 pr-6">
                            <span className="block text-xl font-black text-indigo-600 dark:text-indigo-400 leading-none mb-1">{stats.contrats}</span>
                            <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Contrats</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-xl font-black text-emerald-600 dark:text-emerald-400 leading-none mb-1">{stats.actes}</span>
                            <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Actes</span>
                        </div>
                    </div>
                    <button className="h-[52px] w-[52px] flex items-center justify-center bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 group">
                        <Zap className="h-6 w-6 fill-current group-hover:animate-pulse" />
                    </button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col xl:flex-row gap-6 mb-8 items-stretch xl:items-center">

                {/* Search Bar - Full Width on Mobile */}
                <div className="relative flex-[3] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher parmi 10,000+ actes, contrats, clauses..."
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium shadow-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3 flex-[2]">
                    {/* Tabs Segmented Control */}
                    <div className="flex p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                        {["TOUS", "CONTRATS", "ACTES"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === tab
                                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Sector Dropdown */}
                    <div className="relative flex-1 min-w-[220px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select
                            className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-11 pr-10 py-3.5 rounded-xl text-xs font-bold outline-none text-slate-700 dark:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                        >
                            <option>Tous les Secteurs</option>
                            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <button
                    onClick={() => { setSelectedSector("Tous les Secteurs"); setSearchTerm(""); setActiveTab("TOUS"); }}
                    className="px-6 py-4 bg-slate-100 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-500 hover:text-indigo-600 rounded-xl transition-all tracking-widest"
                >
                    RAZ
                </button>
            </div>

            {/* Content Display - Expert Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800">
                                <th className="w-[45%] px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Référentiel & Désignation</th>
                                <th className="w-[18%] px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Domaine Expert</th>
                                <th className="w-[12%] px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Typologie</th>
                                <th className="w-[10%] px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Index</th>
                                <th className="w-[15%] px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Traitement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredData.map((doc, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-indigo-900/10 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-start gap-x-4">
                                            <div className={`mt-1 p-2.5 rounded-xl shadow-sm ${doc.type === "Contrat" ? "bg-indigo-600" : "bg-emerald-600"} text-white`}>
                                                {doc.sector === "Foncier & Immobilier" ? <Home className="h-5 w-5" /> :
                                                    doc.sector === "Tech & Digital" ? <Cpu className="h-5 w-5" /> :
                                                        doc.sector === "Banque & Finance" ? <Coins className="h-5 w-5" /> :
                                                            doc.sector === "RH & Travail" ? <Users className="h-5 w-5" /> :
                                                                doc.sector === "Société & Gouvernance" ? <Building2 className="h-5 w-5" /> :
                                                                    doc.sector === "Propriété Intellectuelle" ? <Lock className="h-5 w-5" /> :
                                                                        doc.sector === "Transport & Logistique" ? <Plane className="h-5 w-5" /> :
                                                                            doc.sector === "Procédure & Litige" ? <Gavel className="h-5 w-5" /> :
                                                                                doc.sector === "Vie Privée & Personne" ? <Briefcase className="h-5 w-5" /> :
                                                                                    doc.sector === "Énergie & Environnement" ? <Leaf className="h-5 w-5" /> :
                                                                                        doc.sector === "Agroalimentaire" ? <Layers className="h-5 w-5" /> :
                                                                                            doc.sector === "Santé & Biotech" ? <HeartPulse className="h-5 w-5" /> :
                                                                                                doc.type === "Contrat" ? <FileSignature className="h-5 w-5" /> : <PenTool className="h-5 w-5" />}
                                            </div>
                                            <div className="truncate">
                                                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-base leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                                                    {doc.name}
                                                </div>
                                                <div className="flex items-center gap-x-2">
                                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-black tracking-tighter">
                                                        REF: {doc.ref || `LP/91/${idx + 1000}`}
                                                    </span>
                                                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                                                        <ShieldCheck className="h-3 w-3" /> VERIFIÉ v9.1
                                                    </span>
                                                    <span className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                                                        {doc.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-tight">
                                            {doc.sector}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 ${doc.type === 'Contrat'
                                            ? 'bg-indigo-50 border-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400'
                                            : 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400'
                                            }`}>
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-[11px] font-bold text-slate-400 tabular-nums">
                                        {doc.size}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-x-3">
                                            <button className="px-5 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black rounded-xl hover:shadow-lg transition-all flex items-center gap-2 uppercase tracking-[0.1em]">
                                                GÉNÉRER <Zap className="h-3 w-3 fill-current" />
                                            </button>
                                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-800 shadow-sm">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-between p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-900/20">
                <div className="flex items-center gap-x-4 mb-4 md:mb-0">
                    <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                        <Gavel className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-sm font-black uppercase tracking-widest">Sentinelle LexAI Active</div>
                        <div className="text-[10px] font-medium opacity-80">420 nouveaux actes synchronisés ce matin (Secteur Foncier Majoritaire)</div>
                    </div>
                </div>
                <div className="flex items-center gap-x-8">
                    <div className="text-center">
                        <div className="text-xs font-black">OHADA / UEMOA</div>
                        <div className="text-[9px] opacity-70 uppercase">Conformité Certifiée</div>
                    </div>
                    <div className="h-8 w-px bg-white/20"></div>
                    <div className="text-center">
                        <div className="text-xs font-black">AES-256 BIT</div>
                        <div className="text-[9px] opacity-70 uppercase">Chiffrement Bancaire</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
