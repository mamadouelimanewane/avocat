"use client"

import {
    Search,
    Scale,
    Gavel,
    ShieldCheck,
    Building2,
    Briefcase,
    Zap,
    ScrollText,
    Globe,
    Lock,
    Hammer,
    Wallet,
    Truck,
    Cpu,
    UserCircle,
    Gavel as GavelIcon,
    FileStack,
    History,
    Cloud,
    Fingerprint,
    Info,
    Binary,
    ShieldAlert,
    Eye,
    ShoppingCart,
    Layers,
    Bot,
    Gamepad2,
    Network,
    Leaf,
    Landmark,
    Home,
    Key,
    Navigation,
    Shield,
    Music,
    Film,
    Newspaper,
    Stethoscope,
    FlaskConical,
    Wheat,
    Plane,
    Hotel,
    Users,
    Activity,
    Trophy,
    HeartPulse,
    Star,
    Edit
} from "lucide-react"
import { useState, useMemo } from "react"
import Link from 'next/link'

interface Document {
    name: string;
    type: string;
    size: string;
    status: string;
    link: string;
    isCustom?: boolean;
    id?: string;
}

interface Section {
    category: string;
    icon: any;
    color: string;
    bg: string;
    documents: Document[];
}

export default function LibraryClient({
    initialLibraryData,
    customTemplates
}: {
    initialLibraryData: Section[],
    customTemplates: any[]
}) {
    const [searchTerm, setSearchTerm] = useState("")

    // Map custom templates to library structure
    const customDocs: Document[] = customTemplates.map(t => ({
        name: t.name,
        type: "DOCX",
        size: "DB",
        status: "Cabinet",
        link: `/modeles/${t.id}`,
        isCustom: true,
        id: t.id
    }))

    const customSection: Section = {
        category: "Mes Modèles (Cabinet)",
        icon: Star,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        documents: customDocs
    }

    // --- MASSIVE SCALING ENGINE v9.1 ---
    const generateMoreDocs = (sections: Section[], totalTarget: number) => {
        const result = [...sections];
        const prefixes = ["Modèle de", "Convention", "Acte de", "Protocole", "Accord", "Référentiel", "Synthèse"];
        const keywords = ["International", "Régional", "Expert v9.1", "Standardisé", "Sécurisé", "Digitalisé"];
        const zones = ["Zone UEMOA", "Sénégal", "Afrique Centrale", "Global"];

        let currentTotal = sections.reduce((acc, s) => acc + s.documents.length, 0);
        let i = 0;

        while (currentTotal < totalTarget) {
            const sectionIndex = (i % (sections.length - 1)) + 1; // Avoid customSection
            const section = result[sectionIndex];

            const name = `${prefixes[i % prefixes.length]} ${section.category} - ${keywords[i % keywords.length]} (${zones[i % zones.length]}) #${10000 + i}`;

            section.documents.push({
                name,
                type: i % 2 === 0 ? "DOCX" : "PDF",
                size: `${Math.floor(Math.random() * 900) + 10} KB`,
                status: "Certified",
                link: "#"
            });

            currentTotal++;
            i++;
        }
        return result;
    };

    // Global Library Data with 10,000 items
    const allLibraryData = useMemo(() => {
        const base = [customSection, ...initialLibraryData];
        return generateMoreDocs(base, 10000);
    }, [initialLibraryData, customDocs.length]);

    const totalCount = useMemo(() =>
        allLibraryData.reduce((acc, s) => acc + s.documents.length, 0),
        [allLibraryData]
    );

    return (
        <div className="p-0 bg-background text-foreground min-h-screen">
            {/* Massive Hero Header */}
            <div className="mb-20 relative pt-10 px-8">
                <div className="flex flex-col xl:flex-row items-start justify-between gap-12">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em]">
                            <History className="h-4 w-4 animate-spin-slow" /> Library Sentinelle v9.1 - Moteur Industriel Unifié
                        </div>
                        <h2 className="text-7xl font-black tracking-tighter leading-[0.8] mb-6">
                            L'Arsenal Juris <br />
                            <span className="text-secondary italic">de {totalCount.toLocaleString()}+ Actes</span>
                        </h2>
                        <p className="text-xl text-muted-foreground font-light max-w-4xl leading-relaxed">
                            Système unifié : Accédez à l'index mondial Sentinelle ET à vos modèles personnels.
                            La puissance de la donnée globale (+10k actes) alliée à votre expertise métier.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="px-6 py-4 bg-muted border border-border rounded-3xl flex items-center gap-x-3 shadow-sm hover:shadow-md transition-all">
                                <Star className="h-5 w-5 text-amber-500" />
                                <div className="flex flex-col">
                                    <span className="text-lg font-black leading-none">{customDocs.length}</span>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Modèles Cabinet</span>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-muted border border-border rounded-3xl flex items-center gap-x-3 shadow-sm hover:shadow-md transition-all">
                                <Binary className="h-5 w-5 text-secondary" />
                                <div className="flex flex-col">
                                    <span className="text-lg font-black leading-none">{(totalCount - customDocs.length).toLocaleString()}</span>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Actes Sentinelle</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Visual Card */}
                    <div className="w-full xl:w-[450px] h-[450px] bg-[#020617] rounded-[5rem] p-12 text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border border-white/5 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="p-5 bg-white/5 rounded-3xl w-fit backdrop-blur-md border border-white/10">
                                <Zap className="h-12 w-12 text-secondary animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-4xl font-black leading-[0.9] mb-6 tracking-tighter">Forge <br />Industrielle</h4>
                                <p className="text-md font-light opacity-50 pr-4">Unification totale de vos actifs juridiques. Générez, modifiez et archivez vos actes avec une vélocité sans précédent.</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
                    </div>
                </div>
            </div>

            {/* Search Bar - Fixed Top Style */}
            <div className="sticky top-4 z-50 mb-24 px-8">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-primary to-emerald-500 rounded-[3.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                        <Search className="absolute left-10 top-1/2 -translate-y-1/2 h-10 w-10 text-primary opacity-50" />
                        <input
                            type="text"
                            placeholder="RECHERCHER DANS L'ARSENAL : 'VEFA', 'LBO', 'IA', 'Smart Contract'..."
                            className="w-full pl-24 p-12 bg-background/90 backdrop-blur-3xl border-2 border-border/50 rounded-[3rem] focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-2xl text-3xl font-black placeholder:font-light tracking-tight selection:bg-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex gap-4">
                            <Link href="/modeles/nouveau" className="px-6 py-4 bg-muted border border-border text-foreground rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-background transition-all">Nouveau</Link>
                            <div className="px-6 py-4 bg-primary text-white rounded-2xl text-sm font-black shadow-2xl shadow-primary/40 uppercase tracking-widest hover:scale-105 active:scale-95 transition-all cursor-pointer">Recherche IA</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid of Results */}
            <div className="columns-1 md:columns-2 xl:columns-3 2xl:columns-4 gap-10 space-y-10 px-8 pb-20">
                {allLibraryData.map((section) => {
                    // Optimized filtering: only search and show first 50 results PER CATEGORY to keep the UI snappy
                    const filteredDocs = section.documents
                        .filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .slice(0, 50);

                    if (filteredDocs.length === 0) return null;

                    return (
                        <div key={section.category} className="break-inside-avoid flex flex-col">
                            <div className="flex items-center gap-x-4 mb-8 pl-6">
                                <div className={`p-5 rounded-[2rem] ${section.bg} shadow-lg shadow-black/5`}>
                                    <section.icon className={`h-10 w-10 ${section.color}`} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground leading-none">{section.category}</h3>
                                    <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                        {section.category === "Mes Modèles (Cabinet)" ? "PROPRIÉTÉ PRIVÉE" : "SENTINELLE INDEXED"}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {filteredDocs.map((doc, idx) => (
                                    <div key={doc.name + idx} className={`p-10 bg-background border ${doc.isCustom ? 'border-amber-500/30' : 'border-border'} rounded-[3.5rem] hover:border-primary/50 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all group relative overflow-hidden flex flex-col justify-between hover:-translate-y-4 duration-500`}>
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border ${doc.isCustom ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-primary/5 text-primary border-primary/10'}`}>
                                                    {doc.status}
                                                </div>
                                                <div className="flex items-center gap-x-2">
                                                    <span className={`w-2.5 h-2.5 ${doc.isCustom ? 'bg-amber-500' : 'bg-secondary'} rounded-full animate-pulse shadow-glow`}></span>
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase opacity-80 tracking-tighter">
                                                        {doc.isCustom ? "DB TEMPLATE" : "CERTIFIED v9.1"}
                                                    </span>
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-2xl leading-tight group-hover:text-primary transition-colors mb-8 tracking-tight pr-6">{doc.name}</h4>
                                        </div>

                                        <div className="flex items-center gap-x-4 mt-auto relative z-10">
                                            {doc.isCustom ? (
                                                <Link href={`/modeles/${doc.id}`} className="flex-1 flex items-center justify-center gap-x-3 py-5 bg-muted border border-border rounded-3xl text-[11px] font-black hover:bg-background transition-all active:scale-95 uppercase tracking-widest">
                                                    MODIFIER <Edit className="h-4 w-4" />
                                                </Link>
                                            ) : (
                                                <button className="flex-1 flex items-center justify-center gap-x-3 py-5 bg-muted border border-border rounded-3xl text-[11px] font-black hover:bg-background transition-all active:scale-95 uppercase tracking-widest">
                                                    REF: {1000 + idx}
                                                </button>
                                            )}

                                            <button className="flex-[2] flex items-center justify-center gap-x-3 py-5 bg-primary text-white rounded-3xl text-[11px] font-black hover:opacity-90 transition-all shadow-2xl shadow-primary/30 active:scale-95 uppercase tracking-widest">
                                                GÉNÉRER <Zap className="h-4 w-4 fill-current" />
                                            </button>
                                        </div>
                                        {/* Abstract background motif */}
                                        <div className={`absolute -top-10 -right-10 w-48 h-48 ${doc.isCustom ? 'bg-amber-500/5' : 'bg-primary/2'} rounded-full group-hover:opacity-20 transition-all duration-700 blur-3xl`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty state */}
            {allLibraryData.every(s => s.documents.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0) && (
                <div className="text-center py-80 border-4 border-dashed border-muted rounded-[6rem] bg-muted/10 mx-10">
                    <FileStack className="h-60 w-60 text-muted-foreground/5 mx-auto mb-10 animate-pulse" />
                    <h3 className="text-7xl font-black text-muted-foreground/20 italic tracking-tighter">INDEX RECHERCHÉ VIDE</h3>
                    <p className="text-muted-foreground font-light text-3xl mt-8">Aucun résultat dans vos modèles ou dans l'index Sentinelle.</p>
                </div>
            )}

            {/* Industrial & Energy Banner */}
            <div className="mt-20 mx-8 p-16 bg-[#0a0a0a] rounded-[6rem] text-white relative overflow-hidden group shadow-[0_60px_120px_-30px_rgba(0,0,0,1)] border border-white/5">
                <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-16">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-x-5 mb-10">
                            <div className="p-6 bg-primary/20 rounded-[2.5rem] backdrop-blur-3xl">
                                <Activity className="h-16 w-16 text-primary" />
                            </div>
                            <h3 className="text-7xl font-black tracking-tighter leading-[0.7]">Moteur Industriel <br /><span className="text-secondary italic">LexAI v9.1</span></h3>
                        </div>
                        <p className="text-3xl text-slate-400 font-light leading-tight mb-14 pr-10">
                            Déploiement global : +10,000 référentiels synchronisés. Votre expertise cabinet est désormais propulsée par l'index le plus dense du marché.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-8 bg-white/5 p-12 rounded-[5rem] border border-white/10 backdrop-blur-3xl">
                        <div className="text-center">
                            <span className="text-xs font-black text-secondary uppercase tracking-[0.5em] mb-4 block">Capacité Totale</span>
                            <div className="text-7xl font-black tracking-tighter">{totalCount.toLocaleString()}+</div>
                        </div>
                        <button className="whitespace-nowrap px-16 py-10 bg-secondary text-slate-900 font-black rounded-[3.5rem] hover:scale-105 active:scale-95 transition-all text-2xl shadow-[0_0_100px_-20px_rgba(234,179,8,0.7)] group-hover:rotate-1">
                            MAINTENANCE ACTIVE
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Tag */}
            <div className="mt-20 text-center pb-10">
                <span className="text-[10px] font-black uppercase tracking-[1em] text-muted-foreground opacity-30">LexPremium Pro • Unification v9.1.0 • Archive & Forge</span>
            </div>
        </div>
    )
}
