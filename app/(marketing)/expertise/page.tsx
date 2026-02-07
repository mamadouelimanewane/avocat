
"use client"

import { CheckCircle2, ShieldCheck, Zap, Globe, BarChart3, Users, Building, Gavel, Scale } from 'lucide-react';

export default function ExpertisePage() {
    const expertiseItems = [
        {
            title: "Gestion de Dossiers & Procédures",
            description: "Une centralisation absolue de vos dossiers avec un suivi procédural automatisé.",
            features: ["Agenda des audiences synchronisé", "Rappels automatiques de délais", "Historique complet des actions"],
            icon: Gavel,
            color: "text-amber-500"
        },
        {
            title: "Comptabilité Spécialisée OHADA",
            description: "Le seul logiciel intégrant nativement les écritures comptables conformes au SYSCOHADA révisé.",
            features: ["Journaux de banque et caisse", "Gestion de la CARPA", "Bilan et compte de résultat"],
            icon: BarChart3,
            color: "text-indigo-400"
        },
        {
            title: "Relation Client Elite",
            description: "Offrez une transparence totale à vos clients grâce à l'espace dédié.",
            features: ["Portail client sécurisé", "Partage de documents", "Messagerie cryptée"],
            icon: Users,
            color: "text-emerald-500"
        },
        {
            title: "Intelligence Juridique",
            description: "Exploitez la puissance de l'IA pour vos recherches et rédactions.",
            features: ["Analyse de jurisprudence", "Génération de clauses complexes", "Vérification de cohérence"],
            icon: Scale,
            color: "text-blue-500"
        }
    ];

    return (
        <div className="pt-32 pb-24 px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">Notre <span className="text-amber-500">Expertise.</span></h1>
                    <p className="text-slate-400 text-xl font-light max-w-2xl mx-auto italic">
                        Une technologie de pointe au service de la rigueur juridique.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {expertiseItems.map((item, idx) => (
                        <div key={idx} className="p-12 rounded-[3.5rem] bg-slate-900/50 border border-white/5 hover:border-amber-500/20 transition-all group">
                            <item.icon className={`h-16 w-16 ${item.color} mb-8 transform group-hover:scale-110 transition-transform`} />
                            <h2 className="text-3xl font-bold text-white mb-6">{item.title}</h2>
                            <p className="text-slate-400 text-lg font-light leading-relaxed mb-8">
                                {item.description}
                            </p>
                            <ul className="grid grid-cols-1 gap-4">
                                {item.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-3 text-slate-500 font-medium">
                                        <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Deep Expertise Section */}
                <div className="mt-32 p-16 rounded-[4rem] bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/10">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="text-4xl font-black text-white mb-8">Conformité Totale au Droit OHADA.</h2>
                            <p className="text-slate-400 leading-relaxed mb-8">
                                LexPremium a été conçu main dans la main avec des experts en comptabilité OHADA pour garantir que chaque centime, chaque journal et chaque état financier soit irréprochable face aux audits de la DGID.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="text-3xl font-black text-amber-500 mb-1">100%</div>
                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">OHADA Compliant</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-amber-500 mb-1">24/7</div>
                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Veille Juridique</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                                <Building className="h-64 w-64 text-white/5 relative z-10 mx-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
