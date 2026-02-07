
"use client"

import { Cpu, FileSignature, Activity, Zap, ShieldCheck, Sparkles, Brain, Network, MessageSquare, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LexAIVisionPage() {
    return (
        <div className="pt-32 pb-24 px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 mb-6 uppercase tracking-widest">
                        Nexus Intelligence
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight">Lex<span className="text-amber-500">AI.</span></h1>
                    <p className="text-slate-400 text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
                        Plus qu'un assistant, un co-conseil virtuel doté d'une sagesse juridique infinie.
                    </p>
                </div>

                {/* AI Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                    <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-amber-500/10 transition-colors" />
                        <Bot className="h-12 w-12 text-amber-500 mb-8" />
                        <h3 className="text-3xl font-bold text-white mb-4">Co-Counsel Contextuel</h3>
                        <p className="text-slate-400 font-light leading-relaxed mb-6">
                            L'IA comprend l'intégralité de vos dossiers. Elle ne répond pas seulement à des questions, elle analyse VOS pièces pour en extraire des arguments stratégiques.
                        </p>
                    </div>
                    <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
                        <ShieldCheck className="h-12 w-12 text-indigo-400 mb-8" />
                        <h3 className="text-3xl font-bold text-white mb-4">Red Teaming Juridique</h3>
                        <p className="text-slate-400 font-light leading-relaxed mb-6">
                            Soumettez vos propres conclusions à "Le Procureur", notre IA hostile spécialisée dans la détection des failles de votre propre argumentation.
                        </p>
                    </div>
                    <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                        <Network className="h-12 w-12 text-emerald-500 mb-8" />
                        <h3 className="text-3xl font-bold text-white mb-4">Cartographie d'Arguments</h3>
                        <p className="text-slate-400 font-light leading-relaxed mb-6">
                            Visualisez la logique de votre dossier sous forme de carte neuronale interactive pour ne jamais perdre le fil de votre démonstration.
                        </p>
                    </div>
                    <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-rose-500/10 transition-colors" />
                        <Activity className="h-12 w-12 text-rose-500 mb-8" />
                        <h3 className="text-3xl font-bold text-white mb-4">Prédiction d'Issue</h3>
                        <p className="text-slate-400 font-light leading-relaxed mb-6">
                            Basé sur l'analyse de millions de mots de jurisprudence OHADA, estimez les probabilités de succès de votre litige.
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center p-20 rounded-[4rem] bg-gradient-to-tr from-amber-500 to-amber-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-3xl px-12 py-20 flex flex-col items-center justify-center text-center">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Le Futur n'attend pas.</h2>
                        <p className="text-white/80 text-lg mb-12 max-w-xl mx-auto font-light">
                            Rejoignez les cabinets d'élite qui utilisent déjà LexAI pour décupler leur puissance de travail.
                        </p>
                        <Link href="/login">
                            <Button className="h-16 px-12 bg-white text-slate-950 hover:bg-slate-100 font-black rounded-2xl text-xl shadow-2xl">
                                Découvrir LexAI en Action
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
