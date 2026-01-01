
"use client"

import Link from 'next/link';
import {
    Scale,
    ShieldCheck,
    Zap,
    Smartphone,
    Globe,
    BarChart3,
    Gavel,
    ChevronRight,
    Star,
    ArrowRight,
    Cpu,
    Lock,
    Sparkles,
    CheckCircle2,
    Quote,
    HelpCircle,
    Calculator,
    Calendar,
    PenTool,
    Users,
    Activity,
    FileSignature
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden">
            {/* 1. NAVIGATION */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
                    <Scale className="h-6 w-6 text-amber-500" />
                    <span>LEX<span className="text-amber-500">PREMIUM</span></span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                    <a href="#features" className="hover:text-white transition-colors">Expertise</a>
                    <a href="#ia" className="hover:text-white transition-colors">IA & Outils</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Plans CFA</a>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-slate-300 hover:text-white">Accès Cabinet</Button>
                    </Link>
                    <Link href="/login">
                        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 border-none shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                            Essai Gratuit
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* 2. HERO SECTION */}
            <section className="relative pt-48 pb-32 px-6 overflow-hidden text-center">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-amber-500/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

                <div className="max-w-6xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black tracking-widest text-amber-400 mb-8 animate-pulse uppercase">
                        <Sparkles className="h-3 w-3" />
                        L'EXCELLENCE JURIDIQUE À L'ÈRE DE L'IA
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-10">
                        LE CABINET <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">SANS LIMITES.</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-slate-400 text-lg md:text-2xl font-light leading-relaxed mb-12">
                        Comptabilité OHADA, Intelligence Artificielle, Finance et Mobilité. LexPremium est l'écosystème complet conçu pour les cabinets d'avocats d'élite.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/login">
                            <Button className="h-16 px-12 text-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl group transition-all shadow-2xl shadow-amber-500/20">
                                Lancer mon Cabinet Numérique
                                <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. PRODUCT PREVIEW SECTION */}
            <section className="py-12 px-6">
                <div className="max-w-7xl mx-auto relative">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-[150px] -z-10 rounded-full" />
                    <div className="rounded-[3rem] border border-white/10 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-sm overflow-hidden group">
                        <img
                            src="https://lex-premium-assets.s3.amazonaws.com/lexpremium_product_preview.png"
                            alt="Interface LexPremium"
                            className="w-full h-auto rounded-[2.5rem] shadow-inner transform group-hover:scale-[1.01] transition-transform duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* 4. KEY MODULES SECTION (ACCOUNTING, FINANCE, TOOLS) */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Une Solution, <span className="text-amber-500">Zéro Compromis.</span></h2>
                        <p className="text-slate-500 text-lg font-light max-w-2xl mx-auto">
                            Plus besoin de multiplier les logiciels. LexPremium centralise chaque aspect de votre métier.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* COMPTABILITÉ & FINANCE */}
                        <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 hover:border-amber-500/20 transition-all">
                            <Calculator className="h-12 w-12 text-indigo-400 mb-8" />
                            <h3 className="text-2xl font-bold text-white mb-4">Comptabilité & Finance</h3>
                            <p className="text-slate-400 font-light leading-relaxed mb-6">
                                Gestion intégrale conforme aux normes **OHADA & SYSCOHADA**. Suivi des journaux, CARPA, et bilan de rentabilité automatique.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Grand Livre & Balance</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Analyse de Trésorerie</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Facturation & Recouvrement</li>
                            </ul>
                        </div>

                        {/* OUTILS D'AIDE À L'AVOCAT */}
                        <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 hover:border-amber-500/20 transition-all">
                            <PenTool className="h-12 w-12 text-amber-500 mb-8" />
                            <h3 className="text-2xl font-bold text-white mb-4">Aide à la Plaidoirie</h3>
                            <p className="text-slate-400 font-light leading-relaxed mb-6">
                                **Génération d'actes intelligente** et outils de rédaction. Chronomètre de plaidoirie pour une maîtrise totale de l'audience.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Agenda Procédural Smart</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Bible des Modèles & Clauses</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Simulateur de Frais & Actes</li>
                            </ul>
                        </div>

                        {/* PORTAIL CLIENT EXTRANET */}
                        <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 hover:border-amber-500/20 transition-all">
                            <Users className="h-12 w-12 text-emerald-500 mb-8" />
                            <h3 className="text-2xl font-bold text-white mb-4">Portail Client Sécurisé</h3>
                            <p className="text-slate-400 font-light leading-relaxed mb-6">
                                Offrez à vos clients un **Extranet dédié**. Consultation de l'avancement, dépôt de pièces et paiements sécurisés 24h/24.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Suivi Temps Réel</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Coffre-fort Numérique</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Relation Client Optimisée</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. IA & INTELLIGENCE SECTION */}
            <section id="ia" className="py-24 px-6 relative overflow-hidden bg-slate-950/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 mb-6 uppercase tracking-widest">
                            Futurisme Juridique
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">L'Intelligence Artificielle <br /> <span className="text-amber-500">votre nouveau Collaborateur.</span></h2>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                    <Cpu className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-2">LexAI : Analyse de Pièces</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed text-balance">Extractions instantanées, résumés de conclusions et détection d'incohérences sémantiques.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                    <FileSignature className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-2">Aide à la Rédaction</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed text-balance">Saisie vocale intelligente et génération dynamique d'actes basés sur votre jurisprudence.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-amber-500/10 blur-[120px] rounded-full animate-pulse" />
                        <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-12 relative z-10 shadow-3xl">
                            <div className="flex items-center gap-3 mb-8">
                                <Activity className="h-8 w-8 text-amber-500" />
                                <div className="text-white font-bold text-2xl tracking-tight">LexMonitor</div>
                            </div>
                            <div className="space-y-6">
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 animate-progress" style={{ width: '85%' }} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Précision</div>
                                        <div className="text-2xl text-white font-black">99.8%</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Temps Gain</div>
                                        <div className="text-2xl text-white font-black">+14h<span className="text-xs text-slate-500">/sem</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. PRICING SECTION - CFA FRANCS */}
            <section id="pricing" className="py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20 text-white">
                        <h2 className="text-5xl font-black mb-4">Tarification Locale.</h2>
                        <p className="text-slate-500 text-xl font-light italic">L'excellence accessible à chaque Cabinet.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                        {/* PLAN INDIVIDUEL - 50,000 CFA */}
                        <div className="p-12 rounded-[4rem] bg-slate-900/40 border border-white/5 hover:border-white/20 transition-all flex flex-col items-center text-center">
                            <div className="text-indigo-400 font-black tracking-widest text-xs mb-6 uppercase">Individuel Prestige</div>
                            <div className="text-5xl font-black text-white mb-2">50.000 <span className="text-xl font-light text-slate-500 uppercase">F CFA</span></div>
                            <div className="text-slate-500 mb-12 italic">par mois, sans engagement</div>
                            <ul className="space-y-5 mb-12 text-left w-full text-slate-400">
                                <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Dossiers & Clients Illimités</li>
                                <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Assistant IA (Mode Standard)</li>
                                <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Comptabilité OHADA Basique</li>
                                <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Facturation & Recouvrement</li>
                            </ul>
                            <Link href="/login" className="w-full">
                                <Button variant="outline" className="w-full h-16 rounded-[2rem] border-white/10 text-white text-lg">Choisir Solo</Button>
                            </Link>
                        </div>

                        {/* PLAN CABINET - 100,000 CFA */}
                        <div className="p-12 rounded-[4rem] bg-indigo-600/10 border-2 border-amber-500/50 flex flex-col items-center text-center relative shadow-2xl shadow-amber-500/10">
                            <div className="absolute top-8 right-12 bg-amber-500 text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">Elite</div>
                            <div className="text-amber-500 font-black tracking-widest text-xs mb-6 uppercase">Cabinet Associé</div>
                            <div className="text-5xl font-black text-white mb-2">100.000 <span className="text-xl font-light text-amber-500/50 uppercase">F CFA</span></div>
                            <div className="text-amber-200/50 mb-12 italic">Jusqu'à 10 collaborateurs</div>
                            <ul className="space-y-5 mb-12 text-left w-full text-slate-300">
                                <li className="flex items-center gap-3 text-sm font-bold text-white"><CheckCircle2 className="h-5 w-5 text-amber-500" /> IA Illimitée & Red Teaming</li>
                                <li className="flex items-center gap-3 text-sm font-bold text-white"><CheckCircle2 className="h-5 w-5 text-amber-500" /> Portail Client Extranet Inclus</li>
                                <li className="flex items-center gap-3 text-sm font-bold text-white"><CheckCircle2 className="h-5 w-5 text-amber-500" /> Finance Stratégique & Budgets</li>
                                <li className="flex items-center gap-3 text-sm font-bold text-white"><CheckCircle2 className="h-5 w-5 text-amber-500" /> Support Premium 24/7</li>
                            </ul>
                            <Link href="/login" className="w-full">
                                <Button className="w-full h-16 rounded-[2rem] bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-lg shadow-2xl shadow-amber-500/20">Lancer le Cabinet</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. TESTIMONIALS */}
            <section className="py-24 px-6 bg-slate-950/30">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-12 rounded-[3.5rem] bg-slate-900/50 border border-white/5 relative">
                            <Quote className="h-12 w-12 text-indigo-500/20 absolute top-8 left-8" />
                            <p className="text-xl text-slate-300 italic font-light mb-8 relative z-10">
                                "LexPremium a transformé notre gestion des dossiers OHADA. La comptabilité intégrée et l'agenda smart nous font gagner une journée par semaine."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-800" />
                                <div>
                                    <div className="text-white font-bold text-lg">Maître Mamadou Dia</div>
                                    <div className="text-indigo-400 text-sm">Associé Gérant, Cabinet Dia & Partners</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-12 rounded-[3.5rem] bg-slate-900/50 border border-white/5 relative">
                            <Quote className="h-12 w-12 text-amber-500/20 absolute top-8 left-8" />
                            <p className="text-xl text-slate-300 italic font-light mb-8 relative z-10">
                                "L'Extranet client change tout. Mes clients peuvent voir l'état de leurs dossiers en temps réel sans m'appeler. Un gain d'image inestimable."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-800" />
                                <div>
                                    <div className="text-white font-bold text-lg">Maître Sophie L.</div>
                                    <div className="text-amber-500 text-sm">Expertise Droit Immobilier</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. FOOTER */}
            <footer className="py-20 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                    <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-white">
                        <Scale className="h-8 w-8 text-amber-500" />
                        <span>LEX<span className="text-amber-500">PREMIUM</span></span>
                    </div>
                    <div className="flex gap-12 text-slate-500 text-sm">
                        <a href="#features" className="hover:text-white">Expertise</a>
                        <a href="#ia" className="hover:text-white">LexAI</a>
                        <a href="#pricing" className="hover:text-white">Tarifs CFA</a>
                    </div>
                    <div className="text-slate-600 text-[10px] tracking-widest uppercase font-black">
                        &copy; 2026 LexPremium. L'excellence au service de la justice OHADA.
                    </div>
                </div>
            </footer>
        </div>
    );
}
