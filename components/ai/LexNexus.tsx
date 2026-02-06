
"use client"

import { useState } from "react"
import {
    LayoutDashboard,
    Users,
    FileText,
    MessageSquare,
    Bell,
    LogOut,
    Settings,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileCheck,
    Plus,
    CreditCard,
    DollarSign,
    Calendar,
    Briefcase,
    Globe,
    Lock,
    Eye,
    ChevronRight,
    Send,
    Link as LinkIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LexNexusProps {
    dossierId: string
    onClose?: () => void
}

export function LexNexus({ dossierId, onClose }: LexNexusProps) {
    const [activeView, setActiveView] = useState("dashboard")
    const [onboardingProgress, setOnboardingProgress] = useState(65)

    return (
        <div className="bg-slate-50 border-l border-slate-200 w-full h-full flex flex-col shadow-2xl relative font-sans">
            {/* Header - White Label SuiteDash Style */}
            <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-lg shadow-md shadow-blue-200">
                        <Globe className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                            Lex<span className="text-blue-600">Nexus</span> Portal
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Espace Client Sécurisé</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full h-8 w-8 text-slate-400">
                        <LogOut className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                {/* Client Simulator Banner */}
                <div className="bg-slate-900 text-white p-3 flex items-center justify-between text-xs font-medium px-6 shadow-inner">
                    <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-emerald-400" />
                        <span className="font-bold uppercase tracking-wide opacity-80">Mode "Vue Client" Actif</span>
                    </div>
                    <Badge variant="outline" className="border-white/20 text-white/70 bg-white/5">Dossier #{dossierId.slice(0, 6)}</Badge>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Navigation (SuiteDash Style) */}
                    <div className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
                        <NavIcon icon={<LayoutDashboard className="h-5 w-5" />} active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
                        <NavIcon icon={<FileText className="h-5 w-5" />} active={activeView === 'documents'} onClick={() => setActiveView('documents')} />
                        <NavIcon icon={<MessageSquare className="h-5 w-5" />} active={activeView === 'messages'} onClick={() => setActiveView('messages')} />
                        <NavIcon icon={<CreditCard className="h-5 w-5" />} active={activeView === 'billing'} onClick={() => setActiveView('billing')} />
                        <div className="flex-1" />
                        <NavIcon icon={<Settings className="h-5 w-5" />} active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
                    </div>

                    {/* Main Content Area */}
                    <ScrollArea className="flex-1 bg-[#f0f4f8]">
                        <div className="p-8 max-w-4xl mx-auto space-y-8">

                            {/* Dashboard View */}
                            {activeView === 'dashboard' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {/* Welcome Header */}
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h1 className="text-2xl font-black text-slate-800 mb-1">Bonjour, M. Client</h1>
                                            <p className="text-slate-500 font-medium">Voici l'état d'avancement de votre dossier en date du 06 Février 2026.</p>
                                        </div>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200">
                                            <Plus className="h-4 w-4 mr-2" /> NOUVELLE DEMANDE
                                        </Button>
                                    </div>

                                    {/* Onboarding / Action Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Card className="col-span-2 border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden rounded-[1.5rem] relative">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-lg font-black text-slate-800">Parcours d'Onboarding</CardTitle>
                                                        <CardDescription className="font-medium text-slate-400">Finalisez votre dossier pour lancer la procédure.</CardDescription>
                                                    </div>
                                                    <span className="text-2xl font-black text-blue-600">{onboardingProgress}%</span>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <Progress value={onboardingProgress} className="h-2 mb-6 bg-slate-100" indicatorClassName="bg-blue-500" />
                                                <div className="space-y-4">
                                                    <StepItem status="complete" icon={<CheckCircle2 className="h-4 w-4" />} title="Signature de la Convention" date="01/02/2026" />
                                                    <StepItem status="active" icon={<Clock className="h-4 w-4" />} title="Dépôt des Pièces d'Identité" desc="En attente de validation par le cabinet." />
                                                    <StepItem status="locked" icon={<Lock className="h-4 w-4" />} title="Règlement de la Provision" desc="Facture #INV-2026-001" />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <div className="space-y-6">
                                            <Card className="border-none shadow-lg shadow-blue-100/50 bg-blue-600 text-white rounded-[1.5rem] overflow-hidden relative">
                                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                                    <Briefcase className="h-24 w-24" />
                                                </div>
                                                <CardContent className="p-6 relative z-10">
                                                    <h3 className="font-black text-lg mb-1">Prochain RDV</h3>
                                                    <p className="text-blue-100 text-sm font-medium mb-4">Plaidoirie - Tribunal Dakar</p>
                                                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                                        <div className="bg-white text-blue-600 w-10 h-10 rounded-lg flex flex-col items-center justify-center font-black leading-none shadow-sm">
                                                            <span className="text-[10px] uppercase">FÉV</span>
                                                            <span className="text-lg">14</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm">09:30 AM</p>
                                                            <p className="text-[10px] opacity-70 uppercase tracking-wide">CONFIRMÉ</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-none shadow-lg shadow-slate-200/50 bg-white rounded-[1.5rem]">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Facturation</p>
                                                        <p className="text-xl font-black text-slate-800">1,250,000 F</p>
                                                    </div>
                                                    <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                                        <DollarSign className="h-5 w-5" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>

                                    {/* Action Required Banner */}
                                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4">
                                        <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                                            <AlertCircle className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800 text-sm">Action Requise : Validation de Conclusions</h4>
                                            <p className="text-xs text-slate-500 font-medium">Maître a déposé un nouveau projet de conclusions pour votre dossier. Merci de le lire et de le valider avant Jeudi.</p>
                                        </div>
                                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-100">
                                            VOIR LE DOCUMENT
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Secure Messaging View Mockup */}
                            {activeView === 'messages' && (
                                <div className="h-[600px] flex flex-col bg-white rounded-[2rem] shadow-xl overflow-hidden animate-in fade-in duration-300">
                                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src="/avatars/01.png" />
                                            <AvatarFallback className="bg-slate-900 text-white font-black">C</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Service Juridique</h4>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">En ligne</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-slate-50/50 p-6 space-y-4 overflow-y-auto">
                                        <MessageBubble side="left" text="Bonjour, avez-vous pu prendre connaissance de la dernière pièce adverse ?" time="10:30 AM" />
                                        <MessageBubble side="right" text="Oui, je viens de la télécharger sur le portail. C'est assez surprenant comme argument." time="10:35 AM" />
                                        <MessageBubble side="left" text="Ne vous inquiétez pas, nous avons déjà préparé la réponse. Je vous l'envoie pour validation dans l'heure." time="10:36 AM" />
                                    </div>
                                    <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                                        <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-200 transition-colors">
                                            <LinkIcon className="h-4 w-4" />
                                        </div>
                                        <input className="flex-1 bg-slate-50 border-none rounded-full px-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:outline-none" placeholder="Écrivez votre message sécurisé..." />
                                        <Button size="icon" className="rounded-full bg-blue-600 text-white hover:bg-blue-700 w-10 h-10 shadow-lg shadow-blue-200">
                                            <Send className="h-4 w-4 ml-0.5" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}

function NavIcon({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "p-3 rounded-xl cursor-pointer transition-all duration-200 group relative",
                active ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            )}
        >
            {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />}
            {icon}
        </div>
    )
}

function StepItem({ status, icon, title, desc, date }: { status: 'complete' | 'active' | 'locked', icon: React.ReactNode, title: string, desc?: string, date?: string }) {
    const statusConfig = {
        complete: { color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
        active: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
        locked: { color: "text-slate-300", bg: "bg-slate-50", border: "border-slate-100" }
    }
    const config = statusConfig[status]

    return (
        <div className={cn("flex items-start gap-4 p-4 rounded-xl border transition-all", config.border, config.bg)}>
            <div className={cn("p-2 rounded-full shrink-0", status === 'complete' ? "bg-emerald-100 text-emerald-600" : status === 'active' ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400")}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <h5 className={cn("font-bold text-sm", status === 'locked' ? "text-slate-400" : "text-slate-800")}>{title}</h5>
                    {status === 'complete' && <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase">Terminé</Badge>}
                    {status === 'active' && <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[9px] font-black uppercase animate-pulse">En Cours</Badge>}
                </div>
                {(desc || date) && (
                    <p className="text-xs text-slate-500 font-medium truncate">
                        {desc || `Complété le ${date}`}
                    </p>
                )}
            </div>
        </div>
    )
}

function MessageBubble({ side, text, time }: { side: 'left' | 'right', text: string, time: string }) {
    const isRight = side === 'right'
    return (
        <div className={cn("flex flex-col max-w-[80%]", isRight ? "ml-auto items-end" : "mr-auto items-start")}>
            <div className={cn(
                "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                isRight ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
            )}>
                {text}
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-1 px-1">{time}</span>
        </div>
    )
}
