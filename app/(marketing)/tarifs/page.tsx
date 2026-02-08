


import { CheckCircle2, Star, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TarifsPage() {
    return (
        <div className="pt-32 pb-24 px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">Investissez dans <span className="text-amber-500">votre Succès.</span></h1>
                    <p className="text-slate-400 text-xl font-light max-w-2xl mx-auto italic">
                        Des solutions adaptées à la taille de votre cabinet, sans frais cachés.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Solo Plan */}
                    <div className="p-12 rounded-[4rem] bg-slate-900/40 border border-white/5 hover:border-white/20 transition-all flex flex-col">
                        <div className="text-indigo-400 font-black tracking-widest text-[10px] mb-6 uppercase">Pratique Individuelle</div>
                        <h2 className="text-3xl font-bold text-white mb-2">Solo Prestige</h2>
                        <div className="mb-8">
                            <span className="text-5xl font-black text-white">50.000</span>
                            <span className="text-sm font-light text-slate-500 uppercase ml-2">F CFA / mois</span>
                        </div>
                        <ul className="space-y-4 mb-12 flex-1">
                            {["Dossiers illimités", "Clients illimités", "Assistant IA Standard", "Comptabilité OHADA", "Facturation", "Support Email"].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                                    <CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" /> {f}
                                </li>
                            ))}
                        </ul>
                        <Link href="/login">
                            <Button className="w-full h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10">Commencer</Button>
                        </Link>
                    </div>

                    {/* Elite Plan */}
                    <div className="p-12 rounded-[4rem] bg-indigo-600/10 border-2 border-amber-500 flex flex-col relative shadow-2xl shadow-amber-500/10">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-6 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Plus Populaire</div>
                        <div className="text-amber-500 font-black tracking-widest text-[10px] mb-6 uppercase">Cabinet Associé</div>
                        <h2 className="text-3xl font-bold text-white mb-2">Elite Cabinet</h2>
                        <div className="mb-8">
                            <span className="text-5xl font-black text-white">100.000</span>
                            <span className="text-sm font-light text-amber-500/50 uppercase ml-2">F CFA / mois</span>
                        </div>
                        <ul className="space-y-4 mb-12 flex-1">
                            {["Jusqu'à 10 collaborateurs", "IA Illimitée", "Red Teaming", "Portail Client Inclus", "Finance Stratégique", "Support 24/7"].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-white font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" /> {f}
                                </li>
                            ))}
                        </ul>
                        <Link href="/login">
                            <Button className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-xl shadow-amber-500/20">Lancer l'Elite</Button>
                        </Link>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="p-12 rounded-[4rem] bg-slate-900/40 border border-white/5 hover:border-white/20 transition-all flex flex-col">
                        <div className="text-emerald-400 font-black tracking-widest text-[10px] mb-6 uppercase">Grand Groupement</div>
                        <h2 className="text-3xl font-bold text-white mb-2">Lex Corporate</h2>
                        <div className="mb-8">
                            <span className="text-3xl font-black text-white">Sur Mesure</span>
                        </div>
                        <ul className="space-y-4 mb-12 flex-1">
                            {["Utilisateurs illimités", "Serveur dédié (Option)", "API & Intégrations", "Formation sur site", "Manager Dédié"].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> {f}
                                </li>
                            ))}
                        </ul>
                        <Link href="/contact">
                            <Button className="w-full h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10">Contacter la Vente</Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-slate-500 text-sm">Tous les prix sont en Francs CFA. Pas de frais de mise en route.</p>
                </div>
            </div>
        </div>
    );
}
