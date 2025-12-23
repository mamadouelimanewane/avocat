
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { createLeaveRequest } from "@/app/actions"
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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function LeaveRequestDialog({ users }: { users: any[] }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [userId, setUserId] = useState(users[0]?.id || '')
    const [type, setType] = useState('CONGE_PAYE')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [reason, setReason] = useState('')

    const handleSubmit = async () => {
        setIsLoading(true)
        await createLeaveRequest({
            userId,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason
        })
        setIsLoading(false)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 text-white">
                    <Calendar className="mr-2 h-4 w-4" /> Demande de Congé
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nouvelle demande d'absence</DialogTitle>
                    <DialogDescription>Soumettez votre demande de congés.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Collaborateur</Label>
                        <Select value={userId} onValueChange={setUserId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner..." />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map(u => (
                                    <SelectItem key={u.id} value={u.id}>{u.name} ({u.role})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Type d'absence</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CONGE_PAYE">Congés Payés</SelectItem>
                                <SelectItem value="MALADIE">Maladie</SelectItem>
                                <SelectItem value="RECUP">Récupération</SelectItem>
                                <SelectItem value="SANS_SOLDE">Sans Solde</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Date Début</Label>
                            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Date Fin</Label>
                            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Motif (Optionnel)</Label>
                        <Textarea value={reason} onChange={e => setReason(e.target.value)} />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isLoading}>Soumettre</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
