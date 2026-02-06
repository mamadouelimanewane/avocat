"use client"

import {
    User,
    Building2,
    ShieldCheck,
    Bell,
    Globe,
    CreditCard,
    ChevronRight,
    Scale
} from "lucide-react"

const sections = [
    {
        title: "Profil & Identité",
        description: "Gérez vos informations personnelles et votre titre professionnel.",
        icon: User,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Informations du Cabinet",
        description: "Logo, adresse, coordonnées et informations légales du cabinet.",
        icon: Building2,
        color: "text-violet-500",
        bg: "bg-violet-500/10",
    },
    {
        title: "Sécurité & Conformité",
        description: "Paramètres de chiffrement 256-bits et localisation UEMOA.",
        icon: ShieldCheck,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        title: "Notifications",
        description: "Alertes de délais, rapports LexAI et rappels de facturation.",
        icon: Bell,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    }
]

export default function SettingsPage() {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Paramètres</h2>
                <p className="text-muted-foreground font-light mt-1">
                    Personnalisez votre expérience LexPremium Lite.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section) => (
                    <button
                        key={section.title}
                        className="group p-6 bg-white border border-slate-100 rounded-[2rem] text-left hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="flex items-start gap-x-5 relative z-10">
                            <div className={`p-4 rounded-2xl ${section.bg} group-hover:scale-110 transition-transform`}>
                                <section.icon className={`h-6 w-6 ${section.color}`} />
                            </div>
                            <div className="flex-1 pr-6">
                                <h3 className="font-bold text-slate-900 text-lg mb-1">{section.title}</h3>
                                <p className="text-sm text-slate-500 font-light leading-relaxed">
                                    {section.description}
                                </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all mt-1" />
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-slate-100/50 transition-colors" />
                    </button>
                ))}
            </div>

            <div className="mt-12 p-8 bg-[#0f172a] rounded-[2.5rem] text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-x-4">
                        <div className="p-3 bg-secondary rounded-2xl">
                            <Scale className="h-8 w-8 text-slate-900" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">LexPremium Duo Edition</h3>
                            <p className="text-slate-400 text-sm font-light">Version 2026.1 - Hébergement sécurisé (Sénégal/Côte d'Ivoire)</p>
                        </div>
                    </div>
                    <button className="bg-white text-slate-900 py-3 px-8 rounded-xl font-bold hover:bg-slate-100 transition shadow-lg shadow-white/10 active:scale-95 whitespace-nowrap">
                        Mettre à jour
                    </button>
                </div>
                {/* Décoration fond */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            </div>
        </div>
    )
}
