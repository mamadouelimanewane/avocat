
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
    Sparkles
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
            <section className="relative pt-40 pb-32 px-6 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-amber-500/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-amber-400 mb-8 animate-pulse">
                        <Sparkles className="h-3 w-3" />
                        PROULSION IA JURIDIQUE SOUVERAINE
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
                        L'AVOCAT <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">AUGMENTÉ</span> <br className="hidden md:block" /> EST ARRIVÉ.
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-light leading-relaxed mb-12">
                        LexPremium fusionne l'excellence du droit avec la puissance de l'IA. Libérez votre temps, sécurisez vos actes et dominez vos dossiers sur n'importe quel appareil.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/login">
                            <Button className="h-16 px-10 text-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl group transition-all">
                                Commencer l'aventure
                                <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" className="h-16 px-10 text-lg border-white/10 hover:bg-white/5 text-white rounded-2xl">
                                Voir la démo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. BENTO GRID FEATURES */}
            <section id="features" className="py-24 px-6 bg-slate-950/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* FEATURE 1: DASHBOARD */}
                        <div className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-10 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="relative z-10 max-w-sm">
                                <Scale className="h-10 w-10 text-indigo-400 mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-4">Pilotage Visionnaire</h3>
                                <p className="text-slate-400 font-light leading-relaxed">
                                    Une vue 360° sur votre cabinet. Suivez vos dossiers, votre rentabilité et vos audiences via un tableau de bord prédictif ultra-moderne.
                                </p>
                            </div>
                            <div className="absolute right-[-10%] bottom-[-5%] w-[60%] opacity-20 group-hover:opacity-40 transition-opacity">
                                <BarChart3 className="w-full h-full text-indigo-500" />
                            </div>
                        </div>

                        {/* FEATURE 2: MOBILE */}
                        <div className="md:col-span-4 group relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 border border-white/5">
                            <div className="relative z-10">
                                <Smartphone className="h-10 w-10 text-amber-500 mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-4">Mobilité Totale</h3>
                                <p className="text-slate-400 font-light leading-relaxed">
                                    Vos dossiers vous suivent au Palais. Une interface fluide optimisée pour smartphone.
                                </p>
                            </div>
                            <div className="absolute -right-4 -bottom-4 animate-bounce">
                                <Smartphone className="h-32 w-32 text-amber-500/10" />
                            </div>
                        </div>

                        {/* FEATURE 3: IA */}
                        <div id="ia" className="md:col-span-4 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-slate-900 to-amber-950/20 p-10 border border-white/5">
                            <Cpu className="h-10 w-10 text-amber-400 mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-4">LexAI Intégrée</h3>
                            <p className="text-slate-400 font-light leading-relaxed">
                                Analyse automatique de pièces adverses et recherche juridique sémantique instantanée.
                            </p>
                        </div>

                        {/* FEATURE 4: SECURITY */}
                        <div className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-slate-900/80 p-10 border border-white/5">
                            <div className="flex flex-col md:flex-row gap-10 items-center">
                                <div className="max-w-md">
                                    <Lock className="h-10 w-10 text-emerald-500 mb-6" />
                                    <h3 className="text-2xl font-bold text-white mb-4">Sécurité Militaire</h3>
                                    <p className="text-slate-400 font-light leading-relaxed">
                                        Chiffrement de bout en bout et hébergement souverain haute disponibilité. Le secret professionnel est notre priorité absolue.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <ShieldCheck className="h-20 w-20 text-emerald-500/10" />
                                    <Zap className="h-20 w-20 text-amber-500/10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. IA SHOWCASE */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tight">L'IA QUI <span className="text-amber-500 italic">PENSE</span> AVEC VOUS.</h2>
                    <div className="grid md:grid-cols-3 gap-12 text-left">
                        <div className="space-y-4">
                            <div className="text-amber-500 font-black text-3xl">0.1s</div>
                            <div className="text-white font-bold">Vitesse de recherche</div>
                            <p className="text-sm text-slate-500 leading-relaxed">Analysez des milliers de précédents en une fraction de seconde.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-indigo-400 font-black text-3xl">99%</div>
                            <div className="text-white font-bold">Précision OCR</div>
                            <p className="text-sm text-slate-500 leading-relaxed">Chaque document papier scanné devient une donnée vivante.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-emerald-400 font-black text-3xl">80%</div>
                            <div className="text-white font-bold">Gain de Temps</div>
                            <p className="text-sm text-slate-500 leading-relaxed">Libérez-vous des tâches répétitives pour vous concentrer sur le conseil.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. PRICING SECTION */}
            <section id="pricing" className="py-32 px-6 bg-[#020617]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Investissez dans votre Excellence</h2>
                        <p className="text-slate-500 font-light italic">Choisissez le plan qui correspond à l'ambition de votre cabinet.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* PLAN INDIVIDUEL */}
                        <div className="p-10 rounded-[3rem] bg-slate-900/40 border border-white/5 hover:border-white/20 transition-all">
                            <div className="text-indigo-400 font-bold mb-4">SOLO PRESTIGE</div>
                            <div className="text-5xl font-black text-white mb-8">99€ <span className="text-sm text-slate-500 font-normal">/ mois</span></div>
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center gap-3 text-sm"><Star className="h-4 w-4 text-amber-500" /> Dossiers Illimités</li>
                                <li className="flex items-center gap-3 text-sm"><Star className="h-4 w-4 text-amber-500" /> Assistant IA (50 questions/j)</li>
                                <li className="flex items-center gap-3 text-sm"><Star className="h-4 w-4 text-amber-500" /> Accès Mobile Complet</li>
                                <li className="flex items-center gap-3 text-sm text-slate-600 italic">CARPA & Compta Inclus</li>
                            </ul>
                            <Link href="/login">
                                <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-white hover:bg-white/5">Choisir Solo</Button>
                            </Link>
                        </div>

                        {/* PLAN CABINET */}
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-950/40 to-slate-900/40 border-2 border-amber-500/30 relative">
                            <div className="absolute -top-4 right-10 bg-amber-500 text-slate-950 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Populaire</div>
                            <div className="text-amber-500 font-bold mb-4">CABINET ASSOCIÉ</div>
                            <div className="text-5xl font-black text-white mb-8">299€ <span className="text-sm text-slate-500 font-normal">/ mois</span></div>
                            <ul className="space-y-4 mb-10 text-slate-300">
                                <li className="flex items-center gap-3 text-sm font-bold text-white"><ArrowRight className="h-4 w-4 text-amber-500" /> Jusqu'à 5 Collaborateurs</li>
                                <li className="flex items-center gap-3 text-sm font-bold text-white"><ArrowRight className="h-4 w-4 text-amber-500" /> IA Illimitée & Red Teaming</li>
                                <li className="flex items-center gap-3 text-sm font-bold text-white"><ArrowRight className="h-4 w-4 text-amber-500" /> Support Prioritaire 24/7</li>
                                <li className="flex items-center gap-3 text-sm font-bold text-white"><ArrowRight className="h-4 w-4 text-amber-500" /> Archivage Légal Inclus</li>
                            </ul>
                            <Link href="/login">
                                <Button className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-[0_0_30px_rgba(245,158,11,0.2)]">Choisir Cabinet</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CALL TO ACTION FINAL */}
            <section className="py-32 px-6">
                <div className="max-w-6xl mx-auto rounded-[4rem] bg-gradient-to-r from-indigo-600 to-indigo-800 p-16 md:p-24 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <h2 className="text-5xl md:text-7xl font-black mb-8 relative z-10 leading-tight">
                        VOTRE CABINET D'AVOCATS <br /> N'A JAMAIS ÉTÉ AUSSI <span className="italic underline decoration-amber-400">PUISSANT</span>.
                    </h2>
                    <Link href="/login">
                        <Button className="h-16 px-12 text-xl bg-white text-indigo-700 hover:bg-indigo-50 font-black rounded-2xl relative z-10 shadow-2xl">
                            Demander une Démo
                        </Button>
                    </Link>
                    <p className="mt-8 text-indigo-200 font-light relative z-10">L'Excellence du Droit, Propulsée par l'IA.</p>
                </div>
            </section>

            {/* 7. FOOTER */}
            <footer className="py-12 px-6 border-t border-white/5 text-center text-slate-600 text-xs tracking-widest uppercase">
                &copy; 2026 LexPremium. L'excellence au service de la justice. Tous droits réservés.
            </footer>
        </div>
    );
}
