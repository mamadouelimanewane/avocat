
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Users, Calendar, Wallet, Receipt, Files, Scale, KanbanSquare, Settings } from "lucide-react"

const modules = [
    { name: "Dossiers", href: "/dossiers", icon: Briefcase, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
    { name: "Clients", href: "/clients", icon: Users, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
    { name: "Agenda", href: "/agenda", icon: Calendar, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40" },
    { name: "Comptabilité", href: "/comptabilite", icon: Wallet, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
    { name: "Facturation", href: "/factures", icon: Receipt, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/40" },
    { name: "GED / Fichiers", href: "/documents", icon: Files, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/40" },
    { name: "Bibliothèque", href: "/jurisprudence", icon: Scale, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/40" },
    { name: "Workflow", href: "/workflows", icon: KanbanSquare, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40" },
]

export function ModuleGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {modules.map((mod) => (
                <Link key={mod.name} href={mod.href}>
                    <Card className="hover:shadow-lg transition-all duration-200 border-none shadow-sm h-full group cursor-pointer bg-white dark:bg-slate-950 ring-1 ring-slate-200 dark:ring-slate-800">
                        <CardContent className="p-4 flex flex-col items-center justify-center gap-3 h-full">
                            <div className={`p-4 rounded-xl ${mod.bg} ${mod.color} group-hover:scale-110 transition-transform`}>
                                <mod.icon className="h-8 w-8" />
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center">{mod.name}</span>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
