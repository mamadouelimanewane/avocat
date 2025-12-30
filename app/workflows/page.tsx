
export const dynamic = 'force-dynamic'

import { PrismaClient } from '@prisma/client'
import { KanbanBoard } from '@/components/workflow/KanbanBoard'
import { AddColumnButton } from '@/components/workflow/AddColumnButton'
import { getClients } from '@/app/actions'

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
    const columnsData = getData()
    const clientsData = getClients()

    const [columns, clients] = await Promise.all([columnsData, clientsData])

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Workflow Dossiers</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Vue Kanban interactive pour le suivi des affaires.</p>
                </div>
                <AddColumnButton />
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <KanbanBoard initialColumns={columns} clients={clients} />
            </div>
        </div>
    )
}
