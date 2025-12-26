
"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Plus, Calendar, User, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTask, toggleTask } from "@/app/actions"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ExportButton } from "@/components/ui/ExportButton"

interface Task {
    id: string
    title: string
    completed: boolean
    dueDate: Date | null
    priority: string
    assignedTo: { id: string, name: string | null, avatarUrl: string | null } | null
    dossier: { id: string, reference: string, title: string } | null
}

interface User {
    id: string
    name: string | null
    role: string
}

export function TasksView({ tasks, users, dossiers }: { tasks: Task[], users: User[], dossiers: any[] }) {
    const [filter, setFilter] = useState("ALL")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newTask, setNewTask] = useState({
        title: '',
        dueDate: '',
        priority: 'NORMAL',
        assignedToId: '',
        dossierId: ''
    })

    const filteredTasks = tasks.filter(t => {
        if (filter === "ALL") return true
        if (filter === "MY") return true // identifying "my" requires auth context, strictly speaking. Mocking "ALL" for now.
        if (filter === "COMPLETED") return t.completed
        if (filter === "PENDING") return !t.completed
        return true
    })

    const handleCreate = async () => {
        await createTask({
            title: newTask.title,
            dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
            priority: newTask.priority,
            assignedToId: newTask.assignedToId || undefined,
            dossierId: newTask.dossierId || undefined
        })
        setIsCreateOpen(false)
        setNewTask({ title: '', dueDate: '', priority: 'NORMAL', assignedToId: '', dossierId: '' })
    }

    const handleToggle = async (id: string, current: boolean) => {
        await toggleTask(id, !current)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <Button variant={filter === "ALL" ? "default" : "outline"} onClick={() => setFilter("ALL")}>Toutes</Button>
                    <Button variant={filter === "PENDING" ? "default" : "outline"} onClick={() => setFilter("PENDING")}>À faire</Button>
                    <Button variant={filter === "COMPLETED" ? "default" : "outline"} onClick={() => setFilter("COMPLETED")}>Terminées</Button>
                </div>

                <div className="flex gap-2">
                    <ExportButton
                        data={filteredTasks.map(t => ({
                            Titre: t.title,
                            Statut: t.completed ? 'Terminé' : 'En cours',
                            Echeance: t.dueDate ? format(new Date(t.dueDate), 'yyyy-MM-dd') : '',
                            Priorite: t.priority,
                            Assigne_a: t.assignedTo?.name || 'Non assigné',
                            Dossier: t.dossier?.reference || 'Aucun'
                        }))}
                        filename="Liste_Taches"
                        sheetName="Taches"
                        label="Exporter Excel"
                    />
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-slate-900 text-white">
                                <Plus className="mr-2 h-4 w-4" /> Nouvelle Tâche
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Assigner une tâche</DialogTitle>
                                <DialogDescription>Créer une tâche pour vous ou un collaborateur.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Titre</Label>
                                    <Input value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="Ex: Rédiger conclusions..." />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Pour qui ?</Label>
                                    <Select value={newTask.assignedToId} onValueChange={v => setNewTask({ ...newTask, assignedToId: v })}>
                                        <SelectTrigger><SelectValue placeholder="Assigner à..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">Non assigné</SelectItem>
                                            {users.map(u => (
                                                <SelectItem key={u.id} value={u.id}>{u.name} ({u.role})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Dossier Lié</Label>
                                    <Select value={newTask.dossierId} onValueChange={v => setNewTask({ ...newTask, dossierId: v })}>
                                        <SelectTrigger><SelectValue placeholder="Lier à un dossier..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucun</SelectItem>
                                            {dossiers.map(d => (
                                                <SelectItem key={d.id} value={d.id}>{d.reference} - {d.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Échéance</Label>
                                        <Input type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Priorité</Label>
                                        <Select value={newTask.priority} onValueChange={v => setNewTask({ ...newTask, priority: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BASSE">Basse</SelectItem>
                                                <SelectItem value="NORMAL">Normale</SelectItem>
                                                <SelectItem value="HAUTE">Haute</SelectItem>
                                                <SelectItem value="URGENT">Urgente</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate} disabled={!newTask.title}>Créer Tâche</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        Aucune tâche trouvée.
                    </div>
                ) : filteredTasks.map(task => (
                    <Card key={task.id} className={`transition-all hover:shadow-md ${task.completed ? 'opacity-60 bg-slate-50' : 'bg-white'}`}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <button onClick={() => handleToggle(task.id, task.completed)} className="focus:outline-none">
                                {task.completed ? (
                                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                ) : (
                                    <Circle className="h-6 w-6 text-slate-300 hover:text-indigo-500" />
                                )}
                            </button>

                            <div className="flex-1 min-w-0">
                                <div className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                    {task.title}
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                    {task.dossier && (
                                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                            <Briefcase className="h-3 w-3" /> {task.dossier.reference}
                                        </span>
                                    )}
                                    {task.dueDate && (
                                        <span className={`flex items-center gap-1 ${!task.completed && new Date(task.dueDate) < new Date() ? 'text-red-500 font-bold' : ''}`}>
                                            <Calendar className="h-3 w-3" /> {format(new Date(task.dueDate), "d MMM", { locale: fr })}
                                        </span>
                                    )}
                                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${task.priority === 'URGENT' ? 'border-red-200 bg-red-50 text-red-700' : ''}`}>
                                        {task.priority}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {task.assignedTo ? (
                                    <div className="flex items-center gap-2" title={`Assigné à ${task.assignedTo.name}`}>
                                        <span className="text-xs text-slate-500 hidden md:inline">Pour {task.assignedTo.name?.split(' ')[0]}</span>
                                        <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                            <AvatarImage src={task.assignedTo.avatarUrl || undefined} />
                                            <AvatarFallback>{task.assignedTo.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-400 italic">Non assigné</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
