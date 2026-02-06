"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Briefcase,
  Users,
  Calendar,
  Clock,
  FileText,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react"

const stats = [
  {
    label: "Dossiers Actifs",
    value: "12",
    icon: Briefcase,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    label: "Clients Totaux",
    value: "45",
    icon: Users,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    label: "Audiences de la semaine",
    value: "4",
    icon: Calendar,
    color: "text-pink-700",
    bg: "bg-pink-700/10",
  },
  {
    label: "Délais Critiques",
    value: "2",
    icon: Clock,
    color: "text-orange-700",
    bg: "bg-orange-700/10",
  },
]

export default function DashboardPage() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleLexAISubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/lex-ai?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 ">
        <h2 className="text-3xl font-bold">Tableau de Bord</h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg">
          Bienvenue dans votre espace de travail intelligent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-background border border-border rounded-[2rem] flex items-center justify-between hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer group">
            <div className="flex flex-col gap-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}>
              <stat.icon className={`h-7 w-7 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 border border-border rounded-[2.5rem] bg-background shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Priorités du Cabinet</h3>
            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Actions requises</span>
          </div>
          <div className="space-y-6">
            <div className="flex items-start p-5 hover:bg-muted rounded-3xl transition-all border border-transparent hover:border-border group">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl mr-5">
                <Clock className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold">Relance Factures</p>
                <p className="text-sm text-muted-foreground font-light">3 factures en retard de paiement ce mois-ci.</p>
                <div className="mt-4 flex gap-x-3">
                  <button className="text-[10px] bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold hover:opacity-90 transition">Gérer les relances</button>
                </div>
              </div>
            </div>

            <div className="flex items-start p-5 hover:bg-muted rounded-3xl transition-all border border-transparent hover:border-border group">
              <div className="p-3 bg-sky-100 dark:bg-sky-900/30 text-sky-600 rounded-2xl mr-5">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold">Actes en attente de rédaction</p>
                <p className="text-sm text-muted-foreground font-light">2 projets d'assignation à valider.</p>
              </div>
            </div>

            <div className="flex items-start p-5 hover:bg-muted rounded-3xl transition-all border border-transparent hover:border-border group">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl mr-5">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold">Audiences à venir</p>
                <p className="text-sm text-muted-foreground font-light">Consultez votre agenda pour les plaidoiries de demain.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border border-white/10 rounded-[2.5rem] bg-[#0f172a] text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-x-3 mb-6">
              <div className="p-2 bg-secondary rounded-lg">
                <Sparkles className="h-6 w-6 text-slate-900" />
              </div>
              <h3 className="text-2xl font-bold">LexAI - Assistant Proactif</h3>
            </div>
            <p className="text-slate-400 text-md font-light mb-10 leading-relaxed md:pr-10">
              L'IA analyse vos dossiers et vous propose des stratégies juridiques en temps réel. Posez votre question ci-dessous.
            </p>
            <form onSubmit={handleLexAISubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Prépare une mise en demeure pour..."
                className="w-full p-5 pr-16 rounded-[1.5rem] bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-slate-500"
              />
              <button type="submit" className="absolute right-2 top-2 p-3 bg-secondary rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-secondary/20">
                <ArrowRight className="h-5 w-5 text-slate-900" />
              </button>
            </form>
          </div>
          {/* Décoration fond */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full -mr-40 -mt-40 blur-[80px] group-hover:bg-secondary/20 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-32 -mb-32 blur-[60px]" />
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-x-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold">Sentinelle Juridique - Fil de Veille</h3>
          </div>
          <button className="text-xs font-bold text-muted-foreground hover:text-foreground transition">Tout voir</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-muted border border-border rounded-3xl group hover:bg-background hover:shadow-xl transition-all">
            <div className="flex items-center gap-x-2 mb-3">
              <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">ALERTE JURIS</span>
              <span className="text-[10px] text-muted-foreground font-bold">IL Y A 2H</span>
            </div>
            <p className="font-bold text-sm mb-2">Nouvel arrêt CCJA : Bail Commercial</p>
            <p className="text-xs text-muted-foreground font-light line-clamp-2">Précision sur les délais de renouvellement tacite. Impact potentiel : Dossier SIS.</p>
          </div>

          <div className="p-6 bg-muted border border-border rounded-3xl group hover:bg-background hover:shadow-xl transition-all">
            <div className="flex items-center gap-x-2 mb-3">
              <span className="text-[10px] font-bold bg-sky-500 text-white px-2 py-0.5 rounded-full">JOURNAL OFFICIEL</span>
              <span className="text-[10px] text-muted-foreground font-bold">CE MATIN</span>
            </div>
            <p className="font-bold text-sm mb-2">Réforme du Code de Procédure Civile</p>
            <p className="text-xs text-muted-foreground font-light line-clamp-2">Dématérialisation des actes de greffe : nouveaux délais applicables au 01/02.</p>
          </div>

          <div className="p-6 bg-muted border border-border rounded-3xl group hover:bg-background hover:shadow-xl transition-all border-dashed">
            <div className="h-full flex flex-col items-center justify-center text-center py-4">
              <p className="text-xs text-muted-foreground font-medium italic">L'IA LexAI surveille 45 sources pour vous...</p>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

