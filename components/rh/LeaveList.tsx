
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { reviewLeaveRequest } from "@/app/actions"

export function LeaveList({ requests }: { requests: any[] }) {

    const handleReview = async (id: string, status: string) => {
        await reviewLeaveRequest(id, status)
    }

    if (requests.length === 0) return <div className="text-center text-slate-500 py-8">Aucune demande de congé.</div>

    return (
        <div className="space-y-4">
            {requests.map((req) => (
                <Card key={req.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-slate-900">{req.user?.name || 'Inconnu'}</p>
                            <div className="text-sm text-slate-500 flex items-center gap-2">
                                <Badge variant="outline">{req.type}</Badge>
                                <span>
                                    Du {format(new Date(req.startDate), 'dd MMM')} au {format(new Date(req.endDate), 'dd MMM yyyy', { locale: fr })}
                                </span>
                            </div>
                            {req.reason && <p className="text-xs text-slate-400 mt-1 italic">"{req.reason}"</p>}
                        </div>

                        <div className="flex items-center gap-2">
                            {req.status === 'PENDING' && (
                                <>
                                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => handleReview(req.id, 'REJECTED')}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => handleReview(req.id, 'APPROVED')}>
                                        <Check className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                            {req.status !== 'PENDING' && (
                                <Badge variant={req.status === 'APPROVED' ? 'success' : 'destructive'}>
                                    {req.status === 'APPROVED' ? 'Validé' : 'Refusé'}
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
