"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Mail as MailIcon,
    Inbox,
    Send,
    Clock,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    MoreHorizontal,
    Search,
    Plus,
    Filter,
    Layers,
    ChevronDown,
    Zap
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface CourrierDashboardProps {
    mails: any[]
    workflows: any[]
    stats: any
}

export default function CourrierDashboard({ mails, workflows, stats }: CourrierDashboardProps) {
    const [filter, setFilter] = useState('ALL')
    const [search, setSearch] = useState('')

    const filteredMails = mails.filter(m => {
        const matchesSearch = m.subject.toLowerCase().includes(search.toLowerCase()) ||
            m.reference.toLowerCase().includes(search.toLowerCase())
        if (filter === 'ALL') return matchesSearch
        return matchesSearch && m.type === filter
    })

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">GESTION DU COURRIER</h1>
                    <p className="text-slate-500 font-medium">Workflows dynamiques & Validation en cascade</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-11 border-slate-200 shadow-sm font-bold">
                        <Filter className="h-4 w-4 mr-2" /> Workflow Builder
                    </Button>
                    <Button className="h-11 bg-slate-950 text-white font-bold px-6 shadow-xl shadow-slate-200 hover:shadow-2xl transition-all">
                        <Plus className="h-4 w-4 mr-2" /> Nouveau Courrier
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm bg-indigo-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Total Courriers</p>
                                <h3 className="text-3xl font-black">{stats.total}</h3>
                            </div>
                            <Inbox className="h-6 w-6 text-white/30" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">En Cours de Traitement</p>
                                <h3 className="text-3xl font-black text-slate-900">{stats.pending}</h3>
                            </div>
                            <Clock className="h-6 w-6 text-slate-200" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-rose-50 border border-rose-100">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-rose-600/70 text-xs font-bold uppercase tracking-widest mb-1">Alertes / Urgents</p>
                                <h3 className="text-3xl font-black text-rose-600">{stats.urgent}</h3>
                            </div>
                            <AlertCircle className="h-6 w-6 text-rose-200" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-emerald-50 border border-emerald-100">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-emerald-600/70 text-xs font-bold uppercase tracking-widest mb-1">Validés ce mois</p>
                                <h3 className="text-3xl font-black text-emerald-600">--</h3>
                            </div>
                            <CheckCircle2 className="h-6 w-6 text-emerald-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {['ALL', 'INBOUND', 'OUTBOUND'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${filter === t ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {t === 'ALL' ? 'Tous' : t === 'INBOUND' ? 'Entrants' : 'Sortants'}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher un numéro, objet..."
                            className="pl-10 h-10 bg-white border-slate-200 rounded-xl text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    {filteredMails.length > 0 ? filteredMails.map((mail, i) => {
                        const currentStep = mail.workflow?.steps.find((s: any) => s.id === mail.currentStepId)
                        const progress = mail.workflow ? ((mail.workflow.steps.findIndex((s: any) => s.id === mail.currentStepId) + 1) / mail.workflow.steps.length) * 100 : 0

                        return (
                            <motion.div
                                key={mail.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-slate-50/80 transition-all p-4 md:p-6 cursor-pointer"
                            >
                                <Link href={`/courrier/${mail.id}`} className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
                                    <div className="flex items-center gap-4 w-full lg:w-auto">
                                        <div className={`p-3 md:p-4 rounded-2xl ${mail.type === 'INBOUND' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'} shrink-0 group-hover:scale-110 transition-transform`}>
                                            {mail.type === 'INBOUND' ? <Inbox className="h-5 w-5 md:h-6 md:w-6" /> : <Send className="h-5 w-5 md:h-6 md:w-6" />}
                                        </div>
                                        <div className="flex-1 min-w-0 lg:hidden">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{mail.reference}</span>
                                                {mail.priority === 'URGENT' && <Badge className="bg-rose-100 text-rose-600 border-none text-[8px] h-4">URGENT</Badge>}
                                            </div>
                                            <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{mail.subject}</h4>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0 hidden lg:block">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{mail.reference}</span>
                                            <div className="h-1 w-1 rounded-full bg-slate-300" />
                                            <span className="text-[10px] font-bold text-slate-500">{formatDate(mail.receivedAt)}</span>
                                            {mail.priority === 'URGENT' && <Badge className="bg-rose-100 text-rose-600 border-none text-[8px] h-4">URGENT</Badge>}
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{mail.subject}</h4>
                                        <p className="text-sm text-slate-500 font-medium">
                                            {mail.type === 'INBOUND' ? `Exp : ${mail.sender}` : `Dest : ${mail.recipient}`}
                                            {mail.dossier && <span className="text-indigo-500 ml-2 italic"> • {mail.dossier.reference}</span>}
                                        </p>
                                    </div>

                                    {/* Mobile/Tablet Subtext */}
                                    <div className="lg:hidden w-full">
                                        <p className="text-xs text-slate-500 font-medium mb-2">
                                            {mail.type === 'INBOUND' ? `Exp : ${mail.sender}` : `Dest : ${mail.recipient}`}
                                            <span className="text-slate-300 mx-2">|</span>
                                            {formatDate(mail.receivedAt)}
                                        </p>
                                    </div>

                                    {/* Workflow Context */}
                                    <div className="w-full lg:w-72 shrink-0 bg-slate-50/50 lg:bg-transparent p-3 lg:p-0 rounded-xl lg:rounded-none">
                                        <div className="flex justify-between items-end mb-2">
                                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter">Étape : <span className="text-indigo-600">{currentStep?.label || 'N/A'}</span></p>
                                            <span className="text-[10px] font-mono font-bold text-slate-900">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-700 bg-${currentStep?.color || 'indigo'}-500 shadow-[0_0_10px_rgba(79,70,229,0.2)]`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="hidden lg:block shrink-0 text-slate-300 group-hover:text-indigo-500 transition-colors">
                                        <ChevronDown className="h-6 w-6 -rotate-90" />
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    }) : (
                        <div className="py-20 text-center">
                            <Layers className="h-20 w-20 text-slate-100 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun courrier trouvé</p>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Assistant Banner */}
            <Card className="bg-gradient-to-r from-slate-900 to-indigo-900 border-none shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <CardContent className="p-10 relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="h-24 w-24 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-700">
                        <Zap className="h-12 w-12 text-indigo-400 fill-indigo-400/20" />
                    </div>
                    <div className="space-y-2">
                        <Badge className="bg-indigo-500 text-white border-none mb-2">LexAI Intelligence</Badge>
                        <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">Automatisation du Tri & Synthèse</h2>
                        <p className="text-indigo-100/70 max-w-xl text-lg leading-relaxed">
                            Laissez l'IA LexPremium classer automatiquement vos courriers entrants, suggérer des workflows et préparer des brouillons de réponse en un clic.
                        </p>
                    </div>
                    <Button className="ml-auto bg-white text-slate-950 hover:bg-slate-100 font-black px-10 py-7 rounded-2xl shadow-2xl group-hover:translate-x-2 transition-all">
                        ACTIVER LEXCOURRIER IA
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
