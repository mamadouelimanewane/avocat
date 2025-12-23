
import { PrismaClient } from '@prisma/client'
import { TasksView } from '@/components/tasks/TasksView'
import { getCollaborators, getTasks, getDossiersList } from '@/app/actions'

export default async function TachesPage() {
    const tasks = await getTasks()
    const { users } = await getCollaborators()
    const dossiers = await getDossiersList()

    return (
        <div className="container mx-auto max-w-5xl py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tâches & Délégations</h1>
                <p className="text-slate-500 mt-2">Suivez le travail de vos collaborateurs et stagiaires.</p>
            </div>

            <TasksView tasks={tasks as any} users={users || []} dossiers={dossiers} />
        </div>
    )
}
