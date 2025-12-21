
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NewDossierForm from '@/components/dossier/NewDossierForm'

const prisma = new PrismaClient()

export default async function NewDossierPage() {
    const clients = await prisma.client.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dossiers">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Nouveau Dossier</h1>
                    <p className="text-slate-500">Ouverture d'une nouvelle affaire</p>
                </div>
            </div>

            <NewDossierForm clients={clients} />
        </div>
    )
}
