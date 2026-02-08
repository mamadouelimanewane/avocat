


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

export default function HomePage() {
    return (
        <>
            {/* HERO SECTION */}
            <section className="relative pt-48 pb-32 px-6 overflow-hidden text-center">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-amber-500/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

                <div className="max-w-6xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black tracking-widest text-amber-400 mb-8 animate-pulse uppercase">
                        <Sparkles className="h-3 w-3" />
                        L'EXCELLENCE JURIDIQUE À L'ÈRE DE L'IA
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-10">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">VOUS PLAIDEZ,</span><br /> NOUS GÉRONS.
                    </h1>
                    <p className="max-w-3xl mx-auto text-slate-400 text-lg md:text-2xl font-light leading-relaxed mb-12">
                        Concentrez-vous sur votre art, la plaidoirie et la stratégie juridique. LexPremium gère vos dossiers, votre comptabilité OHADA, vos clients et votre croissance. Propulsé par l'Intelligence Artificielle et les innovations qui redéfinissent le métier.
                    </p>
                    {/* Button Removed per user request */}
                </div>
            </section>

            {/* PRODUCT PREVIEW SECTION */}
            <section className="py-12 px-6">
                <div className="max-w-7xl mx-auto relative">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-[150px] -z-10 rounded-full" />
                    <div className="rounded-[3rem] border border-white/10 bg-slate-900/50 p-24 shadow-2xl backdrop-blur-sm overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
                        <Scale className="h-48 w-48 text-amber-500/20 mb-8 animate-pulse" />
                        <div className="text-3xl font-black text-white/40 tracking-widest uppercase">LexPremium Excellence</div>
                    </div>
                </div>
            </section>

            {/* KEY MODULES SECTION */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Une Solution, <span className="text-amber-500">Zéro Compromis.</span></h2>
                        <p className="text-slate-500 text-lg font-light max-w-2xl mx-auto">
                            Plus besoin de multiplier les logiciels. LexPremium centralise chaque aspect de votre métier.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* 1. GESTION MODERNE DES DOSSIERS */}
                        <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 hover:border-amber-500/20 transition-all flex flex-col">
                            <Users className="h-12 w-12 text-emerald-500 mb-8" />
                            <h3 className="text-2xl font-bold text-white mb-4">Gestion Moderne des Dossiers</h3>
                            <p className="text-slate-400 font-light leading-relaxed mb-6">
                                Offrez à vos clients un **Extranet dédié**. Consultation de l'avancement, dépôt de pièces et paiements sécurisés 24h/24.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-500 mt-auto">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Innovation Client 360°</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Diligences & Temps Automatisés</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Portail Client Interactif</li>
                            </ul>
                        </div>

                        {/* 2. AIDE À LA PLAIDOIRIE & IA */}
                        <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 hover:border-amber-500/20 transition-all flex flex-col">
                            <PenTool className="h-12 w-12 text-amber-500 mb-8" />
                            <h3 className="text-2xl font-bold text-white mb-4">Aide à la Plaidoirie & IA</h3>
                            <p className="text-slate-400 font-light leading-relaxed mb-6">
                                **Génération d'actes intelligente** et outils de rédaction. Chronomètre de plaidoirie pour une maîtrise totale de l'audience.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-500 mt-auto">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> LexAI Co-Counsel & Strategist</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Rédaction Augmentée par IA</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Analyse de Pièces & OSINT</li>
                            </ul>
                        </div>

                        {/* 3. FINANCES & COMPTABILITÉ */}
                        <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 hover:border-amber-500/20 transition-all flex flex-col">
                            <Calculator className="h-12 w-12 text-indigo-400 mb-8" />
                            <h3 className="text-2xl font-bold text-white mb-4">Finances & Comptabilité</h3>
                            <p className="text-slate-400 font-light leading-relaxed mb-6">
                                Gestion intégrale conforme aux normes **OHADA & SYSCOHADA**. Suivi des journaux, CARPA, et bilan de rentabilité automatique.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-500 mt-auto">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Facturation & CARPA Intégrée</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Recouvrement Massif Automatisé</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Analyse de Rentabilité Directe</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* IA & INTELLIGENCE SECTION */}
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
                                    <div className="h-full bg-amber-500" style={{ width: '85%' }} />
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

            {/* PRICING PREVIEW */}
            <section id="pricing" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Tarification Claire.</h2>
                        <p className="text-slate-500 text-lg font-light">L'excellence accessible, quel que soit votre stade de croissance.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 flex flex-col items-center">
                            <span className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-4">Solo Prestige</span>
                            <div className="text-4xl font-black text-white mb-6">50.000 <span className="text-xs text-slate-500">F CFA / mois</span></div>
                            <Link href="/tarifs">
                                <Button className="bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl px-8 border border-white/10">Voir les détails</Button>
                            </Link>
                        </div>
                        <div className="p-10 rounded-[3rem] bg-amber-500/10 border border-amber-500/50 flex flex-col items-center">
                            <span className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-4">Elite Cabinet</span>
                            <div className="text-4xl font-black text-white mb-6">100.000 <span className="text-xs text-slate-500">F CFA / mois</span></div>
                            <Link href="/tarifs">
                                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl px-8">Voir les détails</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
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
                                    <div className="text-white font-bold text-lg">Maître Fatou B.</div>
                                    <div className="text-amber-500 text-sm">Expertise Droit Immobilier & OHADA</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto text-center p-20 rounded-[4rem] bg-gradient-to-br from-indigo-600 to-indigo-900 border border-white/10 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Votre Succès, Notre <span className="text-amber-500">Priorité.</span></h2>
                        <p className="text-indigo-100 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto">
                            Discutez avec nos experts pour découvrir comment LexPremium peut propulser votre cabinet vers de nouveaux sommets.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/contact">
                                <Button className="h-16 px-12 text-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20">
                                    Prendre Rendez-vous
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
