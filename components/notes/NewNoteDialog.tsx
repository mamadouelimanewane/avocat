"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, StickyNote, Mic, Square, Save, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { createNote } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const noteSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    color: z.string().default("blue"),
})

export function NewNoteDialog({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [activeTab, setActiveTab] = useState("text")
    const { toast } = useToast()

    // Audio State
    const [isRecording, setIsRecording] = useState(false)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [recordingTime, setRecordingTime] = useState(0)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const form = useForm<z.infer<typeof noteSchema>>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            title: "",
            content: "",
            color: "blue",
        },
    })

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            const chunks: BlobPart[] = []

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data)
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' })
                setAudioBlob(blob)
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)

            // Timer
            let seconds = 0
            timerRef.current = setInterval(() => {
                seconds++
                setRecordingTime(seconds)
            }, 1000)

        } catch (err) {
            toast({
                title: "Erreur microphone",
                description: "Impossible d'accéder au microphone.",
                variant: "destructive"
            })
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }

    const resetAudio = () => {
        setAudioBlob(null)
        setRecordingTime(0)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // Convert Blob to Base64
    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    }

    async function onSubmit(values: z.infer<typeof noteSchema>) {
        if (activeTab === 'text' && !values.content) {
            form.setError('content', { message: "Le contenu est requis" })
            return
        }
        if (activeTab === 'audio' && !audioBlob) {
            toast({ title: "Aucun enregistrement", description: "Veuillez enregistrer un message audio.", variant: "destructive" })
            return
        }

        setIsPending(true)
        try {
            let audioContent = null
            if (activeTab === 'audio' && audioBlob) {
                audioContent = await blobToBase64(audioBlob)
            }

            const result = await createNote({
                title: values.title || (activeTab === 'audio' ? 'Note Audio' : 'Nouvelle Note'),
                content: values.content,
                audioContent: audioContent,
                type: activeTab === 'audio' ? 'AUDIO' : 'TEXT',
                color: values.color,
                isPinned: false
            })

            if (result.success) {
                toast({ title: "Note créée avec succès" })
                setOpen(false)
                form.reset()
                resetAudio()
            } else {
                toast({ title: "Erreur", description: result.message, variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" })
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" className="gap-2">
                        <StickyNote className="h-4 w-4" /> Note / Audio
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Créer une note</DialogTitle>
                    <DialogDescription>Ajoutez une note rapide ou un mémo vocal.</DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="text">Texte</TabsTrigger>
                        <TabsTrigger value="audio">Audio</TabsTrigger>
                    </TabsList>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Titre (Optionnel)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Titre de la note..." {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <TabsContent value="text" className="mt-0">
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Écrivez votre note ici..."
                                                        className="min-h-[150px] resize-none focus-visible:ring-amber-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>

                                <TabsContent value="audio" className="mt-0 space-y-4">
                                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-slate-50">
                                        {!audioBlob ? (
                                            <>
                                                <div className="text-4xl font-mono font-bold text-slate-700 mb-4">
                                                    {formatTime(recordingTime)}
                                                </div>
                                                {!isRecording ? (
                                                    <Button type="button" size="lg" variant="destructive" className="rounded-full w-16 h-16" onClick={startRecording}>
                                                        <Mic className="h-8 w-8" />
                                                    </Button>
                                                ) : (
                                                    <Button type="button" size="lg" variant="outline" className="rounded-full w-16 h-16 border-red-500 text-red-500 hover:bg-red-50 animate-pulse" onClick={stopRecording}>
                                                        <Square className="h-6 w-6 fill-current" />
                                                    </Button>
                                                )}
                                                <p className="text-sm text-slate-500 mt-4">
                                                    {isRecording ? "Enregistrement en cours..." : "Cliquez pour enregistrer"}
                                                </p>
                                            </>
                                        ) : (
                                            <div className="w-full space-y-4 text-center">
                                                <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center justify-center gap-3">
                                                    <Mic className="h-5 w-5" />
                                                    <span className="font-semibold">Mémo enregistré ({formatTime(recordingTime)})</span>
                                                </div>
                                                <div className="flex justify-center">
                                                    <audio controls src={URL.createObjectURL(audioBlob)} className="w-full max-w-xs" />
                                                </div>
                                                <Button type="button" variant="ghost" size="sm" onClick={resetAudio} className="text-slate-500">
                                                    <RotateCcw className="mr-2 h-4 w-4" /> Recommencer
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <FormField
                                    control={form.control}
                                    name="color"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Couleur</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex space-x-2"
                                                >
                                                    {['blue', 'green', 'yellow', 'red', 'purple'].map((color) => (
                                                        <FormItem key={color} className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value={color} className={`w-8 h-8 rounded-full border-2 ${color === 'blue' ? 'bg-blue-100 border-blue-500 text-blue-600' :
                                                                        color === 'green' ? 'bg-green-100 border-green-500 text-green-600' :
                                                                            color === 'yellow' ? 'bg-yellow-100 border-yellow-500 text-yellow-600' :
                                                                                color === 'red' ? 'bg-red-100 border-red-500 text-red-600' :
                                                                                    'bg-purple-100 border-purple-500 text-purple-600'
                                                                    }`} />
                                                            </FormControl>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={isPending || isRecording} className="bg-slate-900 text-white w-full sm:w-auto">
                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Enregistrer la note
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
