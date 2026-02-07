"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Send,
    CheckCircle2,
    Loader2,
    Sparkles,
    Bot,
    MessageSquare,
    User,
    Building2,
    Briefcase,
    ArrowRight
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function SmartLeadForm() {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'PARTICULIER',
        domaine: 'CIVIL',
        description: '',
        urgency: 'MEDIUM'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulation of lead processing and scoring
        await new Promise(resolve => setTimeout(resolve, 2000))

        setIsSubmitting(false)
        setIsSuccess(true)
    }

    if (isSuccess) {
        return (
            <Card className="border-none shadow-xl bg-emerald-50 max-w-lg mx-auto overflow-hidden animate-in zoom-in duration-500">
                <CardContent className="p-12 text-center space-y-4">
                    <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black text-emerald-900">Demande Reçue !</h2>
                    <p className="text-emerald-700 font-medium">
                        Merci {formData.name.split(' ')[0]}. Un avocat spécialisé en <strong>Droit {formData.domaine.toLowerCase()}</strong> examine actuellement votre demande.
                    </p>
                    <div className="p-4 bg-white rounded-xl border border-emerald-200 mt-6 flex items-center gap-4 text-left">
                        <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-emerald-900">Estimation LexAI</p>
                            <p className="text-[10px] text-emerald-600">Réponse prévue sous : <span className="font-bold">45 minutes</span></p>
                        </div>
                    </div>
                    <Button variant="outline" className="mt-8 border-emerald-200 text-emerald-700 hover:bg-white" onClick={() => setIsSuccess(false)}>
                        Nouvelle demande
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-none shadow-2xl max-w-lg mx-auto overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="border-blue-400 text-blue-400 font-bold uppercase tracking-tighter text-[10px]">IA Piloté</Badge>
                </div>
                <CardTitle className="text-2xl font-black">Consultation Gratuite</CardTitle>
                <CardDescription className="text-slate-400">Décrivez votre besoin, notre IA vous orientera vers le meilleur expert.</CardDescription>
            </CardHeader>

            <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-slate-500">Type de Client</Label>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'PARTICULIER' })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${formData.type === 'PARTICULIER' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    <User className="h-3 w-3" /> Particulier
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'ENTREPRISE' })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${formData.type === 'ENTREPRISE' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    <Building2 className="h-3 w-3" /> Entreprise
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-slate-500">Urgence</Label>
                            <Select value={formData.urgency} onValueChange={(v) => setFormData({ ...formData, urgency: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Basse (Conseil)</SelectItem>
                                    <SelectItem value="MEDIUM">Moyenne</SelectItem>
                                    <SelectItem value="HIGH">Haute (Procédure)</SelectItem>
                                    <SelectItem value="URGENT">Critique (24h)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-slate-500">Domaine de compétence</Label>
                        <Select value={formData.domaine} onValueChange={(v) => setFormData({ ...formData, domaine: v })}>
                            <SelectTrigger className="h-12 border-2 border-slate-100 focus:border-blue-600 transition-all">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CIVIL">Droit Civil & Famille</SelectItem>
                                <SelectItem value="COMMERCIAL">Droit Commercial & OHADA</SelectItem>
                                <SelectItem value="PENAL">Droit Pénal</SelectItem>
                                <SelectItem value="ADMINISTRATIF">Droit Administratif</SelectItem>
                                <SelectItem value="IMMOBILIER">Droit Immobilier</SelectItem>
                                <SelectItem value="SOCIAL">Droit du Travail</SelectItem>
                                <SelectItem value="AUTRE">Autres</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-slate-500">Nom Complet</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Babakar Ndiaye"
                            className="h-12 border-2 border-slate-100 focus:border-blue-600 transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-slate-500">Email</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="b.ndiaye@email.sn"
                                className="h-12 border-2 border-slate-100"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-slate-500">Téléphone</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+221 77..."
                                className="h-12 border-2 border-slate-100"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-slate-500">Résumé de votre situation</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Expliquez brièvement votre besoin..."
                            className="min-h-[120px] border-2 border-slate-100 focus:border-blue-600 transition-all"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-lg font-black shadow-xl shadow-blue-100 transition-all group"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                Envoyer ma demande
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>

                    <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4 border-t border-slate-50">
                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Sécurisé</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Analyse IA</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Confidentiel</span>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
