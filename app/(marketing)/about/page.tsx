


import { ShieldCheck, Target, Users, Scale, Award, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="pt-32 pb-24 px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight">Notre <span className="text-amber-500">Mission.</span></h1>
                    <p className="text-slate-400 text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
                        Redéfinir l'excellence juridique en Afrique grâce à l'innovation technologique et la rigueur du droit OHADA.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-8">L'Héritage rencontre l'Innovation.</h2>
                        <div className="space-y-6 text-slate-400 text-lg font-light leading-relaxed">
                            <p>
                                LexPremium est né de la vision de Maître Mamadou Dia, souhaitant offrir aux cabinets d'avocats africains des outils à la hauteur de leurs ambitions internationales.
                            </p>
                            <p>
                                Nous croyons que la technologie ne doit pas remplacer l'avocat, mais le libérer des tâches répétitives pour lui permettre de se concentrer sur son art : la stratégie et la plaidoirie.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/5 text-center">
                            <Target className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                            <div className="text-2xl font-black text-white tracking-widest">2026</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Fondation</div>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/5 text-center">
                            <Globe className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
                            <div className="text-2xl font-black text-white tracking-widest">17</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Pays OHADA</div>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/5 text-center">
                            <Users className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
                            <div className="text-2xl font-black text-white tracking-widest">500+</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Avocats</div>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/5 text-center">
                            <ShieldCheck className="h-10 w-10 text-rose-500 mx-auto mb-4" />
                            <div className="text-2xl font-black text-white tracking-widest">100%</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Sécurisé</div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-12">Nos Valeurs Fondamentales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <Award className="h-6 w-6 text-amber-500" />
                            </div>
                            <h4 className="text-white font-bold text-xl">Excellence</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">Nous ne tolérons aucune erreur, tant dans le code que dans le droit.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <Scale className="h-6 w-6 text-indigo-400" />
                            </div>
                            <h4 className="text-white font-bold text-xl">Éthique</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">L'IA est un outil éthique, transparent et Respectueux des secrets professionnels.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Zap className="h-6 w-6 text-emerald-500" />
                            </div>
                            <h4 className="text-white font-bold text-xl">Innovation</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">Anticiper les besoins futurs du barreau pour rester toujours en avance.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
