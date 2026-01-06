"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    LayoutGrid,
    Building2,
    Users,
    FileBox,
    Settings,
    ChevronRight,
    MapPin,
    BadgeCheck,
    Briefcase,
    ArrowUpRight,
    Search,
    Plus,
    Building
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Office {
    id: string
    name: string
    location: string
    manager: string
    staffCount: number
    activeCases: number
    status: 'OPEN' | 'BUSY' | 'CLOSED'
}

const MOCK_OFFICES: Office[] = [
    { id: '1', name: 'LexPremium Dakar', location: 'Plateau, Rue Carnot', manager: 'Me. Sy', staffCount: 12, activeCases: 145, status: 'OPEN' },
    { id: '2', name: 'LexPremium Saint-Louis', location: 'Quartier Nord', manager: 'Me. Kane', staffCount: 4, activeCases: 32, status: 'OPEN' },
    { id: '3', name: 'LexPremium Mbour', location: 'Saly Portudal', manager: 'Me. Diop', staffCount: 2, activeCases: 18, status: 'BUSY' },
]

export function MultiSiteManager() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_OFFICES.map((office) => (
                    <motion.div
                        key={office.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card className="border-none shadow-xl overflow-hidden bg-white group cursor-pointer">
                            <div className={`h-1.5 w-full ${office.status === 'OPEN' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter">
                                        ID: {office.id}
                                    </Badge>
                                </div>

                                <div>
                                    <h4 className="text-xl font-black text-slate-900 tracking-tight">{office.name}</h4>
                                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest mt-1">
                                        <MapPin className="h-3 w-3" /> {office.location}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Collaborateurs</p>
                                        <p className="text-sm font-black text-slate-900">{office.staffCount}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dossiers Actifs</p>
                                        <p className="text-sm font-black text-slate-900">{office.activeCases}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center">
                                            <Users className="h-3 w-3 text-indigo-600" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-600">{office.manager}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-400 transition-all cursor-pointer flex flex-col items-center justify-center p-8 group">
                    <div className="h-14 w-14 bg-white rounded-full shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="h-6 w-6 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <p className="text-sm font-black text-slate-500 group-hover:text-indigo-600 uppercase tracking-widest">Nouveau Bureau</p>
                </Card>
            </div>
        </div>
    )
}
