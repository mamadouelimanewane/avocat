
"use client"

import { useState } from 'react'
import { Bot, X, Send, Sparkles, BookOpen, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from '@/components/ui/badge'
import { generateAIResponse } from '@/app/actions'

export function LexAIAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: 'Bonjour Maître. Je suis LexAI, votre assistant juridique expert en droit Sénégalais et OHADA. Comment puis-je vous aider ?' }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const [mode, setMode] = useState<'RESEARCH' | 'DRAFTING'>('RESEARCH')

    const handleSubmit = async () => {
        if (!query.trim()) return

        const newMsg = { role: 'user' as const, content: query }
        setMessages(prev => [...prev, newMsg])
        setQuery('')
        setIsLoading(true)

        const response = await generateAIResponse(newMsg.content, mode)

        setIsLoading(false)
        if (response.success) {
            setMessages(prev => [...prev, { role: 'ai', content: response.text || "Je n'ai pas pu générer de réponse." }])
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
            {/* Toggle Button */}
            <div className="pointer-events-auto">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`h-14 w-14 rounded-full shadow-xl transition-all duration-300 ${isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-indigo-600 hover:bg-indigo-700 animate-pulse'}`}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-8 w-8" />}
                </Button>
            </div>

            {/* Chat Interface */}
            <div className={`pointer-events-auto transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 h-0 w-0 overflow-hidden'}`}>
                <Card className="w-[400px] h-[600px] flex flex-col shadow-2xl border-indigo-200">
                    <CardHeader className="bg-indigo-600 text-white rounded-t-xl p-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-amber-300" />
                            <CardTitle className="text-lg">LexAI - Assistant Juridique</CardTitle>
                        </div>
                        <CardDescription className="text-indigo-100 text-xs">
                            Base de connaissances : J.O. Sénégal, Actes Uniformes OHADA.
                        </CardDescription>

                        <div className="flex gap-2 mt-2">
                            <Badge
                                variant={mode === 'RESEARCH' ? 'secondary' : 'outline'}
                                className="cursor-pointer bg-white/20 hover:bg-white/30 text-white border-transparent"
                                onClick={() => setMode('RESEARCH')}
                            >
                                <BookOpen className="mr-1 h-3 w-3" /> Recherche
                            </Badge>
                            <Badge
                                variant={mode === 'DRAFTING' ? 'secondary' : 'outline'}
                                className="cursor-pointer bg-white/20 hover:bg-white/30 text-white border-transparent"
                                onClick={() => setMode('DRAFTING')}
                            >
                                <FileText className="mr-1 h-3 w-3" /> Rédaction
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-slate-50">
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-lg p-3 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-500 flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 animate-spin text-indigo-500" />
                                            Analyse juridique en cours...
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-3 bg-white border-t border-slate-200">
                            <div className="relative">
                                <Input
                                    className="pr-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                                    placeholder={mode === 'RESEARCH' ? "Posez une question de droit..." : "Décrivez la clause à rédiger..."}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                />
                                <Button
                                    size="icon"
                                    className="absolute right-1 top-1 h-8 w-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
