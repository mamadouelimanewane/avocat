
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, StickyNote } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { createTask, getDossiersList } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect } from "react"

const noteSchema = z.object({
    content: z.string().min(5, "Le contenu de la note est trop court"),
    dossierId: z.string().optional(),
})

export function NewNoteDialog({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [dossiers, setDossiers] = useState<any[]>([])
    const { toast } = useToast()

    const form = useForm<z.infer<typeof noteSchema>>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            content: "",
            dossierId: "none",
        },
    })

    useEffect(() => {
        if (open) {
            getDossiersList().then(setDossiers)
        }
    }, [open])

    async function onSubmit(values: z.infer<typeof noteSchema>) {
        setIsPending(true)
        try {
            // Create a Task as a "Note" for now
            const result = await createTask({
                title: `NOTE: ${values.content.substring(0, 30)}...`,
                description: values.content,
                priority: "NORMAL",
                dossierId: values.dossierId !== "none" ? values.dossierId : undefined,
            })

            if (result.success) {
                toast({
                    title: "Note enregistrée",
                    description: "La note a été ajoutée à vos tâches/mémos.",
                })
                setOpen(false)
                form.reset()
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible d'enregistrer la note.",
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue.",
            })
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" className="gap-2">
                        <StickyNote className="h-4 w-4" /> Note
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nouvelle Note</DialogTitle>
                    <DialogDescription>
                        Épinglez une information importante (Mémo).
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="dossierId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dossier (Optionnel)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Associer à un dossier..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">Aucun dossier</SelectItem>
                                            {dossiers.map(d => (
                                                <SelectItem key={d.id} value={d.id}>{d.reference} - {d.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contenu de la note</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Saisissez votre note ici..."
                                            className="min-h-[120px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                                Fermer
                            </Button>
                            <Button type="submit" disabled={isPending} className="bg-amber-500 hover:bg-amber-600 text-white">
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Enregistrer la note
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
