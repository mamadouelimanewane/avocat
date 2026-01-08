"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Newspaper, Bell, ExternalLink, RefreshCcw, Search, Filter, ShieldCheck, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"

export function LegalNewsFeed() {
    const [isRefreshing, setIsRefreshing] = useState(false)

    const news = [
        {
            id: 1,
            title: "Réforme du Code du Travail : Vers une flexibilité accrue du CDD ?",
            category: "SOCIAL",
            date: "Il y a 2h",
            summary: "L'assemblée nationale examine un projet de loi visant à allonger la durée maximale du CDD au Sénégal de 24 à 48 mois pour certains secteurs stratégiques.",
            source: "Journal Officiel - SENEGAL",
            priority: "URGENT"
        },
        {
            id: 2,
            title: "Décision CCJA : Précisions sur l'immunité d'exécution des entreprises publiques",
            category: "OHADA",
            date: "Aujourd'hui, 09:12",
            summary: "Dans son dernier arrêt, la CCJA rappelle les conditions strictes de saisie des comptes d'une société anonyme à capitaux publics.",
            source: "Bulletin Jurisprudence CCJA",
            priority: "IMPORTANT"
        },
        {
            id: 3,
            title: "Arrêté Ministériel : Baisse des frais de mutation pour l'habitat social",
            category: "FONCIER",
            date: "Hier",
            summary: "Le ministère de l'urbanisme annonce une réduction de 50% sur les droits d'enregistrement pour les logements de type F3 en zone urbaine.",
            source: "Ministère de l'Habitat",
            priority: "INFO"
        },
        {
            id: 4,
            title: "Fiscalité : Nouvelle taxe sur les services numériques (TSN)",
            category: "FISCAL",
            date: "Hier",
            summary: "Le Code Général des Impôts a été amendé pour inclure une taxe de 3% sur le chiffre d'affaires des plateformes étrangères opérant au Sénégal.",
            source: "DGID",
            priority: "IMPORTANT"
        }
    ]

    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1500)
    }

    return (
        <Card className="shadow-lg border-slate-200 h-[600px] flex flex-col bg-slate-50/30">
            <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-900">Veille Juridique Flash</CardTitle>
                        <p className="text-xs text-slate-500">Flux temps réel JO Sénégal & OHADA</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="h-9 gap-2">
                        <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Scanner le Web
                    </Button>
                    <Badge variant="success" className="bg-emerald-100 text-emerald-700 border-emerald-200">En direct</Badge>
                </div>
            </CardHeader>

            <div className="p-4 bg-white/50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Rechercher une loi, un arrêté..." className="pl-9 h-9 text-sm" />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 text-slate-600"><Filter className="h-4 w-4 mr-2" /> Catégories</Button>
                    <Button variant="outline" size="sm" className="h-9 text-slate-600"><Bell className="h-4 w-4 mr-2" /> Alertes</Button>
                </div>
            </div>

            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                        {news.map((item) => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${item.category === 'SOCIAL' ? 'bg-blue-50 text-blue-700' :
                                            item.category === 'OHADA' ? 'bg-indigo-50 text-indigo-700' :
                                                item.category === 'FISCAL' ? 'bg-amber-50 text-amber-700' :
                                                    'bg-emerald-50 text-emerald-700'
                                            } border-none font-bold text-[10px]`}>
                                            {item.category}
                                        </Badge>
                                        <span className="text-[11px] text-slate-400 font-medium">• {item.date}</span>
                                    </div>
                                    <Badge variant={item.priority === 'URGENT' ? 'destructive' : 'outline'} className="text-[9px]">
                                        {item.priority}
                                    </Badge>
                                </div>
                                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                                    {item.summary}
                                </p>
                                <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                        <ShieldCheck className="h-3 w-3 text-emerald-500" /> {item.source}
                                    </span>
                                    <Button variant="ghost" size="sm" className="h-7 text-[10px] text-indigo-600 group-hover:bg-indigo-50">
                                        Consulter le texte <ExternalLink className="h-3 w-3 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <div className="bg-indigo-50 border border-dashed border-indigo-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                            <Newspaper className="h-10 w-10 text-indigo-400 mb-3 opacity-50" />
                            <h5 className="text-sm font-bold text-indigo-900">Intelligence LexAI Veille</h5>
                            <p className="text-xs text-indigo-600 mt-1 max-w-[250px]">
                                Notre crawler analyse chaque nuit les publications légales pour mettre à jour votre &quot;Bible&quot;.
                            </p>
                            <Button size="sm" className="mt-4 bg-indigo-600">Configurer mes thématiques</Button>
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
