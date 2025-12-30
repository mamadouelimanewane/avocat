import Link from 'next/link'
import { Scale, FileText, Briefcase, Bell, User, Menu } from 'lucide-react'
import { LogoutButton } from '@/components/portal/LogoutButton'
import { getPortalDashboardData } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PortalMessenger } from '@/components/portal/PortalMessenger'

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { client } = await getPortalDashboardData()
    const clientName = client?.name || "Client"

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/portal" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-slate-900">
                            <div className="bg-indigo-600 p-1.5 rounded-lg">
                                <Scale className="h-6 w-6 text-white" />
                            </div>
                            <span>LEX<span className="text-indigo-600">PORTAL</span></span>
                        </Link>
                        <div className="hidden sm:block h-6 w-px bg-slate-200 mx-2" />
                        <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-indigo-50 text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
                            Accès Sécurisé
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-500">
                        <Link href="/portal" className="hover:text-indigo-600 transition-colors flex items-center gap-2 px-1 py-6 border-b-2 border-transparent hover:border-indigo-600">
                            <Briefcase className="h-4 w-4" /> Dossiers
                        </Link>
                        <Link href="/portal/factures" className="hover:text-indigo-600 transition-colors flex items-center gap-2 px-1 py-6 border-b-2 border-transparent hover:border-indigo-600">
                            <FileText className="h-4 w-4" /> Facturation
                        </Link>
                        <Link href="/portal/documents" className="hover:text-indigo-600 transition-colors flex items-center gap-2 px-1 py-6 border-b-2 border-transparent hover:border-indigo-600">
                            <FileText className="h-4 w-4" /> Documents
                        </Link>
                        <Link href="/portal/profil" className="hover:text-indigo-600 transition-colors flex items-center gap-2 px-1 py-6 border-b-2 border-transparent hover:border-indigo-600">
                            <User className="h-4 w-4" /> Profil
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="text-slate-400 relative hover:bg-slate-50">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white" />
                        </Button>

                        <div className="h-8 w-px bg-slate-200 mx-1" />

                        <div className="hidden sm:flex flex-col items-end mr-1">
                            <span className="text-xs font-bold text-slate-900 leading-none mb-1">{clientName}</span>
                            <span className="text-[10px] text-slate-500 font-medium">Compte Premium</span>
                        </div>

                        <LogoutButton />

                        <Button variant="ghost" size="icon" className="md:hidden text-slate-600">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation (Floating Bottom Bar) */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
                <nav className="bg-slate-900/90 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl px-6 py-3 flex items-center justify-between text-white/70">
                    <Link href="/portal" className="flex flex-col items-center gap-1 text-white">
                        <Briefcase className="h-5 w-5" />
                        <span className="text-[10px] font-bold">Dossiers</span>
                    </Link>
                    <Link href="/portal/factures" className="flex flex-col items-center gap-1 hover:text-white transition-colors">
                        <FileText className="h-5 w-5" />
                        <span className="text-[10px] font-bold">Factures</span>
                    </Link>
                    <Link href="/portal/dossiers" className="p-3 bg-indigo-600 rounded-full -translate-y-6 shadow-lg shadow-indigo-500/50 text-white">
                        <Scale className="h-6 w-6" />
                    </Link>
                    <Button variant="ghost" className="flex flex-col items-center gap-1 hover:text-white p-0 h-auto">
                        <Bell className="h-5 w-5" />
                        <span className="text-[10px] font-bold">Alertes</span>
                    </Button>
                    <Link href="/portal/profil" className="flex flex-col items-center gap-1 hover:text-white transition-colors">
                        <User className="h-5 w-5" />
                        <span className="text-[10px] font-bold">Profil</span>
                    </Link>
                </nav>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-slate-200 py-10 mt-12 pb-24 md:pb-10">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 opacity-50 grayscale">
                        <Scale className="h-5 w-5" />
                        <span className="font-bold tracking-tighter">LEXPREMIUM</span>
                    </div>
                    <div className="text-center md:text-right text-slate-400 text-xs">
                        <p>&copy; 2024 Cabinet LexPremium. Tous droits réservés.</p>
                        <p className="mt-1">Infrastructures certifiées conforme RGPD & OHADA.</p>
                    </div>
                </div>
            </footer>

            <PortalMessenger />
        </div>
    )
}
