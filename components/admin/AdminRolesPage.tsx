"use client"

import { useState } from 'react'
import { Shield, Plus, Edit, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createRole, updateRoleData, deleteRole } from '@/app/actions'
import { Checkbox } from '@/components/ui/checkbox'

const AVAILABLE_PERMISSIONS = [
    { id: 'VIEW_FINANCE', label: 'Voir Finances & CARPA' },
    { id: 'MANAGE_FINANCE', label: 'Gérer Transactions (CARPA/Frais)' },
    { id: 'MANAGE_USERS', label: 'Gérer Utilisateurs (Admin)' },
    { id: 'DELETE_DOSSIER', label: 'Supprimer Dossiers' },
    { id: 'EXPORT_DATA', label: 'Exporter Données' },
    { id: 'MANAGE_ROLES', label: 'Gérer les Rôles' },
    { id: 'VIEW_TECHNICAL_DOCS', label: 'Voir Documentation Technique' },
]

export default function AdminRolesPage({ roles }: { roles: any[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<any>(null)
    const [newRole, setNewRole] = useState({ name: '', description: '', permissions: [] as string[] })
    const [editRole, setEditRole] = useState({ name: '', description: '', permissions: [] as string[] })

    const handleCreate = async () => {
        await createRole({
            ...newRole,
            permissions: JSON.stringify(newRole.permissions)
        })
        setIsCreateOpen(false)
        setNewRole({ name: '', description: '', permissions: [] })
        window.location.reload()
    }

    const handleEdit = (role: any) => {
        setSelectedRole(role)
        setEditRole({
            name: role.name,
            description: role.description || '',
            permissions: JSON.parse(role.permissions || '[]')
        })
        setIsEditOpen(true)
    }

    const handleUpdate = async () => {
        if (!selectedRole) return
        await updateRoleData(selectedRole.id, {
            ...editRole,
            permissions: JSON.stringify(editRole.permissions)
        })
        setIsEditOpen(false)
        window.location.reload()
    }

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
            const res = await deleteRole(id)
            if (!res.success) alert(res.message)
            else window.location.reload()
        }
    }

    const togglePermission = (roleType: 'new' | 'edit', permId: string) => {
        if (roleType === 'new') {
            const perms = newRole.permissions.includes(permId)
                ? newRole.permissions.filter(p => p !== permId)
                : [...newRole.permissions, permId]
            setNewRole({ ...newRole, permissions: perms })
        } else {
            const perms = editRole.permissions.includes(permId)
                ? editRole.permissions.filter(p => p !== permId)
                : [...editRole.permissions, permId]
            setEditRole({ ...editRole, permissions: perms })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">Gestion des Rôles</h2>
                    <p className="text-slate-500">Créez et configurez les rôles d'accès du cabinet.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-900 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Nouveau Rôle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Créer un Nouveau Rôle</DialogTitle>
                            <DialogDescription>Définissez le nom, la description et les permissions par défaut.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Nom du rôle (ex: COLLABORATEUR SENIOR)</Label>
                                <Input value={newRole.name} onChange={e => setNewRole({ ...newRole, name: e.target.value.toUpperCase() })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <Textarea value={newRole.description} onChange={e => setNewRole({ ...newRole, description: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Permissions par défaut</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {AVAILABLE_PERMISSIONS.map(perm => (
                                        <div key={perm.id} className="flex items-center space-x-2 border p-2 rounded hover:bg-slate-50">
                                            <Checkbox
                                                id={`new-${perm.id}`}
                                                checked={newRole.permissions.includes(perm.id)}
                                                onCheckedChange={() => togglePermission('new', perm.id)}
                                            />
                                            <label htmlFor={`new-${perm.id}`} className="text-xs cursor-pointer">{perm.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate}>Créer le Rôle</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom du Rôle</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Permissions</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((role) => {
                            const perms = JSON.parse(role.permissions || '[]')
                            return (
                                <TableRow key={role.id}>
                                    <TableCell className="font-bold">{role.name}</TableCell>
                                    <TableCell className="text-slate-500 text-sm max-w-[300px] truncate">
                                        {role.description}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                                            {perms.length} permission(s)
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(role)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(role.id)} className="text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Modifier le Rôle : {selectedRole?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Nom du rôle</Label>
                            <Input value={editRole.name} onChange={e => setEditRole({ ...editRole, name: e.target.value.toUpperCase() })} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <Textarea value={editRole.description} onChange={e => setEditRole({ ...editRole, description: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Permissions par défaut</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {AVAILABLE_PERMISSIONS.map(perm => (
                                    <div key={perm.id} className="flex items-center space-x-2 border p-2 rounded hover:bg-slate-50">
                                        <Checkbox
                                            id={`edit-${perm.id}`}
                                            checked={editRole.permissions.includes(perm.id)}
                                            onCheckedChange={() => togglePermission('edit', perm.id)}
                                        />
                                        <label htmlFor={`edit-${perm.id}`} className="text-xs cursor-pointer">{perm.label}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUpdate}>Enregistrer les Modifications</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
