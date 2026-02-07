
"use client"

import { useState } from "react"
import {
    Scale,
    Handshake,
    BarChart2,
    MessageCircle,
    Lock,
    EyeOff,
    TrendingUp,
    ShieldCheck,
    CheckCircle2,
    Users,
    XCircle,
    Info,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface LexMediatorProps {
    dossierId: string
    onClose?: () => void
}

export function LexMediator({ dossierId, onClose }: LexMediatorProps) {
    const [offer, setOffer] = useState([50000])
    const [isDealRevealed, setIsDealRevealed] = useState(false)
    const [activeTab, setActiveTab] = useState("negotiation")

    // Mock BATNA calculation
    const batnaValue = 42000 // Best Alternative to Negotiated Agreement

    const handleBlindBid = () => {
        // Simulate blind bidding logic
        setTimeout(() => setIsDealRevealed(true), 1500)
    }

    return (
        <div className="bg-slate-50 border-l border-slate-200 w-full h-full flex flex-col shadow-2xl relative font-sans overflow-hidden">
            {/* Header - Peaceful ODR Style */}
            <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-lg shadow-sm">
                        <Scale className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                            Lex<span className="text-blue-500">Mediator</span> ODR
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Online Dispute Resolution</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full h-8 w-8 text-slate-400">
                        <XCircle className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Tabs defaultValue="negotiation" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                <div className="px-6 pt-4 bg-slate-50">
                    <TabsList className="grid grid-cols-2 w-full bg-slate-200/50 p-1 rounded-xl mb-4">
                        <TabsTrigger value="negotiation" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                            <Handshake className="h-3 w-3 mr-2" /> BLIND BIDDING
                        </TabsTrigger>
                        <TabsTrigger value="strategy" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                            <BarChart2 className="h-3 w-3 mr-2" /> STRATÉGIE (BATNA)
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 max-w-lg mx-auto space-y-8">

                        <TabsContent value="negotiation" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4">

                            {/* Blind Bidding Mechanism */}
                            <Card className="border-none shadow-lg bg-white overflow-hidden">
                                <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-black text-blue-900 flex items-center gap-2">
                                            <EyeOff className="h-5 w-5 text-blue-500" />
                                            Enchère à l'aveugle
                                        </CardTitle>
                                        <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200 border-none font-bold">Session Sécurisée</Badge>
                                    </div>
                                    <CardDescription>
                                        Entrez votre offre de règlement secrète. L'IA ne révèlera l'accord que si l'offre croise celle de la partie adverse.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    {!isDealRevealed ? (
                                        <>
                                            <div className="text-center space-y-2">
                                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Votre Offre de Règlement</p>
                                                <div className="text-5xl font-black text-slate-900 tracking-tighter">
                                                    {offer[0].toLocaleString()} €
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-4">
                                                <Slider
                                                    defaultValue={[50000]}
                                                    max={100000}
                                                    step={1000}
                                                    onValueChange={setOffer}
                                                    className="py-4"
                                                />
                                                <div className="flex justify-between text-xs font-bold text-slate-400">
                                                    <span>0 €</span>
                                                    <span>100k €</span>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500 flex gap-2">
                                                <Lock className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
                                                <p>Cette offre est chiffrée. La partie adverse ne verra jamais ce montant si aucun accord n'est trouvé.</p>
                                            </div>

                                            <Button
                                                onClick={handleBlindBid}
                                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 text-lg rounded-xl"
                                            >
                                                SOUMETTRE L'OFFRE SECRÈTE
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center space-y-6 py-6 animate-in zoom-in duration-500">
                                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                                                <Handshake className="h-10 w-10 text-emerald-600" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-2xl font-black text-emerald-600 mb-2">ACCORD TROUVÉ !</h3>
                                                <p className="text-slate-600 font-medium">Les offres se sont croisées dans la zone d'accord.</p>
                                            </div>
                                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center w-full">
                                                <p className="text-xs font-black uppercase text-emerald-400 mb-1">Montant du Règlement</p>
                                                <p className="text-4xl font-black text-emerald-700">52 500 €</p>
                                            </div>
                                            <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-50">
                                                Générer le Protocole d'Accord
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="flex justify-center flex-col items-center gap-2">
                                <p className="text-[10px] font-black uppercase text-slate-300">Powered by LexMediator AI Algorithm</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-bold text-slate-500">Partie Adverse : En ligne</span>
                                </div>
                            </div>

                        </TabsContent>

                        <TabsContent value="strategy" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4">
                            {/* BATNA Visualizer */}
                            <Card className="border-none shadow-sm bg-white">
                                <CardHeader>
                                    <CardTitle className="text-base font-black text-slate-800">Analyse BATNA</CardTitle>
                                    <CardDescription>Best Alternative to a Negotiated Agreement</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="relative h-40 w-full bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-end justify-center overflow-hidden">
                                        {/* Mock Graph Lines */}
                                        <div className="absolute inset-0 flex items-end px-8 gap-4">
                                            <div className="w-1/3 h-[40%] bg-rose-200 rounded-t-lg relative group">
                                                <div className="absolute -top-8 w-full text-center text-xs font-bold text-rose-500">Procès (Risqué)</div>
                                            </div>
                                            <div className="w-1/3 h-[65%] bg-blue-200 rounded-t-lg relative group border-t-4 border-blue-500">
                                                <div className="absolute -top-12 w-full text-center">
                                                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-[10px] font-bold">BATNA</span>
                                                    <div className="text-xs font-black text-blue-600 mt-1">42k €</div>
                                                </div>
                                            </div>
                                            <div className="w-1/3 h-[80%] bg-emerald-200 rounded-t-lg relative group opacity-50 border-t border-dashed border-emerald-500">
                                                <div className="absolute -top-8 w-full text-center text-xs font-bold text-emerald-600">Offre Idéale</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                            <h5 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                                                <Info className="h-4 w-4" /> Conseil Stratégique
                                            </h5>
                                            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                                Votre BATNA est estimé à <strong>42 000 €</strong> (espérance de gain judiciaire pondérée par le risque).
                                                Toute offre supérieure à ce montant devrait être acceptée rationnellement.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </ScrollArea>
            </Tabs>
        </div>
    )
}
