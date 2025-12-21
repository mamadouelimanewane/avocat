
import Link from 'next/link'
import { Scale, FileText, Briefcase, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/portal" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
                            <Scale className="h-6 w-6 text-indigo-600" />
                            <span>LEX<span className="text-indigo-600">PORTAL</span></span>
                        </Link>
                        <span className="ml-4 px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-500 font-medium">Espace Client</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <Link href="/portal" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                            <Briefcase className="h-4 w-4" /> Mes Dossiers
                        </Link>
                        <Link href="/portal/factures" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Mes Factures
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-sm font-medium text-slate-900">M. Jean Dupont</span>
                            <span className="text-xs text-slate-500">Client Premium</span>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-600">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-slate-200 mt-auto py-8">
                <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
                    <p>&copy; 2024 Cabinet LexPremium. Tous droits réservés.</p>
                    <p className="mt-1">Accès sécurisé et confidentiel.</p>
                </div>
            </footer>
        </div>
    )
}
