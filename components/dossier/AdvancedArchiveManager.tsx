"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Archive,
    Box,
    FileText,
    Search,
    Calendar,
    MapPin,
    ShieldAlert,
    QrCode,
    History,
    ChevronRight,
    Filter,
    ArrowUpRight,
    Boxes
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface ArchiveBox {
    id: string
    code: string
    location: string
    status: 'ACTIVE' | 'FULL' | 'ARCHIVED'
    docCount: number
    retentionDate: string
}

const MOCK_BOXES: ArchiveBox[] = [
    { id: '1', code: 'BOX-2024-001', location: 'RAYON-A1', status: 'FULL', docCount: 45, retentionDate: '2034-12-31' },
    { id: '2', code: 'BOX-2024-002', location: 'RAYON-A1', status: 'ACTIVE', docCount: 12, retentionDate: '2034-12-31' },
    { id: '3', code: 'BOX-2023-042', location: 'DEPOT-SECURE', status: 'ARCHIVED', docCount: 50, retentionDate: '2033-01-15' },
]

export function AdvancedArchiveManager() {
    const [view, setView] = useState<'GRID' | 'LIST'>('GRID')
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="space-y-8">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="Boîtes Totales" value="124" icon={Boxes} color="blue" />
                <StatCard label="Documents Archivés" value="5,842" icon={FileText} color="indigo" />
                <StatCard label="Espace Libre" value="12%" icon={Archive} color="amber" />
                <StatCard label="Destruction 2026" value="12 Boîtes" icon={ShieldAlert} color="red" />
            </div>

            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <div>
                        <CardTitle className="text-2xl font-black text-slate-900">Archivage Intelligent LexAI</CardTitle>
                        <CardDescription>Gestion hybride des archives physiques et numériques.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <QrCode className="h-4 w-4" /> Scanner QR
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                            <Box className="h-4 w-4" /> Nouvelle Boîte
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Rechercher par code, client ou document..."
                                className="pl-10 border-slate-200 focus:ring-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                            <Tabs defaultValue="all" className="w-auto">
                                <TabsList>
                                    <TabsTrigger value="all">Tout</TabsTrigger>
                                    <TabsTrigger value="active">Actif</TabsTrigger>
                                    <TabsTrigger value="archived">Dépot</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {MOCK_BOXES.map((box) => (
                                <motion.div
                                    key={box.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <ArchiveBoxCard box={box} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Retention Timeline */}
            <Card className="border-none shadow-lg overflow-hidden">
                <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-indigo-400" />
                        <span className="font-bold text-sm tracking-tight">Timeline de Conservation</span>
                    </div>
                    <Badge variant="outline" className="text-white border-white/20">Planning 2026-2030</Badge>
                </div>
                <CardContent className="p-0">
                    <div className="flex overflow-x-auto p-6 gap-8">
                        {[2026, 2027, 2028, 2029, 2030].map((year) => (
                            <div key={year} className="flex-shrink-0 w-48 group">
                                <div className="text-xs font-black text-slate-400 mb-2">{year}</div>
                                <div className="h-2 w-full bg-slate-100 rounded-full mb-4 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 h-full bg-indigo-500 w-1/3" />
                                </div>
                                <div className="space-y-2">
                                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all cursor-pointer">
                                        <p className="text-[10px] font-bold text-slate-900">Destruction Auto</p>
                                        <p className="text-[10px] text-slate-500">12 boîtes (Archives 2016)</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function ArchiveBoxCard({ box }: { box: ArchiveBox }) {
    const statusConfig = {
        ACTIVE: { label: 'En cours', color: 'bg-emerald-100 text-emerald-700' },
        FULL: { label: 'Pleine', color: 'bg-amber-100 text-amber-700' },
        ARCHIVED: { label: 'Archivée', color: 'bg-slate-100 text-slate-700' }
    }

    return (
        <Card className="group hover:border-indigo-400 transition-all cursor-pointer overflow-hidden border-2 border-slate-100">
            <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                            <Box className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900">{box.code}</h4>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <MapPin className="h-3 w-3" /> {box.location}
                            </div>
                        </div>
                    </div>
                    <Badge className={statusConfig[box.status].color}>{statusConfig[box.status].label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-2 rounded-lg">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Documents</p>
                        <p className="text-sm font-black text-slate-900">{box.docCount}</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Retention</p>
                        <p className="text-sm font-black text-slate-900">{new Date(box.retentionDate).getFullYear()}</p>
                    </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-6 w-6 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center">
                                <FileText className="h-3 w-3 text-slate-400" />
                            </div>
                        ))}
                        <div className="h-6 w-6 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[8px] font-bold text-indigo-600">
                            +{box.docCount - 3}
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                        <ArrowUpRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="h-1 w-full bg-slate-100">
                <div className={`h-full ${box.status === 'FULL' ? 'bg-amber-500 w-full' : box.status === 'ACTIVE' ? 'bg-indigo-500 w-1/4' : 'bg-slate-400 w-full'}`} />
            </div>
        </Card>
    )
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
    const colors: Record<string, string> = {
        blue: "text-blue-600 bg-blue-50",
        indigo: "text-indigo-600 bg-indigo-50",
        amber: "text-amber-600 bg-amber-50",
        red: "text-red-600 bg-red-50"
    }
    return (
        <Card className="border-none shadow-md overflow-hidden group">
            <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colors[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                    <p className="text-2xl font-black text-slate-900">{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}
