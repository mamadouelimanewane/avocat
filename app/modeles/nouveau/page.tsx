
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea' // Need to create this or use standard
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewTemplatePage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [category, setCategory] = useState('CONTRAT')
    const [content, setContent] = useState('Je soussigné, {{client.name}}, né le ...')
    const [detectedVariables, setDetectedVariables] = useState<string[]>([])

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value
        setContent(newContent)

        // Simple regex to find {{variables}}
        const regex = /\{\{([^}]+)\}\}/g;
        const matches = [];
        let match;
        while ((match = regex.exec(newContent)) !== null) {
            matches.push(match[1]);
        }
        // Unique variables
        setDetectedVariables(Array.from(new Set(matches)));
    }

    const saveTemplate = async () => {
        const res = await fetch('/api/templates', {
            method: 'POST',
            body: JSON.stringify({
                name,
                category,
                content,
                variables: JSON.stringify(detectedVariables)
            })
        })
        if (res.ok) {
            router.push('/modeles')
            router.refresh()
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Nouveau Modèle</h1>
                <Button onClick={saveTemplate} className="bg-slate-900 text-white">Enregistrer le Modèle</Button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Éditeur</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom du modèle</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Contrat de Bail Résidentiel" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="content">Contenu (Utilisez &#123;&#123;variable&#125;&#125; pour les champs dynamiques)</Label>
                                <textarea
                                    id="content"
                                    className="flex min-h-[400px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    value={content}
                                    onChange={handleContentChange}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Paramètres</CardTitle>
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
                                        <SelectItem value="AUTRE">Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Variables Détectées</Label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {detectedVariables.length === 0 && <span className="text-sm text-slate-500 italic">Aucune variable détectée</span>}
                                    {detectedVariables.map(v => (
                                        <span key={v} className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                                            {v}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    Conseil: Utilisez des préfixes comme <code>client.name</code> ou <code>dossier.ref</code> pour l'autocomplétion future.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
