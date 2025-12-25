
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
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, sources?: any[] }[]>([
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
            setMessages(prev => [...prev, {
                role: 'ai',
                content: response.text || "Je n'ai pas pu générer de réponse.",
                sources: response.sources
            }])
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
                                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} gap-1 w-full`}>
                                        <div className={`max-w-[90%] rounded-lg p-3 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                                            {m.content}
                                        </div>

                                        {/* SUGGESTED SOURCES (AI ONLY) */}
                                        {m.role === 'ai' && m.sources && m.sources.length > 0 && (
                                            <div className="flex flex-col gap-1 w-[90%] mt-1 animate-in fade-in slide-in-from-top-1 duration-500">
                                                <div className="text-[10px] uppercase font-bold text-slate-400 pl-1">Sources Suggérées</div>
                                                {m.sources.map((src, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={`/recherche?q=${encodeURIComponent(src.reference || src.title)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 p-2 bg-white border border-indigo-100 rounded text-xs text-indigo-800 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm group"
                                                    >
                                                        <FileText className="h-4 w-4 flex-shrink-0 text-indigo-400 group-hover:text-indigo-600" />
                                                        <div className="flex-1 truncate">
                                                            <div className="font-semibold text-indigo-700 truncate">{src.title}</div>
                                                            <div className="text-[10px] text-slate-500">{src.reference} • {src.type}</div>
                                                        </div>
                                                        <Badge variant="secondary" className="text-[9px] h-5 bg-indigo-50 text-indigo-600 group-hover:bg-white">
                                                            Voir
                                                        </Badge>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
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
