
"use client"

import { useState } from 'react'
import { Users, Settings, Shield, Activity, Plus, Key, Check, Edit } from 'lucide-react'
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
import { createUser, updateUserStatus, updateUserPermissions, updateUserRole, updateUser } from '@/app/actions'
import { Checkbox } from "@/components/ui/checkbox"

// Define available permissions
const PERMISSION_GROUPS = [
    {
        name: 'Dossiers & Clients',
        order: 1,
        permissions: [
            { id: 'VIEW_DOSSIERS', label: 'Voir les dossiers' },
            { id: 'CREATE_DOSSIERS', label: 'Créer des dossiers' },
            { id: 'EDIT_DOSSIERS', label: 'Modifier les dossiers' },
            { id: 'DELETE_DOSSIERS', label: 'Supprimer les dossiers' },
            { id: 'VIEW_CLIENTS', label: 'Voir les clients' },
            { id: 'MANAGE_CLIENTS', label: 'Gérer les clients' },
        ]
    },
    {
        name: 'Documents & GED',
        order: 2,
        permissions: [
            { id: 'VIEW_DOCUMENTS', label: 'Voir les documents' },
            { id: 'UPLOAD_DOCUMENTS', label: 'Ajouter des documents' },
            { id: 'DELETE_DOCUMENTS', label: 'Supprimer des documents' },
            { id: 'SIGN_DOCUMENTS', label: 'Signer des documents' },
            { id: 'MANAGE_TEMPLATES', label: 'Gérer les modèles' },
        ]
    },
    {
        name: 'Finance & Comptabilité',
        order: 3,
        permissions: [
            { id: 'VIEW_FINANCE', label: 'Voir les rapports financiers' },
            { id: 'MANAGE_INVOICES', label: 'Gérer la facturation' },
            { id: 'VIEW_CARPA', label: 'Voir les fonds CARPA' },
            { id: 'MANAGE_CARPA', label: 'Gérer les fonds CARPA' },
            { id: 'MANAGE_EXPENSES', label: 'Gérer les frais' },
        ]
    },
    {
        name: 'Agenda & Tâches',
        order: 4,
        permissions: [
            { id: 'VIEW_AGENDA', label: 'Voir l\'agenda global' },
            { id: 'MANAGE_EVENTS', label: 'Gérer les rendez-vous' },
            { id: 'MANAGE_TASKS', label: 'Gérer les tâches' },
        ]
    },
    {
        name: 'IA & Outils',
        order: 5,
        permissions: [
            { id: 'USE_LEXAI', label: 'Utiliser l\'IA LexAI' },
            { id: 'USE_PREDICTIVE_IA', label: 'Utiliser l\'IA prédictive' },
            { id: 'LEGAL_RESEARCH', label: 'Recherche juridique avancée' },
        ]
    },
    {
        name: 'Administration',
        order: 6,
        permissions: [
            { id: 'MANAGE_USERS', label: 'Gérer les utilisateurs' },
            { id: 'MANAGE_ROLES', label: 'Gérer les rôles' },
            { id: 'CABINET_SETTINGS', label: 'Paramètres du cabinet' },
            { id: 'VIEW_AUDIT_LOGS', label: 'Voir les logs d\'audit' },
            { id: 'VIEW_TECHNICAL_DOCS', label: 'Documentation technique' },
            { id: 'EXPORT_DATA', label: 'Exporter des données' },
        ]
    }
]

