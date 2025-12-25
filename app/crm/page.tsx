
import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Phone, Mail, FileText, ArrowRight, UserPlus } from "lucide-react"
import { NewProspectDialog } from "@/components/crm/NewProspectDialog"
import { CrmBoard } from "@/components/crm/CrmBoard"

const prisma = new PrismaClient()

export default async function CrmPage() {
    const clients = await prisma.client.findMany({
        where: {
            status: { in: ['PROSPECT', 'NEGOTIATION', 'TO_CONVERT'] }
        },
        orderBy: { createdAt: 'desc' }
    })

    const prospectsCount = clients.filter(c => c.status === 'PROSPECT').length
    const negotiationCount = clients.filter(c => c.status === 'NEGOTIATION').length
    const toConvertCount = clients.filter(c => c.status === 'TO_CONVERT').length

    const StatsCard = ({ title, count, color }: { title: string, count: number, color: string }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${color}`}>{count}</div>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">CRM & Développement</h1>
                    <p className="text-slate-500 mt-1">Gérez vos opportunités commerciales et convertissez vos prospects.</p>
                </div>
                <NewProspectDialog />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatsCard title="Nouveaux Prospects" count={prospectsCount} color="text-slate-600" />
                <StatsCard title="En Négociation" count={negotiationCount} color="text-indigo-600" />
                <StatsCard title="Prêts à signer" count={toConvertCount} color="text-emerald-600" />
                <StatsCard title="Total Pipeline" count={clients.length} color="text-blue-600" />
            </div>

            <CrmBoard initialClients={clients} />
        </div>
    )
}
