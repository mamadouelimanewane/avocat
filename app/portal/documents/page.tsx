import { getPortalDashboardData } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Download, Search, Filter, ShieldCheck, Share2, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { redirect } from 'next/navigation'

export default async function PortalDocumentsVault() {
    const { success, client } = await getPortalDashboardData()

    if (!success || !client) redirect('/portal/login')

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-indigo-600" />
                        Coffre-fort Numérique
                    </h1>
                    <p className="text-slate-500 mt-1">Accédez à tous vos documents juridiques archivés et sécurisés.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Download className="mr-2 h-4 w-4" />
                    Tout Télécharger (ZIP)
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Rechercher par nom, date ou dossier..." className="pl-10 h-11" />
                </div>
                <Button variant="outline" className="h-11">
                    <Filter className="mr-2 h-4 w-4" /> Filtres Avancés
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stats / Categories */}
                <div className="md:col-span-1 space-y-4">
                    <Card className="border-none shadow-sm bg-indigo-50/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Classification</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start text-indigo-700 font-bold bg-white shadow-sm">
                                Tous les fichiers <span className="ml-auto opacity-50 px-2">12</span>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-slate-600">
                                Contrats & Actes <span className="ml-auto opacity-50 px-2">5</span>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-slate-600">
                                Pièces de Procédure <span className="ml-auto opacity-50 px-2">4</span>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-slate-600">
                                Factures & Recus <span className="ml-auto opacity-50 px-2">3</span>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-slate-900 text-white p-6 relative overflow-hidden">
                        <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-white/10 rounded-full blur-xl" />
                        <h3 className="font-bold mb-2">Sécurité Maximale</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Vos documents sont chiffrés AES-256 et stockés sur des serveurs conformes au secret professionnel.
                        </p>
                    </Card>
                </div>

                {/* File List */}
                <div className="md:col-span-3">
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 divide-y divide-slate-100">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-4 sm:gap-6">
                                            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                    {i === 1 ? "Conclusions_Recapitulatives_V final.pdf" :
                                                        i === 2 ? "Acte_Cession_Parts_Sociales.docx" :
                                                            i === 3 ? "Justificatif_Paiement_Greffe.png" :
                                                                `Document_Juridique_0${i}.pdf`}
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                                                    <span>Ajouté le {formatDate(new Date())}</span>
                                                    <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                                    <span>{(2.4 * i).toFixed(1)} MB</span>
                                                    <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                                    <span className="text-emerald-600 font-medium">Vérifié</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                                                <Download className="h-5 w-5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hidden sm:flex">
                                                <Share2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 text-center border-t border-slate-50">
                                <Button variant="link" className="text-indigo-600 font-bold">
                                    Charger plus de documents
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
