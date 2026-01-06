"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
    Mail,
    Play,
    Pause,
    Settings,
    Users,
    MousePointerClick,
    Eye,
    Plus,
    Calendar,
    Target
} from 'lucide-react'

const CAMPAIGNS = [
    {
        id: '1',
        name: 'Welcome Series - Particuliers',
        status: 'ACTIVE',
        sent: 1250,
        opened: 850,
        clicked: 320,
        conversion: '12%',
        lastRun: 'Il y a 2h'
    },
    {
        id: '2',
        name: 'Nurturing B2B - Entreprises',
        status: 'PAUSED',
        sent: 450,
        opened: 220,
        clicked: 45,
        conversion: '5%',
        lastRun: 'Il y a 3 jours'
    },
    {
        id: '3',
        name: 'Relance Leads Dormants',
        status: 'ACTIVE',
        sent: 2800,
        opened: 1100,
        clicked: 120,
        conversion: '2%',
        lastRun: 'Hier à 10h'
    }
]

export function LeadCampaigns() {
    return (
        <Card className="border-none shadow-sm h-full">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold">Campagnes Automatisées</CardTitle>
                        <CardDescription>Gérez vos séquences d'emails de nurturing.</CardDescription>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" /> Nouvelle Campagne
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {CAMPAIGNS.map(campaign => (
                        <div key={campaign.id} className="p-4 rounded-xl border border-slate-100 hover:border-blue-100 transition-colors bg-white shadow-sm group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${campaign.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{campaign.name}</h4>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <Badge variant={campaign.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-[10px] py-0 px-2 h-4">
                                                {campaign.status}
                                            </Badge>
                                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                <Calendar className="h-2.5 w-2.5" /> {campaign.lastRun}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                        {campaign.status === 'ACTIVE' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 mb-4">
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Envoyés</p>
                                    <p className="text-sm font-black text-slate-900">{campaign.sent}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Ouverts</p>
                                    <p className="text-sm font-black text-blue-600">{Math.round((campaign.opened / campaign.sent) * 100)}%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Clics</p>
                                    <p className="text-sm font-black text-purple-600">{Math.round((campaign.clicked / campaign.opened) * 100)}%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Conv.</p>
                                    <p className="text-sm font-black text-emerald-600">{campaign.conversion}</p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-slate-500">Progression Séquence</span>
                                    <span className="text-slate-900">Step 3/5</span>
                                </div>
                                <Progress value={60} className="h-1" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-slate-50">
                    <div className="bg-blue-50/50 p-4 rounded-xl flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <Target className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-blue-900">Boostez votre conversion avec l'IA</p>
                            <p className="text-[10px] text-blue-700 opacity-80">Notre moteur IA suggère de lancer une campagne de relance pour les leads "Grade A" inactifs.</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs border-blue-200 hover:bg-white">Lancer</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
