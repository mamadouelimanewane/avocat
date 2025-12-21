
import { PrismaClient } from '@prisma/client'
import { KanbanBoard } from '@/components/workflow/KanbanBoard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const prisma = new PrismaClient()

async function getData() {
    const columns = await prisma.kanbanColumn.findMany({
        orderBy: { order: 'asc' },
        include: {
            dossiers: {
                orderBy: { updatedAt: 'desc' },
                include: { client: true }
            }
        }
    })
    return columns
}

export default async function WorkflowPage() {
    const columns = await getData()

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Workflow Dossiers</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Vue Kanban interactive pour le suivi des affaires.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nouvelle Colonne
                </Button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <KanbanBoard initialColumns={columns} />
            </div>
        </div>
    )
}
