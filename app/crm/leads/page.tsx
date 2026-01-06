"use client"

import { useState } from 'react'
import { LeadKanban } from '@/components/crm/LeadKanban'
import { LeadStats } from '@/components/crm/LeadStats'
import { LeadCampaigns } from '@/components/crm/LeadCampaigns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
    Plus,
    Filter,
    Download,
    LayoutGrid,
    List,
    Search,
    BrainCircuit,
    Sparkles,
    Users
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { type Lead } from '@/lib/lead-scoring'

const MOCK_LEADS: Lead[] = [
    {
        id: '1',
        name: 'TechCorp Africa',
        email: 'contact@techcorp.sn',
        phone: '+221 77 123 45 67',
        source: 'PARTNER',
        type: 'ENTREPRISE',
        domaine: 'COMMERCIAL',
        budget: 4500000,
        urgency: 'HIGH',
        lastContact: new Date(Date.now() - 86400000),
        interactions: 4,
        status: 'QUALIFIED',
        createdAt: new Date(Date.now() - 604800000)
    },
    {
        id: '2',
        name: 'Moussa Sylla',
        email: 'moussa.sylla@gmail.com',
        phone: '+221 70 987 65 43',
        source: 'WEBSITE',
        type: 'PARTICULIER',
        domaine: 'PENAL',
        budget: 750000,
        urgency: 'URGENT',
        lastContact: new Date(Date.now() - 3600000),
        interactions: 2,
        status: 'NEW',
        createdAt: new Date(Date.now() - 172800000)
    },
    {
        id: '3',
        name: 'Awa Diagne',
        source: 'REFERRAL',
        type: 'PARTICULIER',
        domaine: 'CIVIL',
        budget: 300000,
        urgency: 'LOW',
        interactions: 1,
        status: 'NEW',
        createdAt: new Date(Date.now() - 1209600000)
    },
    {
        id: '4',
        name: 'Global Logistics SARL',
        source: 'SOCIAL_MEDIA',
        type: 'ENTREPRISE',
        domaine: 'COMMERCIAL',
        budget: 12000000,
        urgency: 'MEDIUM',
        lastContact: new Date(Date.now() - 259200000),
        interactions: 6,
        status: 'NEGOTIATION',
        createdAt: new Date(Date.now() - 2592000000)
    },
    {
        id: '5',
        name: 'Cabinet Médical Plateau',
        source: 'PARTNER',
        type: 'ENTREPRISE',
        domaine: 'SOCIAL',
        budget: 2000000,
        urgency: 'HIGH',
        lastContact: new Date(Date.now() - 432000000),
        interactions: 3,
        status: 'PROPOSAL',
        createdAt: new Date(Date.now() - 864000000)
    }
]

export default function CRMLeadsPage() {
    const [view, setView] = useState<'kanban' | 'list'>('kanban')

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                        CRM & Acquisition
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-bold">
                            <BrainCircuit className="h-3 w-3 mr-1" /> IA PILOTÉ
                        </Badge>
                    </h1>
                    <p className="text-slate-500 mt-1">Gérez vos opportunités et optimisez votre taux de conversion.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="font-bold border-2">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-200">
                        <Plus className="mr-2 h-4 w-4" /> Nouveau Lead
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <LeadStats leads={MOCK_LEADS} />

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Left Side: Pipeline / List */}
                <div className="xl:col-span-3 space-y-6">
                    <Tabs defaultValue="pipeline" className="w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-2 rounded-xl border-2 border-slate-100 shadow-sm mb-6">
                            <TabsList className="bg-slate-100/50 p-1">
                                <TabsTrigger value="pipeline" className="font-bold gap-2">
                                    <LayoutGrid className="h-4 w-4" /> Pipeline
                                </TabsTrigger>
                                <TabsTrigger value="list" className="font-bold gap-2">
                                    <List className="h-4 w-4" /> Liste
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex flex-1 w-full max-w-md items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input placeholder="Rechercher un lead..." className="pl-10 border-slate-200" />
                                </div>
                                <Button variant="ghost" size="icon" className="border">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <TabsContent value="pipeline" className="mt-0">
                            <LeadKanban initialLeads={MOCK_LEADS} />
                        </TabsContent>

                        <TabsContent value="list" className="mt-0">
                            <div className="bg-white rounded-xl border-2 border-slate-100 p-8 text-center">
                                <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-900">Vue Liste en construction</h3>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">Nous finalisons l'interface tabulaire pour une gestion de masse facilitée.</p>
                                <Button variant="outline" className="mt-6" onClick={() => setView('kanban')}>Retour au Pipeline</Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Side: Campaigns & Insights */}
                <div className="space-y-8">
                    <LeadCampaigns />

                    {/* IA Insights Card */}
                    <Card className="border-none bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <Sparkles className="h-24 w-24" />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BrainCircuit className="h-5 w-5" /> Insights Stratégiques
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                                <p className="text-xs font-bold uppercase opacity-70 mb-1">Opportunité</p>
                                <p className="text-sm">Le lead <span className="font-bold">Global Logistics</span> a un score de 92% mais n'a pas été contacté depuis 3 jours. Appel recommandé.</p>
                            </div>
                            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                                <p className="text-xs font-bold uppercase opacity-70 mb-1">Tendance</p>
                                <p className="text-sm">Votre taux de conversion sur le domaine <span className="font-bold">COMMERCIAL</span> a augmenté de 15% ce mois-ci.</p>
                            </div>
                            <Button className="w-full bg-white text-blue-700 hover:bg-slate-100 font-bold border-none">
                                Voir tous les rapports
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
