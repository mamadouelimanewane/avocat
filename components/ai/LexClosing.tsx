
"use client"

import { useState } from "react"
import {
    CheckSquare,
    Users,
    FileSignature,
    Lock,
    Eye,
    EyeOff,
    Settings,
    Flag,
    CheckCircle2,
    Clock,
    XCircle,
    Download,
    UploadCloud,
    MoreHorizontal,
    Search,
    PenTool,
    ShieldCheck,
    Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface LexClosingProps {
    dossierId: string
    onClose?: () => void
}

export function LexClosing({ dossierId, onClose }: LexClosingProps) {
    const [activeTab, setActiveTab] = useState("checklist")
    const [dealProgress, setDealProgress] = useState(68)

    // Mock Checklist Data
    const checklistItems = [
        { id: 1, category: "Corporate", name: "PV d'Assemblée Générale", status: "signed", responsible: "Buyer" },
        { id: 2, category: "Corporate", name: "Statuts Mis à Jour", status: "review", responsible: "Seller" },
        { id: 3, category: "Finance", name: "Garantie d'Actif et de Passif (GAP)", status: "draft", responsible: "Buyer" },
        { id: 4, category: "HR", name: "Contrats de Travail Clés", status: "signed", responsible: "Seller" },
        { id: 5, category: "Closing", name: "Ordre de Virement", status: "pending", responsible: "Bank" },
    ]

    // Mock Signatories
    const signatories = [
        { name: "Jean Dupont", role: "CEO (Vendeur)", status: "signed", time: "10:42 AM" },
        { name: "Marie Curie", role: "DG (Acheteur)", status: "signed", time: "11:15 AM" },
        { name: "Banque Postale", role: "Prêteur", status: "pending", time: "-" },
    ]

    return (
        <div className="bg-[#fffbf0] border-l border-amber-200 w-full h-full flex flex-col shadow-2xl relative font-sans overflow-hidden">
            {/* Header - Gold/Luxury Style */}
            <div className="p-4 border-b border-amber-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-amber-500 p-2 rounded-lg shadow-md shadow-amber-200">
                        <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                            Lex<span className="text-amber-500">Closing</span> Room
                        </h3>
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">Transaction Management</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-amber-100 rounded-full h-8 w-8 text-amber-600">
                        <XCircle className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Deal Status Bar */}
            <div className="bg-white border-b border-amber-100 px-6 py-3 flex items-center gap-6 shadow-sm">
                <div className="flex-1">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Avancement du Closing</span>
                        <span className="text-lg font-black text-amber-600">{dealProgress}%</span>
                    </div>
                    <Progress value={dealProgress} className="h-2 bg-slate-100" indicatorClassName="bg-amber-500" />
                </div>
                <div className="flex items-center gap-4 border-l border-amber-100 pl-6">
                    <DealStat label="Documents" value="12/15" />
                    <DealStat label="Signatures" value="8/12" />
                    <DealStat label="Jours Restants" value="02" isAlert />
                </div>
            </div>

            <Tabs defaultValue="checklist" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 bg-[#fffbf0]">
                <div className="px-4 pt-4">
                    <TabsList className="grid grid-cols-2 w-full bg-amber-100/50 p-1 rounded-xl mb-4">
                        <TabsTrigger value="checklist" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm">
                            <CheckSquare className="h-3 w-3 mr-2" /> CHECKLIST
                        </TabsTrigger>
                        <TabsTrigger value="signing" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm">
                            <FileSignature className="h-3 w-3 mr-2" /> SIGNATURE
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">

                        <TabsContent value="checklist" className="mt-0 space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-black text-slate-800 text-sm uppercase">Liste des Documents</h4>
                                <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold bg-white border-amber-200 text-amber-700 hover:bg-amber-50">
                                    <UploadCloud className="h-3 w-3 mr-2" /> UPLOADER
                                </Button>
                            </div>

                            {/* Checklist Table Style */}
                            <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
                                {checklistItems.map((item, idx) => (
                                    <div key={item.id} className={cn(
                                        "flex items-center p-3 hover:bg-amber-50/30 transition-colors group",
                                        idx !== checklistItems.length - 1 && "border-b border-slate-50"
                                    )}>
                                        <div className="w-10 flex justify-center">
                                            {item.status === 'signed' ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                                                item.status === 'pending' ? <Clock className="h-4 w-4 text-amber-500" /> :
                                                    <div className="h-2 w-2 rounded-full bg-slate-300" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <Badge variant="outline" className="border-slate-200 text-slate-400 text-[9px] px-1 py-0 h-4">{item.category}</Badge>
                                                <span className="text-xs font-bold text-slate-700 truncate">{item.name}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400">Responsable: <span className="font-bold">{item.responsible}</span></p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={cn(
                                                "text-[9px] font-bold uppercase w-20 justify-center",
                                                item.status === 'signed' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
                                                    item.status === 'review' ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                                                        item.status === 'pending' ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                                                            "bg-slate-100 text-slate-500 hover:bg-slate-100"
                                            )}>
                                                {item.status}
                                            </Badge>
                                            <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="signing" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4">
                            {/* Circular Signing Progress */}
                            <div className="flex justify-center py-4">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="#fef3c7" strokeWidth="10" fill="none" />
                                        <circle cx="80" cy="80" r="70" stroke="#f59e0b" strokeWidth="10" fill="none" strokeDasharray="440" strokeDashoffset="140" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <ShieldCheck className="h-8 w-8 text-amber-500 mb-1" />
                                        <span className="text-2xl font-black text-slate-900">68%</span>
                                        <span className="text-[10px] font-bold text-amber-600 uppercase">SÉCURISÉ</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-black text-slate-800 text-sm uppercase">Signataires</h4>
                                    <Button size="sm" className="h-8 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-200">
                                        <Clock className="h-3 w-3 mr-2" /> RELANCER TOUS
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {signatories.map((person, i) => (
                                        <div key={i} className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 border border-slate-100">
                                                    <AvatarFallback className="bg-slate-900 text-white text-[10px] font-black">{person.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800">{person.name}</p>
                                                    <p className="text-[10px] text-slate-400">{person.role}</p>
                                                </div>
                                            </div>
                                            {person.status === 'signed' ? (
                                                <div className="text-right">
                                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none font-bold gap-1 pl-1 pr-2">
                                                        <CheckCircle2 className="h-3 w-3" /> SIGNÉ
                                                    </Badge>
                                                    <p className="text-[9px] text-slate-300 font-mono mt-0.5">{person.time}</p>
                                                </div>
                                            ) : (
                                                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-none font-bold gap-1 pl-1 pr-2 animate-pulse">
                                                    <Clock className="h-3 w-3" /> EN ATTENTE
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                    </div>
                </ScrollArea>

                {/* Footer Action - Bible Generation */}
                <div className="p-4 bg-white border-t border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Lock className="h-3 w-3 text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Vault Secure - 256bit Encrypted</span>
                    </div>
                    <Button variant="outline" className="border-amber-200 text-amber-700 font-bold h-9 bg-amber-50 hover:bg-amber-100">
                        <Download className="h-3.5 w-3.5 mr-2" /> GÉNÉRER LA BIBLE
                    </Button>
                </div>
            </Tabs>
        </div>
    )
}

function DealStat({ label, value, isAlert }: { label: string, value: string, isAlert?: boolean }) {
    return (
        <div className="text-center">
            <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">{label}</p>
            <p className={cn("text-sm font-black", isAlert ? "text-rose-500" : "text-slate-900")}>{value}</p>
        </div>
    )
}
