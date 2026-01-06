"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Users,
    Phone,
    Mail,
    MoreVertical,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    DollarSign,
    ArrowRight
} from 'lucide-react'
import {
    calculateLeadScore,
    type Lead,
    type ScoringResult,
    getConversionProbability,
    estimateDealValue
} from '@/lib/lead-scoring'

interface LeadKanbanProps {
    initialLeads: Lead[]
}

const STAGES = [
    { id: 'NEW', title: 'Nouveaux', color: 'bg-blue-500' },
    { id: 'CONTACTED', title: 'Contactés', color: 'bg-indigo-500' },
    { id: 'QUALIFIED', title: 'Qualifiés', color: 'bg-amber-500' },
    { id: 'PROPOSAL', title: 'Offre envoyée', color: 'bg-purple-500' },
    { id: 'NEGOTIATION', title: 'Négociation', color: 'bg-orange-500' },
    { id: 'WON', title: 'Gagnés', color: 'bg-emerald-500' }
]

export function LeadKanban({ initialLeads }: LeadKanbanProps) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads)

    const getLeadsByStage = (stageId: string) => {
        return leads.filter(lead => lead.status === stageId)
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(value)
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 h-[calc(100vh-250px)]">
            {STAGES.map(stage => {
                const stageLeads = getLeadsByStage(stage.id)
                const stageValue = stageLeads.reduce((acc, lead) => acc + estimateDealValue(lead), 0)

                return (
                    <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                                <h3 className="font-bold text-slate-900">{stage.title}</h3>
                                <Badge variant="secondary" className="font-mono">{stageLeads.length}</Badge>
                            </div>
                            <span className="text-xs font-bold text-slate-400">{formatCurrency(stageValue)}</span>
                        </div>

                        <div className="flex-1 bg-slate-100/50 rounded-xl p-2 space-y-3 overflow-y-auto">
                            {stageLeads.map(lead => {
                                const scoring = calculateLeadScore(lead)
                                const probability = getConversionProbability(scoring.score)
                                const value = estimateDealValue(lead)

                                return (
                                    <Card key={lead.id} className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 truncate w-48">{lead.name}</h4>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{lead.domaine || 'Général'}</p>
                                                </div>
                                                <Badge className={`${scoring.grade === 'A' ? 'bg-emerald-100 text-emerald-700' :
                                                        scoring.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                                            scoring.grade === 'C' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-red-100 text-red-700'
                                                    } hover:bg-transparent border-none text-[10px]`}>
                                                    Score {scoring.score}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-slate-600">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3 text-slate-400" />
                                                    <span className="font-bold">{formatCurrency(value)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="h-3 w-3 text-slate-400" />
                                                    <span>{probability}% prob.</span>
                                                </div>
                                            </div>

                                            <div className="pt-2 flex items-center justify-between border-t border-slate-50">
                                                <div className="flex -space-x-2">
                                                    <div className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                                                        {lead.source[0]}
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Phone className="h-3.3 w-3.3" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Mail className="h-3.3 w-3.3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {scoring.priority === 'TRÈS HAUTE' && (
                                                <div className="mt-2 text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded flex items-center gap-1 font-bold">
                                                    <AlertCircle className="h-3 w-3" /> PRIORITÉ MAXIMALE
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}

                            {stageLeads.length === 0 && (
                                <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Aucun lead</p>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
