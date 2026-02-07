
"use client"

import { useState, useRef, useEffect } from "react"
import {
    MessageCircle,
    X,
    Send,
    ShieldCheck,
    User,
    Phone,
    MapPin,
    ArrowRight,
    Loader2,
    Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { generatePublicLegalAdvice } from "@/app/actions"

// Helper component for topic buttons
const TopicButton = ({ onClick, icon, label }: { onClick: () => void, icon: string, label: string }) => (
    <Button onClick={onClick} variant="outline" className="h-14 border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-600 justify-start font-bold text-base rounded-xl transition-all duration-200 group">
        <span className="mr-3 text-xl group-hover:scale-110 transition-transform">{icon}</span> {label}
    </Button>
)

// Helper for formatted message content
const MessageContent = ({ text }: { text: string }) => {
    const paragraphs = text.split('\n').filter(p => p.trim() !== "");
    return (
        <div className="space-y-3">
            {paragraphs.map((paragraph, idx) => {
                // Handle basic bold **text** and bullet points
                let content: any = paragraph;

                // Bullet points
                const isBullet = paragraph.trim().startsWith('* ');
                const cleanText = isBullet ? paragraph.trim().substring(2) : paragraph;

                const parts = cleanText.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                });

                if (isBullet) {
                    return (
                        <div key={idx} className="flex gap-2 pl-2">
                            <span className="text-cyan-500 font-bold">•</span>
                            <p className="flex-1">{parts}</p>
                        </div>
                    );
                }

                return <p key={idx} className="leading-relaxed">{parts}</p>;
            })}
        </div>
    );
}

