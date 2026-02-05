"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Clock,
    ArrowLeft,
    CheckCircle2,
    MessageSquare,
    Shield,
    User,
    Info,
    ChevronRight,
    ArrowRight,
    PlayCircle,
    FileText,
    History,
    Zap,
    Send
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { transitionMail } from '@/app/actions'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface MailDetailContentProps {
    mail: any
}

export default function MailDetailContent({ mail }: MailDetailContentProps) {
    const [loading, setLoading] = useState(false)
    const [comment, setComment] = useState('')
    const { toast } = useToast()
    const router = useRouter()

    const currentStepIndex = mail.workflow?.steps.findIndex((s: any) => s.id === mail.currentStepId)
    const nextStep = mail.workflow?.steps[currentStepIndex + 1]
    const currentStep = mail.workflow?.steps[currentStepIndex]

    async function handleTransition(nextId: string) {
        setLoading(true)
        try {
            const res = await transitionMail(mail.id, nextId, comment)
            if (res.success) {
                toast({
                    title: 'Succès',
                    description: 'Transition du workflow réussie',
                })
                setComment('')
                router.refresh()
            } else {
                toast({
                    title: 'Erreur',
                    description: res.message,
                    variant: 'destructive',
                })
            }
        } catch (e) {
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Bar */}
            <div className="flex justify-between items-center">
                <Link href="/courrier">
                    <Button variant="ghost" className="text-slate-500 hover:text-slate-900 font-bold">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Retour à la liste
                    </Button>
                </Link>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-slate-200">
                        <FileText className="h-4 w-4 mr-2" /> Ouvrir Document
                    </Button>
                    <Button className="bg-indigo-600 text-white font-bold px-6">
                        <Zap className="h-4 w-4 mr-2" /> Analyser avec LexAI
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Content & Workflow */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Main Header */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 h-32 w-32 opacity-5 pointer-events-none">
                            <Send className="h-full w-full text-indigo-900" />
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <Badge className={`bg-${currentStep?.color || 'blue'}-100 text-${currentStep?.color || 'blue'}-700 border-none px-4 py-1.5 font-black uppercase tracking-widest text-[10px]`}>
                                    {currentStep?.label || 'Statut inconnu'}
                                </Badge>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{mail.reference}</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{mail.subject}</h1>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-50">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Expéditeur</p>
                                    <p className="text-sm font-bold text-slate-900">{mail.sender || 'Non spécifié'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Dossier Lié</p>
                                    <p className="text-sm font-bold text-indigo-600">{mail.dossier?.reference || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Priorité</p>
                                    <Badge variant={mail.priority === 'URGENT' ? 'destructive' : 'default'} className="mt-1">
                                        {mail.priority}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Reçu le</p>
                                    <p className="text-sm font-bold text-slate-900">{formatDate(mail.receivedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Workflow Visualization */}
                    <Card className="border-none shadow-sm bg-slate-950 text-white overflow-hidden rounded-3xl">
                        <CardHeader className="p-8 border-b border-white/5">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl font-black italic tracking-widest flex items-center gap-2">
                                    <History className="h-5 w-5 text-indigo-400" /> TRACKING DE LA PROCÉDURE
                                </CardTitle>
                                <Badge variant="outline" className="text-indigo-400 border-indigo-500/30">Sync v2.1</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 md:p-12 overflow-x-auto no-scrollbar">
                            <div className="relative flex justify-between items-center px-4 min-w-[600px] md:min-w-0">
                                <div className="absolute top-5 left-10 right-10 h-0.5 bg-white/10" />

                                {mail.workflow?.steps.map((step: any, idx: number) => {
                                    const isDone = idx < currentStepIndex
                                    const isCurrent = idx === currentStepIndex

                                    return (
                                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-4 px-2">
                                            <div className={`h-8 w-8 md:h-10 md:w-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${isDone ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' :
                                                isCurrent ? 'bg-white border-white text-slate-950 animate-pulse scale-110 shadow-2xl' :
                                                    'bg-slate-900 border-white/10 text-white/40'
                                                }`}>
                                                {isDone ? <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" /> : <span className="text-[10px] md:text-xs font-black">{idx + 1}</span>}
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-1 text-center whitespace-nowrap ${isCurrent ? 'text-white' : 'text-white/40'}`}>
                                                    {step.label}
                                                </span>
                                                {isCurrent && <div className="h-1 w-1 rounded-full bg-indigo-500 animate-bounce" />}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Section */}
                    <Card className="border-slate-100 shadow-sm rounded-3xl">
                        <CardHeader className="p-8 border-b border-slate-50">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Message & Documents Scannés
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-8 rounded-3xl border border-slate-100 min-h-64 whitespace-pre-wrap">
                                {mail.content || "Le contenu de ce courrier n'a pas encore été analysé par OCR."}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Actions & Timeline */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Action Hub */}
                    <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden ring-1 ring-slate-100">
                        <div className="bg-indigo-600 p-8 text-white relative">
                            <div className="absolute top-0 right-0 p-8 opacity-20"><Zap className="h-16 w-16" /></div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Action Directe</h3>
                            <p className="text-indigo-100/70 text-[10px] font-bold uppercase tracking-widest mt-1">Gouvernance & Validation</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Note de Transition</h4>
                                <Textarea
                                    placeholder="Ajoutez un commentaire ou une directive pour la prochaine étape..."
                                    className="bg-slate-50 border-slate-100 min-h-[120px] rounded-2xl p-4 text-sm focus:ring-indigo-600"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>

                            {nextStep ? (
                                <Button
                                    className="w-full h-16 bg-slate-900 text-white hover:bg-black font-black flex items-center justify-between px-8 rounded-2xl group transition-all"
                                    onClick={() => handleTransition(nextStep.id)}
                                    disabled={loading}
                                >
                                    <div className="text-left">
                                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-black">Passer à l'étape</p>
                                        <p className="text-sm">{nextStep.label}</p>
                                    </div>
                                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            ) : (
                                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center gap-3 text-center">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Workflow Terminé</p>
                                </div>
                            )}

                            <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                                <Button variant="ghost" className="h-12 border border-slate-100 rounded-xl text-xs font-bold text-slate-500">
                                    RETOUR ÉTAPE PRÉC.
                                </Button>
                                <Button variant="ghost" className="h-12 border border-slate-100 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-700">
                                    REJETTER / ANOMALIE
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Timeline Log */}
                    <Card className="border-slate-100 shadow-sm rounded-3xl">
                        <CardHeader className="p-8 border-b border-slate-50">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Journal d'Audit</CardTitle>
                        </CardHeader>
                        <div className="p-8 space-y-8">
                            {mail.activities?.map((activity: any, i: number) => (
                                <div key={activity.id} className="relative flex gap-4">
                                    {i < mail.activities.length - 1 && <div className="absolute left-4 top-10 bottom-0 w-px bg-slate-100" />}
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 shadow-sm relative z-10">
                                        <Info className="h-3 w-3 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 leading-tight">
                                            {activity.user?.name}
                                            <span className="text-slate-400 font-medium ml-1">a marqué l'étape</span>
                                            <span className="text-indigo-600 block sm:inline ml-1 font-black underline uppercase text-[10px]">{activity.toStep || activity.action}</span>
                                        </p>
                                        {activity.comment && <p className="text-[11px] text-slate-500 italic mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">{activity.comment}</p>}
                                        <p className="text-[9px] text-slate-400 mt-2 font-mono">{formatDate(activity.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
