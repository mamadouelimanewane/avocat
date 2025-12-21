
import { PrismaClient } from '@prisma/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminUsersPage from '@/components/admin/AdminUsersPage'
import AdminSettingsPage from '@/components/admin/AdminSettingsPage'
import { getUsers, getCabinetSettings } from '@/app/actions'

const prisma = new PrismaClient()

export default async function AdminPage() {
    // Parallel data fetching
    const usersData = getUsers()
    const settingsData = getCabinetSettings()

    const [users, settings] = await Promise.all([usersData, settingsData])

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Administration</h1>
                    <p className="text-slate-500 mt-1">Supervision globale et configuration.</p>
                </div>
            </div>

            <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-8">
                    <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                    <TabsTrigger value="settings">Paramètres Cabinet</TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                    <AdminUsersPage users={users} />
                </TabsContent>

                <TabsContent value="settings">
                    <AdminSettingsPage settings={settings} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
