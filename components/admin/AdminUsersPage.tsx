
"use client"

import { useState } from 'react'
import { Users, Settings, Shield, Activity, Plus, Key, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createUser, updateUserStatus, updateUserPermissions } from '@/app/actions'
import { Checkbox } from "@/components/ui/checkbox"

// Define available permissions
const PERMISSIONS_LIST = [
    { id: 'VIEW_FINANCE', label: 'Voir Finances & CARPA' },
    { id: 'MANAGE_FINANCE', label: 'Gérer Transactions (CARPA/Frais)' },
    { id: 'MANAGE_USERS', label: 'Gérer Utilisateurs (Admin)' },
    { id: 'DELETE_DOSSIER', label: 'Supprimer Dossiers' },
    { id: 'EXPORT_DATA', label: 'Exporter Données' },
]

export default function AdminUsersPage({ users }: { users: any[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isPermOpen, setIsPermOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [selectedPerms, setSelectedPerms] = useState<string[]>([])

    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'AVOCAT', hourlyRate: '200' })

    const handleCreate = async () => {
        await createUser(newUser)
        setIsCreateOpen(false)
        setNewUser({ name: '', email: '', role: 'AVOCAT', hourlyRate: '200' })
    }

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        await updateUserStatus(id, !currentStatus)
    }

    const openPerms = (user: any) => {
        setSelectedUser(user)
        try {
            setSelectedPerms(JSON.parse(user.permissions || '[]'))
        } catch {
            setSelectedPerms([])
        }
        setIsPermOpen(true)
    }

    const handleSavePerms = async () => {
        if (!selectedUser) return
        await updateUserPermissions(selectedUser.id, selectedPerms)
        setIsPermOpen(false)
    }

    const togglePerm = (permId: string) => {
        if (selectedPerms.includes(permId)) {
            setSelectedPerms(selectedPerms.filter(p => p !== permId))
        } else {
            setSelectedPerms([...selectedPerms, permId])
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">Utilisateurs & Rôles</h2>
                    <p className="text-slate-500">Gérez les accès et les collaborateurs du cabinet.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-900 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Nouvel Utilisateur
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer un compte</DialogTitle>
                            <DialogDescription>Ajouter un collaborateur au système.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Nom complet</Label>
                                <Input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Rôle</Label>
                                    <Select value={newUser.role} onValueChange={v => setNewUser({ ...newUser, role: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ADMIN">Administrateur</SelectItem>
                                            <SelectItem value="AVOCAT">Avocat</SelectItem>
                                            <SelectItem value="SECRETAIRE">Secrétaire</SelectItem>
                                            <SelectItem value="COLLABORATEUR">Collaborateur</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Taux Horaire Standard (FCFA/h)</Label>
                                    <Input type="number" value={newUser.hourlyRate} onChange={e => setNewUser({ ...newUser, hourlyRate: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate}>Créer Compte</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Permissions Dialog */}
                <Dialog open={isPermOpen} onOpenChange={setIsPermOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Gérer les Privilèges</DialogTitle>
                            <DialogDescription>
                                Définissez les droits d'accès pour {selectedUser?.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-4">
                                {PERMISSIONS_LIST.map((perm) => (
                                    <div key={perm.id} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50">
                                        <Checkbox
                                            id={perm.id}
                                            checked={selectedPerms.includes(perm.id)}
                                            onCheckedChange={() => togglePerm(perm.id)}
                                        />
                                        <label
                                            htmlFor={perm.id}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                                        >
                                            {perm.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSavePerms} className="bg-slate-900 text-white">
                                <SaveIcon className="mr-2 h-4 w-4" /> Enregistrer Privilèges
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Rôle</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Privilèges</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            let permCount = 0
                            try { permCount = JSON.parse(user.permissions || '[]').length } catch { }

                            return (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                {user.name?.substring(0, 2).toUpperCase()}
                                            </div>
                                            {user.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{user.role}</Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-500">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200" onClick={() => openPerms(user)}>
                                            {permCount} accès spécial(x)
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.active ? 'success' : 'destructive'}>
                                            {user.active ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => openPerms(user)}>
                                                <Key className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => toggleStatus(user.id, user.active)}>
                                                {user.active ? 'Désactiver' : 'Activer'}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

function SaveIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    )
}
