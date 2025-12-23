
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTemplate, updateTemplate, deleteTemplate } from '@/app/actions'
import { Trash2, Save } from 'lucide-react'

interface TemplateData {
    id?: string
    name: string
    category: string
    content: string
    variables: string
}

export function TemplateEditor({ initialData }: { initialData?: TemplateData }) {
    const router = useRouter()
    const [name, setName] = useState(initialData?.name || '')
    const [category, setCategory] = useState(initialData?.category || 'CONTRAT')
    const [content, setContent] = useState(initialData?.content || 'Je soussigné, {{client.name}}...')
    const [detectedVariables, setDetectedVariables] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        detectVariables(content)
    }, [content])

    const detectVariables = (text: string) => {
        const regex = /\{\{([^}]+)\}\}/g;
        const matches = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push(match[1]);
        }
        setDetectedVariables(Array.from(new Set(matches)));
    }

    const handleSave = async () => {
        setIsLoading(true)
        const data = {
            name,
            category,
            content,
            variables: detectedVariables
        }

        let res;
        if (initialData?.id) {
            res = await updateTemplate(initialData.id, data)
        } else {
            res = await createTemplate(data)
        }

        setIsLoading(false)

        if (res.success) {
            router.push('/modeles')
            router.refresh()
        } else {
            alert('Erreur: ' + res.message)
        }
    }

    const handleDelete = async () => {
        if (!initialData?.id) return
        if (confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
            await deleteTemplate(initialData.id)
            router.push('/modeles')
            router.refresh()
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">
                    {initialData ? 'Modifier le Modèle' : 'Nouveau Modèle'}
                </h1>
                <div className="flex gap-2">
                    {initialData && (
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </Button>
                    )}
                    <Button onClick={handleSave} className="bg-slate-900 text-white" disabled={isLoading}>
                        <Save className="mr-2 h-4 w-4" /> Enregistrer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contenu du document</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom du modèle</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Contrat de Bail" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="content">Éditeur (Markdown / Texte)</Label>
                                <textarea
                                    id="content"
                                    className="flex min-h-[500px] w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="Saisissez votre texte ici. Utilisez {{nom_variable}} pour insérer des champs dynamiques."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Catégorie</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CONTRAT">Contrat</SelectItem>
                                        <SelectItem value="ASSIGNATION">Assignation</SelectItem>
                                        <SelectItem value="COURRIER">Courrier</SelectItem>
                                        <SelectItem value="AFFAIRES">Droit des Affaires</SelectItem>
                                        <SelectItem value="FONCIER">Droit Foncier</SelectItem>
                                        <SelectItem value="TRAVAIL">Droit du Travail</SelectItem>
                                        <SelectItem value="AUTRE">Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2 block">Variables Détectées ({detectedVariables.length})</Label>
                                <div className="flex flex-wrap gap-2">
                                    {detectedVariables.length === 0 && <span className="text-sm text-slate-500 italic">Aucune variable. Tapez &#123;&#123;variable&#125;&#125; dans le texte.</span>}
                                    {detectedVariables.map(v => (
                                        <span key={v} className="inline-flex items-center rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                                            {v}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3 rounded text-xs text-slate-500 space-y-2">
                                <p className="font-semibold">Variables Système :</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li><code>client.name</code></li>
                                    <li><code>client.address</code></li>
                                    <li><code>dossier.reference</code></li>
                                    <li><code>date.today</code></li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
