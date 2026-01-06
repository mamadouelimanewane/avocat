"use client"

import { MultiSiteManager } from '@/components/admin/MultiSiteManager'
import { ClientPaymentPortal } from '@/components/portal/ClientPaymentPortal'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
    Building2,
    Smartphone,
    Globe,
    ShieldCheck,
    CreditCard,
    Network,
    Zap,
    Users,
    ArrowUpRight,
    Building
} from 'lucide-react'

export default function ExpansionPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-8 space-y-10">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-600 text-white font-black px-3 py-1 text-[10px] uppercase tracking-widest">
                            Infrastructure Cloud V7.0
                        </Badge>
                        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600">
                            <Network className="h-3 w-3" /> RÉSEAU LEXPREMIUM ACTIF
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                        Expansion <span className="text-emerald-600">& Paiements</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium">
                        Gérez vos bureaux à travers le pays et simplifiez le règlement de vos honoraires.
                    </p>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="max-w-7xl mx-auto">
                <Tabs defaultValue="sites" className="space-y-8">
                    <TabsList className="bg-white p-1 h-14 rounded-2xl border-2 border-slate-100 shadow-sm inline-flex">
                        <TabsTrigger value="sites" className="px-8 h-12 rounded-xl text-sm font-black data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all gap-2">
                            <Building2 className="h-4 w-4" /> Multi-Bureaux
                        </TabsTrigger>
                        <TabsTrigger value="payments" className="px-8 h-12 rounded-xl text-sm font-black data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all gap-2">
                            <Smartphone className="h-4 w-4" /> Portail Mobile Money
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="sites">
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-50 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                                        <Globe className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">Synchronisation Multisite</h3>
                                        <p className="text-sm text-slate-500 font-medium">Toutes vos données sont répliquées en temps réel sur vos 3 bureaux.</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-emerald-600 border-emerald-200">3 BUREAUX EN LIGNE</Badge>
                            </div>
                            <MultiSiteManager />
                        </div>
                    </TabsContent>

                    <TabsContent value="payments">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Révolutionnez la facturation</h3>
                                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                                        Offrez à vos clients la simplicité du paiement mobile. Fini les déplacements inutiles, vos honoraires sont crédités instantanément.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FeatureCard
                                        icon={Zap}
                                        title="Instantané"
                                        content="L'argent est crédité sur votre compte dès validation client."
                                    />
                                    <FeatureCard
                                        icon={ShieldCheck}
                                        title="Sécurisé"
                                        content="Transactions cryptées et conformes aux normes bancaires."
                                    />
                                </div>

                                <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold flex items-center gap-2 text-indigo-400">
                                            <Building className="h-4 w-4" /> Compte Trésorerie Central
                                        </h4>
                                        <ArrowUpRight className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Solde Consolidé</p>
                                            <p className="text-3xl font-black">4,582,000 <span className="text-sm font-medium text-slate-400">FCFA</span></p>
                                        </div>
                                        <div className="flex -space-x-2">
                                            <div className="h-8 w-8 rounded-full bg-sky-400 border-2 border-slate-900 flex items-center justify-center font-black text-[8px]">W</div>
                                            <div className="h-8 w-8 rounded-full bg-orange-500 border-2 border-slate-900 flex items-center justify-center font-black text-[8px]">OM</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -inset-4 bg-emerald-500/10 rounded-[4rem] blur-3xl -z-10" />
                                <ClientPaymentPortal
                                    invoiceId="FACT-2024-051"
                                    amount={250000}
                                    clientName="Samba Ndiaye"
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

function FeatureCard({ icon: Icon, title, content }: { icon: any, title: string, content: string }) {
    return (
        <div className="p-6 bg-white rounded-3xl border-2 border-slate-50 shadow-sm space-y-2">
            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Icon className="h-5 w-5" />
            </div>
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{content}</p>
        </div>
    )
}
