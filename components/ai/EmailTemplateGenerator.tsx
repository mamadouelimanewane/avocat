"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
    Mail,
    Copy,
    Download,
    Send,
    Search,
    FileText,
    RefreshCcw,
    Check
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { EMAIL_TEMPLATES, EmailTemplate } from "@/lib/email-templates"

export function EmailTemplateGenerator() {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
    const [variables, setVariables] = useState<Record<string, string>>({})
    const [generatedSubject, setGeneratedSubject] = useState("")
    const [generatedBody, setGeneratedBody] = useState("")
    const [copied, setCopied] = useState(false)
    const { toast } = useToast()

    const selectedTemplate = EMAIL_TEMPLATES.find(t => t.id === selectedTemplateId)

    useEffect(() => {
        if (selectedTemplate) {
            // Initialiser les variables vides
            const initialVars: Record<string, string> = {}
            selectedTemplate.variables.forEach(v => {
                initialVars[v] = ""
            })
            setVariables(initialVars)
            setGeneratedSubject(selectedTemplate.subject)
            setGeneratedBody(selectedTemplate.body)
        }
    }, [selectedTemplateId])

    useEffect(() => {
        if (selectedTemplate) {
            let subject = selectedTemplate.subject
            let body = selectedTemplate.body

            Object.entries(variables).forEach(([key, value]) => {
                const placeholder = `{${key}}`
                const replacement = value || placeholder
                subject = subject.replace(new RegExp(placeholder, 'g'), replacement)
                body = body.replace(new RegExp(placeholder, 'g'), replacement)
            })

            setGeneratedSubject(subject)
            setGeneratedBody(body)
        }
    }, [variables, selectedTemplate])

    const handleVariableChange = (key: string, value: string) => {
        setVariables(prev => ({ ...prev, [key]: value }))
    }

    const copyToClipboard = () => {
        const fullText = `Objet : ${generatedSubject}\n\n${generatedBody}`
        navigator.clipboard.writeText(fullText)
        setCopied(true)
        toast({
            title: "Copié !",
            description: "L'email a été copié dans le presse-papier."
        })
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSendEmail = () => {
        const mailtoLink = `mailto:?subject=${encodeURIComponent(generatedSubject)}&body=${encodeURIComponent(generatedBody)}`
        window.location.href = mailtoLink
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Mail className="h-8 w-8 text-indigo-600" />
                        Générateur de Templates Email
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Générez des communications professionnelles en quelques secondes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration Panel */}
                <div className="space-y-6 lg:col-span-1">
                    <Card className="border-indigo-100 shadow-sm">
                        <CardHeader className="bg-indigo-50/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Search className="h-4 w-4 text-indigo-600" />
                                1. Choisir un Modèle
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Type de Template</Label>
                                <Select onValueChange={setSelectedTemplateId} value={selectedTemplateId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un modèle..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EMAIL_TEMPLATES.map(template => (
                                            <SelectItem key={template.id} value={template.id}>
                                                {template.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedTemplate && (
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="bg-white">
                                        Catégorie : {selectedTemplate.category}
                                    </Badge>
                                    <Badge variant="outline" className="bg-white">
                                        {selectedTemplate.variables.length} variables
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {selectedTemplate && (
                        <Card className="border-indigo-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                            <CardHeader className="bg-indigo-50/50">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <RefreshCcw className="h-4 w-4 text-indigo-600" />
                                    2. Remplir les Variables
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {selectedTemplate.variables.map(variable => (
                                    <div key={variable} className="space-y-2">
                                        <Label className="capitalize">{variable.replace(/_/g, ' ')}</Label>
                                        <Input
                                            placeholder={`Ex: ${variable === 'montant' ? '500,000 FCFA' : '...'}`}
                                            value={variables[variable] || ""}
                                            onChange={(e) => handleVariableChange(variable, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-2">
                    <Card className="border-slate-200 shadow-sm min-h-[600px] flex flex-col">
                        <CardHeader className="border-b bg-slate-50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-indigo-600" />
                                    Aperçu du Mail
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={copyToClipboard}
                                        disabled={!selectedTemplateId}
                                    >
                                        {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                        Copier
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-indigo-600 hover:bg-indigo-700"
                                        onClick={handleSendEmail}
                                        disabled={!selectedTemplateId}
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Ouvrir dans mail
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 flex flex-col gap-4">
                            {!selectedTemplateId ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed rounded-lg">
                                    <Mail className="h-12 w-12 mb-2 opacity-20" />
                                    <p>Sélectionnez un modèle pour commencer</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-1 pb-4 border-b">
                                        <p className="text-xs font-semibold uppercase text-slate-500">Objet</p>
                                        <p className="text-lg font-medium text-slate-900">{generatedSubject}</p>
                                    </div>
                                    <ScrollArea className="flex-1">
                                        <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed font-medium">
                                            {generatedBody}
                                        </div>
                                    </ScrollArea>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