export function LexPublicChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<'welcome' | 'qualification' | 'chat' | 'contact'>('welcome')
    const [messages, setMessages] = useState<Array<{ role: 'bot' | 'user', text: string }>>([])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState("")

    // Elegant African Woman Avatar URL
    const avatarUrl = "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400"

    // Scrolls to bottom
    const scrollRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const startChat = (topic: string) => {
        setSelectedTopic(topic)
        setStep('chat')
        setMessages([
            { role: 'bot', text: `Quel immense honneur de vous accueillir. Je suis LexPublic, votre humble guide angélique.` },
            { role: 'bot', text: `J'ai noté que votre demande concerne : ${topic}.` },
            { role: 'bot', text: "Comment puis-je éclairer votre chemin aujourd'hui ? Posez-moi votre question en toute simplicité." }
        ])
    }

    const handleSend = async () => {
        if (!input.trim()) return
        const userMsg = input
        setMessages(prev => [...prev, { role: 'user', text: userMsg }])
        setInput("")
        setIsTyping(true)

        try {
            const response = await generatePublicLegalAdvice(userMsg, selectedTopic)
            setIsTyping(false)

            if (response.success) {
                setMessages(prev => [...prev, { role: 'bot', text: response.text! }])

                // Discretely offer professional help after a longer delay, or based on message length
                const readingTime = Math.min(Math.max(response.text!.length * 30, 5000), 15000);

                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        role: 'bot',
                        text: "Si vous souhaitez transformer ces humbles informations en une défense certifiée, seriez-vous disposé à ce qu'un Avocat du cabinet LexPremium vous recontacte ?"
                    }])
                    // We don't jump to contact step automatically anymore, we show buttons instead
                }, readingTime)
            } else {
                setMessages(prev => [...prev, { role: 'bot', text: "Je vous présente mes excuses les plus sincères, mais mon esprit rencontre un obstacle technique. Puis-je vous aider d'une autre manière ?" }])
            }
        } catch (error) {
            setIsTyping(false)
            console.error(error)
            setMessages(prev => [...prev, { role: 'bot', text: "Mes excuses, une erreur inattendue est survenue. Veuillez réessayer plus tard." }])
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 font-sans">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="h-20 w-20 rounded-full bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] border-4 border-cyan-500 transition-all hover:scale-110 flex items-center justify-center overflow-hidden group relative p-0"
                >
                    <img
                        src={avatarUrl}
                        alt="Angelic Guide"
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
                    />
                    <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-transparent" />
                    <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">AIDE</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[350px] md:w-[420px] h-[650px] border-none shadow-[0_20px_60px_rgba(0,0,0,0.2)] bg-white flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 rounded-[2.5rem]">

                    {/* Header - Divine/Light Style */}
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 flex flex-col shrink-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-2xl" />

                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-14 w-14 border-4 border-white/20 shadow-xl">
                                        <AvatarImage src={avatarUrl} className="object-cover" />
                                        <AvatarFallback>LP</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-400 rounded-full border-4 border-cyan-600 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-lg tracking-tight">LexPublic</h3>
                                    <p className="text-[10px] font-bold text-cyan-100 uppercase tracking-widest flex items-center gap-1.5">
                                        <Sparkles className="h-3 w-3" /> Votre Guide Bienveillant
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">

                        {step === 'welcome' && (
                            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center space-y-8 animate-in zoom-in-95">
                                <div className="space-y-3">
                                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">Bienvenue, cher Citoyen.</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Je suis ici pour écouter vos préoccupations avec toute la bienveillance que vous méritez. Quelle direction souhaitez-vous prendre ?
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 w-full gap-3">
                                    <TopicButton onClick={() => startChat('Droit du Travail')} icon="👔" label="Travail" />
                                    <TopicButton onClick={() => startChat('Famille / Succession')} icon="🏠" label="Famille" />
                                    <TopicButton onClick={() => startChat('Foncier / Immobilier')} icon="🏗️" label="Immobilier" />
                                    <TopicButton onClick={() => startChat('Droit des Affaires')} icon="🏢" label="Affaires" />

                                    {/* NOUVELLES CATEGORIES */}
                                    <TopicButton onClick={() => startChat('Droit Pénal')} icon="⚖️" label="Pénal" />
                                    <TopicButton onClick={() => startChat('Fiscalité')} icon="💰" label="Fiscalité" />
                                    <TopicButton onClick={() => startChat('Droit Administratif')} icon="🏛️" label="Administratif" />
                                    <TopicButton onClick={() => startChat('Autre Demande')} icon="🌐" label="Autre / Incertain" />
                                </div>
                            </div>
                        )}

                        {(step === 'chat' || step === 'contact') && (
                            <>
                                <ScrollArea className="flex-1 p-6">
                                    <div className="space-y-6 pb-4">
                                        {messages.map((msg, idx) => (
                                            <div key={idx} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                                                {msg.role === 'bot' && (
                                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                                                        <AvatarImage src={avatarUrl} className="object-cover" />
                                                        <AvatarFallback>LP</AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className={cn(
                                                    "p-4 rounded-2xl text-sm shadow-sm",
                                                    msg.role === 'user'
                                                        ? "bg-cyan-600 text-white rounded-tr-none font-medium"
                                                        : "bg-white border border-slate-100 text-slate-700 rounded-tl-none font-medium"
                                                )}>
                                                    <MessageContent text={msg.text} />

                                                    {/* If it's the specific offer message, show action buttons */}
                                                    {msg.role === 'bot' && msg.text.includes("seriez-vous disposé à ce qu'un Avocat") && (
                                                        <div className="mt-4 flex flex-col gap-2">
                                                            <Button
                                                                onClick={() => setStep('contact')}
                                                                className="bg-slate-900 text-white hover:bg-black text-[10px] font-bold h-10 rounded-xl"
                                                            >
                                                                OUI, ÊTRE RAPPELE
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => setMessages(prev => [...prev, { role: 'bot', text: "Très bien, je reste à votre entière disposition pour d'autres questions." }])}
                                                                className="border-slate-200 text-slate-500 text-[10px] font-bold h-10 rounded-xl"
                                                            >
                                                                NON, CONTINUER À DISCUTER
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {isTyping && (
                                            <div className="flex gap-3 items-center text-xs text-slate-400 font-bold ml-14">
                                                <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />
                                                LexPublic réfléchit avec sagesse...
                                            </div>
                                        )}
                                        <div ref={scrollRef} />
                                    </div>
                                </ScrollArea>

                                {step === 'contact' ? (
                                    <div className="p-6 bg-white border-t border-slate-100 animate-in slide-in-from-bottom flex flex-col gap-4">
                                        <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-2xl mb-2">
                                            <p className="text-xs font-black text-cyan-800 mb-1 flex items-center gap-2">
                                                <Phone className="h-3 w-3" /> RAPPEL GRATUIT PAR UN AVOCAT
                                            </p>
                                            <p className="text-[10px] text-cyan-600 font-bold">Un spécialiste reviendra vers vous pour une analyse certifiée.</p>
                                        </div>
                                        <div className="space-y-3">
                                            <Input placeholder="Votre Nom complet" className="bg-slate-50 border-slate-200 h-12 rounded-xl" />
                                            <Input placeholder="Votre Téléphone" className="bg-slate-50 border-slate-200 h-12 rounded-xl" />
                                        </div>
                                        <Button className="w-full bg-slate-900 hover:bg-black text-white font-black h-14 rounded-xl shadow-xl transition-all hover:scale-[1.02]">
                                            DÈMANDER LE RAPPEL
                                        </Button>
                                        <Button variant="ghost" onClick={() => setStep('welcome')} className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                            Retour au menu
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
                                        <Input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Posez votre question avec courtoisie..."
                                            className="bg-slate-50 border-slate-200 focus-visible:ring-cyan-500 h-12 rounded-xl font-medium"
                                        />
                                        <Button
                                            size="icon"
                                            onClick={handleSend}
                                            className="bg-cyan-500 hover:bg-cyan-600 text-white shrink-0 h-12 w-12 rounded-xl shadow-lg"
                                        >
                                            <Send className="h-5 w-5" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Card>
            )}
        </div>
    )
}
