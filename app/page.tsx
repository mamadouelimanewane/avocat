
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
    HelpCircle
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
                    <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
                    <a href="#ia" className="hover:text-white transition-colors">Intelligence Artificielle</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Tarification</a>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-slate-300 hover:text-white">Connexion</Button>
                    </Link>
                    <Link href="/login">
                        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 border-none shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                            Essai Gratuit
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* 2. HERO SECTION */}
            <section className="relative pt-48 pb-32 px-6 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-amber-500/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black tracking-widest text-amber-400 mb-8 animate-pulse uppercase">
                        <Sparkles className="h-3 w-3" />
                        Propulsion IA Juridique Souveraine
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-10">
                        L'AVOCAT <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">AUGMENTÉ</span> <br /> EST ARRIVÉ.
                    </h1>
                    <p className="max-w-3xl mx-auto text-slate-400 text-lg md:text-2xl font-light leading-relaxed mb-12">
                        LexPremium fusionne l'excellence du droit avec la puissance de l'IA. Libérez votre temps, sécurisez vos actes et dominez vos dossiers.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/login">
                            <Button className="h-16 px-12 text-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl group transition-all shadow-2xl shadow-amber-500/20">
                                Commencer l'aventure
                                <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" className="h-16 px-10 text-xl border-white/10 hover:bg-white/5 text-white rounded-2xl">
                                Voir la démo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. PRODUCT PREVIEW SECTION (NEW) */}
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

            {/* 4. BENTO GRID FEATURES */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* FEATURE 1: IA COMPLEXE */}
                        <div className="md:col-span-8 group relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 p-12 border border-white/5 hover:border-white/10 transition-all">
                            <div className="relative z-10">
                                <Cpu className="h-12 w-12 text-indigo-400 mb-8" />
                                <h3 className="text-3xl font-black text-white mb-6">Intelligence sémantique</h3>
                                <p className="text-slate-400 text-lg font-light leading-relaxed max-w-lg">
                                    Notre IA ne se contente pas de chercher, elle comprend. Analyse de pièces adverses, détection de clauses abusives et recherche de jurisprudence en 0.1s.
                                </p>
                                <div className="mt-10 flex gap-4 text-xs font-bold text-indigo-300">
                                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">Jurisprudence CCJA</span>
                                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">OCR Haute Précision</span>
                                </div>
                            </div>
                            <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                                <Gavel className="w-96 h-96 text-indigo-500" />
                            </div>
                        </div>

                        {/* FEATURE 2: MOBILE */}
                        <div className="md:col-span-4 group relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 border border-white/5">
                            <div className="relative z-10">
                                <Smartphone className="h-12 w-12 text-amber-500 mb-8" />
                                <h3 className="text-3xl font-black text-white mb-6">Mobilité Palais</h3>
                                <p className="text-slate-400 text-lg font-light leading-relaxed">
                                    Vos dossiers, vos notes de plaidoirie et votre agenda disponibles partout, même au tribunal sans connexion.
                                </p>
                            </div>
                        </div>

                        {/* FEATURE 3: SECURE */}
                        <div className="md:col-span-12 group relative overflow-hidden rounded-[3rem] bg-slate-900/50 p-12 border border-white/5 flex flex-col md:flex-row items-center gap-16">
                            <div className="flex-1">
                                <ShieldCheck className="h-12 w-12 text-emerald-500 mb-8" />
                                <h3 className="text-3xl font-black text-white mb-6">Confidentialité de Niveau Militaire</h3>
                                <p className="text-slate-400 text-lg font-light leading-relaxed">
                                    Chaque octet de donnée est chiffré. LexPremium garantit le secret professionnel absolu grâce à une architecture distribuée et sécurisée.
                                </p>
                            </div>
                            <div className="flex gap-6">
                                <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 text-center">
                                    <Lock className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
                                    <div className="text-white font-bold">AES-256</div>
                                </div>
                                <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 text-center">
                                    <Globe className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
                                    <div className="text-white font-bold">Cloud Souverain</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. TESTIMONIALS (NEW) */}
            <section className="py-24 px-6 bg-slate-950/30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">La voix de vos pairs.</h2>
                            <p className="text-slate-500 text-lg font-light">Ils ont transformé leur cabinet avec LexPremium.</p>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-6 w-6 text-amber-500 fill-amber-500" />)}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-12 rounded-[3.5rem] bg-slate-900/50 border border-white/5 relative">
                            <Quote className="h-12 w-12 text-indigo-500/20 absolute top-8 left-8" />
                            <p className="text-xl text-slate-300 italic font-light mb-8 relative z-10">
                                "LexPremium a littéralement libéré mon cabinet. Ce que nous faisions en 2 jours de recherche juridique ne nous prend plus que 10 minutes avec LexAI."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-800" />
                                <div>
                                    <div className="text-white font-bold text-lg">Maître Mamadou Dia</div>
                                    <div className="text-indigo-400 text-sm">Avocat à la Cour, Cabinet Dia & Associés</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-12 rounded-[3.5rem] bg-slate-900/50 border border-white/5 relative">
                            <Quote className="h-12 w-12 text-amber-500/20 absolute top-8 left-8" />
                            <p className="text-xl text-slate-300 italic font-light mb-8 relative z-10">
                                "La gestion financière et le suivi des CARPA sont enfin fluides. L'interface mobile est un vrai bonheur lors de mes déplacements aux tribunaux."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-800" />
                                <div>
                                    <div className="text-white font-bold text-lg">Maître Sophie L.</div>
                                    <div className="text-amber-500 text-sm">Spécialiste Droit des Affaires</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FAQ STRATÉGIQUE (NEW) */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <HelpCircle className="h-12 w-12 text-indigo-400 mx-auto mb-6" />
                        <h2 className="text-4xl font-black text-white">Vos questions, notre expertise.</h2>
                    </div>
                    <div className="space-y-6">
                        {[
                            { q: "Est-ce conforme déontologiquement ?", r: "Absolument. LexPremium a été conçu pour respecter rigoureusement le secret professionnel et les règles de conservation des documents numériques des barreaux." },
                            { q: "Quid de la sécurité de mes données ?", r: "Données chiffrées en AES-256, hébergement souverain en Europe ou Afrique selon votre région, et sauvegardes quotidiennes inaltérables." },
                            { q: "Puis-je migrer mes anciens dossiers ?", r: "Oui. Nos ingénieurs accompagnent votre transition en important vos données depuis vos anciens outils (Excel, Word, Logiciels tiers) en moins de 48h." }
                        ].map((item, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/5">
                                <h4 className="text-lg font-bold text-white mb-3">{item.q}</h4>
                                <p className="text-slate-400 font-light leading-relaxed">{item.r}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. PRICING SECTION */}
            <section id="pricing" className="py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20 text-white">
                        <h2 className="text-5xl font-black mb-4">Tarification Transparente.</h2>
                        <p className="text-slate-500 text-xl font-light">Aucun frais caché. Annulez quand vous voulez.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {/* PLAN INDIVIDUEL */}
                        <div className="p-12 rounded-[4rem] bg-slate-900/40 border border-white/5 hover:border-white/20 transition-all flex flex-col items-center text-center">
                            <div className="text-indigo-400 font-black tracking-widest text-xs mb-6 uppercase">Individuel</div>
                            <div className="text-6xl font-black text-white mb-2">99€</div>
                            <div className="text-slate-500 mb-12">par mois, sans engagement</div>
                            <ul className="space-y-5 mb-12 text-left w-full">
                                <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Dossiers Illimités</li>
                                <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Assistant IA Premium</li>
                                <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Comptabilité & CARPA</li>
                            </ul>
                            <Link href="/login" className="w-full">
                                <Button variant="outline" className="w-full h-16 rounded-[2rem] border-white/10 text-white text-lg">Choisir Solo prestige</Button>
                            </Link>
                        </div>

                        {/* PLAN CABINET */}
                        <div className="p-12 rounded-[4rem] bg-indigo-600/10 border-2 border-amber-500/50 flex flex-col items-center text-center relative">
                            <div className="absolute top-8 right-12 bg-amber-500 text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">Offre Limitée</div>
                            <div className="text-amber-500 font-black tracking-widest text-xs mb-6 uppercase">Cabinet Associé</div>
                            <div className="text-6xl font-black text-white mb-2">299€</div>
                            <div className="text-amber-200/50 mb-12">Jusqu'à 5 avocats, facturation annuelle</div>
                            <ul className="space-y-5 mb-12 text-left w-full">
                                <li className="flex items-center gap-3 text-white font-medium"><CheckCircle2 className="h-5 w-5 text-amber-500" /> IA Illimitée & Red Teaming</li>
                                <li className="flex items-center gap-3 text-white font-medium"><CheckCircle2 className="h-5 w-5 text-amber-500" /> Support Prioritaire Dédié</li>
                                <li className="flex items-center gap-3 text-white font-medium"><CheckCircle2 className="h-5 w-5 text-amber-500" /> Signature Électronique Incluse</li>
                            </ul>
                            <Link href="/login" className="w-full">
                                <Button className="w-full h-16 rounded-[2rem] bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-lg shadow-2xl shadow-amber-500/20">Investir dans le Cabinet</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. CALL TO ACTION FINAL */}
            <section className="py-40 px-6">
                <div className="max-w-7xl mx-auto rounded-[5rem] bg-gradient-to-r from-indigo-700 to-indigo-900 p-24 md:p-32 text-center text-white relative overflow-hidden shadow-3xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <Sparkles className="h-16 w-16 text-amber-400/30 mx-auto mb-12 animate-pulse" />
                    <h2 className="text-6xl md:text-8xl font-black mb-12 relative z-10 leading-[0.9] tracking-tighter">
                        CONSTRUISONS <br /> VOTRE FUTUR.
                    </h2>
                    <Link href="/login">
                        <Button className="h-20 px-16 text-2xl bg-white text-indigo-700 hover:bg-slate-100 font-black rounded-3xl relative z-10 shadow-3xl transform hover:scale-105 transition-transform">
                            Demander une Démo gratuite
                        </Button>
                    </Link>
                    <p className="mt-12 text-indigo-200 text-xl font-light relative z-10">Rejoignez l'élite technologique du droit.</p>
                </div>
            </section>

            {/* 9. FOOTER */}
            <footer className="py-20 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-white">
                        <Scale className="h-8 w-8 text-amber-500" />
                        <span>LEX<span className="text-amber-500">PREMIUM</span></span>
                    </div>
                    <div className="flex gap-12 text-slate-500 text-sm">
                        <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
                        <a href="#" className="hover:text-white transition-colors">RGPD</a>
                        <a href="#" className="hover:text-white transition-colors">Sécurité</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                    <div className="text-slate-600 text-xs tracking-widest uppercase">
                        &copy; 2026 LexPremium. L'excellence au service de la justice.
                    </div>
                </div>
            </footer>
        </div>
    );
}
