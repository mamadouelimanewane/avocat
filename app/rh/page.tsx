
import { getCollaborators, getLeaveRequests } from '@/app/actions'
import { LeaveRequestDialog } from '@/components/rh/LeaveRequestDialog'
import { LeaveList } from '@/components/rh/LeaveList'
import { Users, CalendarDays, Briefcase } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function RHPage() {
    const { users } = await getCollaborators()
    const { requests } = await getLeaveRequests()

    return (
        <div className="container mx-auto max-w-6xl py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <Users className="h-8 w-8 text-indigo-600" />
                        Ressources Humaines
                    </h1>
                    <p className="text-slate-500 mt-2">Gestion des collaborateurs et des congés.</p>
                </div>
                <LeaveRequestDialog users={users || []} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Team Section */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Annuaire Collaborateurs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {users && users.map((user: any) => (
                                    <div key={user.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-slate-50">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.avatarUrl} />
                                            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-slate-900">{user.name}</p>
                                            <p className="text-xs text-slate-500 uppercase">{user.role}</p>
                                            <p className="text-xs text-slate-400">{user.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-indigo-500" />
                                Demandes de Congés
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LeaveList requests={requests || []} />
                        </CardContent>
                    </Card>
                </div>

                {/* KPI Section */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-medium opacity-90">Effectif Total</h3>
                            <p className="text-4xl font-bold mt-2">{users?.length || 0}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase text-slate-500">Planification</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span>Présents aujourd'hui</span>
                                <span className="font-bold text-emerald-600">{(users?.length || 0) - (requests?.filter((r: any) => r.status === 'APPROVED' && new Date() >= new Date(r.startDate) && new Date() <= new Date(r.endDate)).length || 0)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>En Congés</span>
                                <span className="font-bold text-amber-600">{requests?.filter((r: any) => r.status === 'APPROVED' && new Date() >= new Date(r.startDate) && new Date() <= new Date(r.endDate)).length || 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
