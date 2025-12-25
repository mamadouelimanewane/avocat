
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Scale, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function LegalWatchFeed({ items }: { items: any[] }) {
    if (!items || items.length === 0) return null

    return (
        <Card className="h-full border-none shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-red-600 uppercase tracking-wide flex items-center gap-2">
                    <Scale className="h-4 w-4 text-red-500" />
                    Veille Juridique
                </CardTitle>
                <Link href="/jurisprudence" className="text-sm font-bold text-emerald-600 uppercase tracking-wide hover:underline flex items-center">
                    Moteur de Recherche <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="group flex flex-col gap-1 border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                            <div className="flex items-start justify-between">
                                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                                    {item.region}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                            </div>
                            <Link href={`/jurisprudence/${item.id}`} className="block group-hover:text-indigo-600 transition-colors">
                                <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 cursor-pointer hover:underline">
                                    {item.title}
                                </h4>
                            </Link>
                            <p className="text-xs text-slate-500 line-clamp-2">
                                {item.summary || "Pas de résumé disponible."}
                            </p>

                            <div className="flex gap-2 mt-2">
                                <Link href={`/jurisprudence/${item.id}`} className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors">
                                    <BookOpen className="h-3.5 w-3.5 mr-1" />
                                    Voir Document
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