export default function AdminUsersPage({ users, roles }: { users: any[], roles: any[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isPermOpen, setIsPermOpen] = useState(false)
    const [isRoleOpen, setIsRoleOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [selectedPerms, setSelectedPerms] = useState<string[]>([])
    const [editData, setEditData] = useState({ name: '', email: '', roleId: '', hourlyRate: '' })

    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', roleId: roles[0]?.id || '', hourlyRate: '200' })

    const handleCreate = async () => {
        await createUser(newUser)
        setIsCreateOpen(false)
        setNewUser({ name: '', email: '', password: '', roleId: roles[0]?.id || '', hourlyRate: '200' })
        window.location.reload()
    }

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        await updateUserStatus(id, !currentStatus)
        window.location.reload()
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
        window.location.reload()
    }

    const togglePerm = (permId: string) => {
        if (selectedPerms.includes(permId)) {
            setSelectedPerms(selectedPerms.filter(p => p !== permId))
        } else {
            setSelectedPerms([...selectedPerms, permId])
        }
    }

    const openRoleDialog = (user: any) => {
        setSelectedUser(user)
        setIsRoleOpen(true)
    }

    const handleUpdateRole = async (newRole: string) => {
        if (!selectedUser) return
        await updateUserRole(selectedUser.id, newRole)
        setIsRoleOpen(false)
        window.location.reload()
    }

    const openEditDialog = (user: any) => {
        setSelectedUser(user)
        setEditData({
            name: user.name || '',
            email: user.email || '',
            roleId: user.roleId || '',
            hourlyRate: String(user.hourlyRate || 200)
        })
        setIsEditOpen(true)
    }

    const handleUpdateUser = async () => {
        if (!selectedUser) return
        const formData = new FormData()
        formData.append('id', selectedUser.id)
        formData.append('name', editData.name)
        formData.append('email', editData.email)
        formData.append('roleId', editData.roleId)
        formData.append('hourlyRate', editData.hourlyRate)

        await updateUser(null, formData)
        setIsEditOpen(false)
        window.location.reload()
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
                            <div className="grid gap-2">
                                <Label>Mot de passe temporaire</Label>
                                <Input
                                    type="password"
                                    placeholder="Ex: LexPremium2026!"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-500">L'utilisateur pourra le changer plus tard dans ses paramètres.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Rôle</Label>
                                    <Select value={newUser.roleId} onValueChange={v => setNewUser({ ...newUser, roleId: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={roles.length > 0 ? "Sélectionner un rôle" : "Aucun rôle disponible"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.length > 0 ? (
                                                roles.map(role => (
                                                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-xs text-slate-500 text-center">
                                                    Veuillez créer des rôles dans l'onglet "Rôles & Permissions" d'abord.
                                                </div>
                                            )}
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
                        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-6 py-4">
                                {PERMISSION_GROUPS.map((group) => (
                                    <div key={group.name} className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
                                            {group.name}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {group.permissions.map((perm) => (
                                                <div key={perm.id} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 transition-colors">
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

                {/* Role Dialog */}
                <Dialog open={isRoleOpen} onOpenChange={setIsRoleOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Modifier le Rôle</DialogTitle>
                            <DialogDescription>
                                Changer le rôle de {selectedUser?.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label>Nouveau Rôle</Label>
                            <Select value={selectedUser?.roleId} onValueChange={handleUpdateRole}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit User Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Modifier l'Utilisateur</DialogTitle>
                            <DialogDescription>
                                Modifiez les informations de {selectedUser?.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Nom complet</Label>
                                <Input
                                    value={editData.name}
                                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                                    placeholder="Nom de l'utilisateur"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email professionnel</Label>
                                <Input
                                    type="email"
                                    value={editData.email}
                                    onChange={e => setEditData({ ...editData, email: e.target.value })}
                                    placeholder="email@lexpremium.sn"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Rôle</Label>
                                    <Select value={editData.roleId} onValueChange={v => setEditData({ ...editData, roleId: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un rôle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map(role => (
                                                <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Taux Horaire (FCFA/h)</Label>
                                    <Input
                                        type="number"
                                        value={editData.hourlyRate}
                                        onChange={e => setEditData({ ...editData, hourlyRate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
                            <Button onClick={handleUpdateUser} className="bg-slate-900 text-white">
                                <Check className="mr-2 h-4 w-4" /> Enregistrer les Modifications
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
                                        <Badge
                                            variant="outline"
                                            className="cursor-pointer hover:bg-slate-100"
                                            onClick={() => openRoleDialog(user)}
                                        >
                                            {user.userRole?.name || user.role}
                                        </Badge>
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
                                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)} title="Modifier les informations">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => openPerms(user)} title="Gérer les privilèges">
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
