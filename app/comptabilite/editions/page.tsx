
import { prisma } from '@/lib/prisma'
import { getAgedBalance, getVATReport } from '@/app/actions'
import { AgedBalanceView } from '@/components/comptabilite/AgedBalanceView'
import { VATReportView } from '@/components/comptabilite/VATReportView'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer, CalendarDays, Receipt } from "lucide-react"

export default async function EditionsPage() {
    const agedBalance = await getAgedBalance()
    const now = new Date()
    const vatReport = await getVATReport(now.getMonth() + 1, now.getFullYear())

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Éditions & Rapports Financiers</h1>
                <p className="text-slate-500 mt-1">Générez vos états comptables officiels et suivez vos créances.</p>
            </div>

            <Tabs defaultValue="aged" className="w-full">
                <TabsList className="bg-slate-100 p-1 mb-6">
                    <TabsTrigger value="aged" className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4" /> Balance Agée
                    </TabsTrigger>
                    <TabsTrigger value="vat" className="flex items-center">
                        <Receipt className="mr-2 h-4 w-4" /> Déclaration TVA
                    </TabsTrigger>
                    <TabsTrigger value="bilan" className="flex items-center">
                        <Printer className="mr-2 h-4 w-4" /> États OHADA
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="aged">
                    <AgedBalanceView initialData={agedBalance} />
                </TabsContent>

                <TabsContent value="vat">
                    <VATReportView initialData={vatReport} />
                </TabsContent>

                <TabsContent value="bilan">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>États Financiers de Synthèse</CardTitle>
                            <CardDescription>Documents conformes au système minimal de trésorerie (SMT) ou normal.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <BalancePreviewCard title="Bilan" description="Position du patrimoine au 31/12" />
                            <BalancePreviewCard title="Compte de Résultat" description="Activité et formation du profit" />
                            <BalancePreviewCard title="TFT / TAFIRE" description="Flux de trésorerie" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function BalancePreviewCard({ title, description }: { title: string, description: string }) {
    return (
        <Card className="group hover:border-indigo-500 transition-colors cursor-pointer border-slate-200">
            <CardHeader>
                <CardTitle className="text-md group-hover:text-indigo-600">{title}</CardTitle>
                <CardDescription className="text-xs">{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-slate-100 h-32 rounded flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-300 transition-colors">
                    <Printer className="h-10 w-10 rotate-12" />
                </div>
            </CardContent>
        </Card>
    )
}
