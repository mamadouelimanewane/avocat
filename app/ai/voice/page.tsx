"use client"

import { VoiceAssistant } from '@/components/ai/VoiceAssistant'
import { VoiceDictation } from '@/components/ai/VoiceDictation'
import { Badge } from '@/components/ui/badge'
import {
    Mic,
    Sparkles,
    BrainCircuit,
    MessageSquare,
    Command,
    ShieldCheck
} from 'lucide-react'

export default function VoiceAssistantPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-8 space-y-12">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest">
                    <Sparkles className="h-3 w-3" /> Nouveau Module
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                    LexAI <span className="text-indigo-600">Voice Assistant</span>
                </h1>
                <p className="text-xl text-slate-500 font-medium">
                    Prenez le contrôle de votre cabinet par la voix. Dictée juridique haute précision & commandes vocales intelligentes.
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Presentation */}
                <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                        <FeatureCard
                            icon={Mic}
                            title="Dictée Juridique"
                            text="Transcrivez vos conclusions, actes et courriers avec une précision de 99% grâce à OpenAI Whisper."
                        />
                        <FeatureCard
                            icon={Command}
                            title="Commandes Vocales"
                            text="Naviguez dans l'app, créez des rendez-vous et recherchez des dossiers sans toucher votre clavier."
                        />
                        <FeatureCard
                            icon={BrainCircuit}
                            title="Interprétation LexAI"
                            text="Notre IA comprend le contexte juridique et structure automatiquement vos notes vocales."
                        />
                    </div>

                    <div className="p-8 bg-indigo-600 rounded-3xl text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck className="h-32 w-32" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Sécurité & Confidentialité</h3>
                        <p className="text-indigo-100 leading-relaxed">
                            Tous vos enregistrements sont traités via des canaux sécurisés. Aucune donnée vocale n'est stockée de manière permanente, garantissant le secret professionnel de vos dictées.
                        </p>
                    </div>
                </div>

                {/* Right: Dictation Tool */}
                <div>
                    <VoiceDictation />
                </div>
            </div>

            {/* Floating Assistant Indicator */}
            <div className="max-w-4xl mx-auto p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-2">L'Assistant Flottant est Actif</h3>
                <p className="text-sm text-slate-500 mb-6">Regardez en bas à droite de votre écran. Le bouton micro bleu vous permet de lancer des commandes globales à tout moment.</p>

                <div className="flex flex-wrap justify-center gap-4">
                    <Badge variant="secondary" className="px-4 py-2">"Ouvre le dossier TechCorp"</Badge>
                    <Badge variant="secondary" className="px-4 py-2">"Prendre RDV demain à 14h"</Badge>
                    <Badge variant="secondary" className="px-4 py-2">"Créer une note : Appeler l'huissier"</Badge>
                    <Badge variant="secondary" className="px-4 py-2">"Rechercher jurisprudence licenciement"</Badge>
                </div>
            </div>

            {/* The actual assistant (global component) */}
            <VoiceAssistant />
        </div>
    )
}

function FeatureCard({ icon: Icon, title, text }: { icon: any, title: string, text: string }) {
    return (
        <div className="flex gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-14 w-14 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Icon className="h-8 w-8" />
            </div>
            <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">{title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{text}</p>
            </div>
        </div>
    )
}
