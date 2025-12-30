
export const dynamic = 'force-dynamic'

import { PrismaClient } from '@prisma/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminUsersPage from '@/components/admin/AdminUsersPage'
import AdminSettingsPage from '@/components/admin/AdminSettingsPage'
import AdminSecurityPage from '@/components/admin/AdminSecurityPage'
import AdminRolesPage from '@/components/admin/AdminRolesPage'
import { getUsers, getCabinetSettings, getRoles } from '@/app/actions'

const prisma = new PrismaClient()

export default async function AdminPage() {
    // Parallel data fetching
    const usersData = getUsers()
    const settingsData = getCabinetSettings()
    const rolesData = getRoles()

    const [users, settings, roles] = await Promise.all([usersData, settingsData, rolesData])

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Administration</h1>
                    <p className="text-slate-500 mt-1">Supervision globale et configuration du cabinet.</p>
                </div>
            </div>

            <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[800px] mb-8">
                    <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                    <TabsTrigger value="roles">Rôles & Permissions</TabsTrigger>
                    <TabsTrigger value="settings">Paramètres Cabinet</TabsTrigger>
                    <TabsTrigger value="security">Sécurité & Sauvegarde</TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                    <AdminUsersPage users={users} roles={roles} />
                </TabsContent>

                <TabsContent value="roles">
                    <AdminRolesPage roles={roles} />
                </TabsContent>

                <TabsContent value="settings">
                    <AdminSettingsPage settings={settings} />
                </TabsContent>

                <TabsContent value="security">
                    <AdminSecurityPage />
                </TabsContent>
            </Tabs>
        </div>
    )
}
